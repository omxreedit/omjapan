#!/system/bin/sh
# OMJAPAN — build a signed, verifiable APK with the Termux toolchain.
# No Gradle, no Android Studio, no secrets in the repository.
set -eu

ANDROID_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$ANDROID_DIR/.." && pwd)"
VERSION="${OMJAPAN_VERSION:-1.0.1}"
VERSION_CODE="${OMJAPAN_VERSION_CODE:-2}"
BUILD="$ANDROID_DIR/build"
GEN="$BUILD/gen"
CLASSES="$BUILD/classes"
DEX="$BUILD/dex"
ASSETS="$ANDROID_DIR/assets"
WEB="$ASSETS/www"
CONTENT="$ASSETS/content"
SDK_JAR="${ANDROID_JAR:-$ANDROID_DIR/libs/android.jar}"
SECRET_DIR="${OMJAPAN_SECRET_DIR:-$HOME/.omjapan}"
KEYSTORE="$SECRET_DIR/omjapan-release.jks"
PASSFILE="$SECRET_DIR/ks.pass"
KS_ALIAS="${OMJAPAN_KS_ALIAS:-omjapan}"
OUT_DIR="$ROOT/release"
OUT="$OUT_DIR/omjapan-$VERSION.apk"

for tool in aapt javac keytool d8 apksigner; do
  command -v "$tool" >/dev/null 2>&1 || { echo "Missing tool: $tool" >&2; exit 1; }
done

if [ ! -f "$SDK_JAR" ]; then
  echo "Preparing android.jar (API 34)…"
  mkdir -p "$(dirname "$SDK_JAR")"
  AURA_JAR="$ROOT/../aura-liquid-glass-player/android/libs/android.jar"
  if [ -f "$AURA_JAR" ]; then
    cp "$AURA_JAR" "$SDK_JAR"
  else
    curl -L --fail --retry 3 -o "$SDK_JAR" \
      "https://raw.githubusercontent.com/Sable/android-platforms/master/android-34/android.jar"
  fi
fi

rm -rf "$BUILD" "$WEB" "$CONTENT"
mkdir -p "$GEN" "$CLASSES" "$DEX" "$WEB" "$CONTENT" "$OUT_DIR" "$SECRET_DIR"

# Bundle local-first UI + content. No remote dependency at runtime.
cp -R "$ROOT/web/." "$WEB/"
cp "$ROOT"/data/*.json "$CONTENT/"
python3 "$ROOT/tools/make_logo.py"

# ---- resources -> R.java ----
aapt package -f -m -J "$GEN" -M "$ANDROID_DIR/AndroidManifest.xml" \
  -S "$ANDROID_DIR/res" -I "$SDK_JAR"

# ---- Java -> class files ----
find "$ANDROID_DIR/src" "$GEN" -name '*.java' > "$BUILD/sources.txt"
javac -source 8 -target 8 -encoding UTF-8 -Xlint:-options \
  -bootclasspath "$SDK_JAR" -d "$CLASSES" @"$BUILD/sources.txt"

# ---- classes -> dex ----
d8 --lib "$SDK_JAR" --min-api 23 --output "$DEX" $(find "$CLASSES" -name '*.class')

# ---- resources + assets -> unsigned APK ----
aapt package -f --version-code "$VERSION_CODE" --version-name "$VERSION" \
  -M "$ANDROID_DIR/AndroidManifest.xml" -S "$ANDROID_DIR/res" -A "$ASSETS" \
  -I "$SDK_JAR" -F "$BUILD/unsigned.apk"
(cd "$DEX" && aapt add "$BUILD/unsigned.apk" classes.dex)

# ---- release key kept OUTSIDE the repository ----
if [ -n "${OMJAPAN_KS_PASS:-}" ]; then
  KS_PASS="$OMJAPAN_KS_PASS"
elif [ -f "$PASSFILE" ]; then
  KS_PASS="$(cat "$PASSFILE")"
else
  KS_PASS="$(python3 -c 'import secrets; print(secrets.token_urlsafe(32))')"
  printf '%s' "$KS_PASS" > "$PASSFILE"
  chmod 600 "$PASSFILE"
fi

if [ ! -f "$KEYSTORE" ]; then
  keytool -genkeypair -keystore "$KEYSTORE" -storepass "$KS_PASS" -keypass "$KS_PASS" \
    -alias "$KS_ALIAS" -keyalg RSA -keysize 2048 -validity 10000 \
    -dname "CN=OMJAPAN, OU=Learning, O=OMJAPAN, L=India, C=IN" >/dev/null 2>&1
  chmod 600 "$KEYSTORE"
fi

apksigner sign --ks "$KEYSTORE" --ks-pass "pass:$KS_PASS" --key-pass "pass:$KS_PASS" \
  --ks-key-alias "$KS_ALIAS" --v4-signing-enabled false --out "$OUT" "$BUILD/unsigned.apk"

apksigner verify --verbose "$OUT" | head -n 14
(cd "$OUT_DIR" && sha256sum "$(basename "$OUT")" > "$(basename "$OUT").sha256")
echo
echo "Built: $OUT"
echo "SHA256: $(cut -d' ' -f1 "$OUT.sha256")"
