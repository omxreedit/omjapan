package com.omjapan.app;

import android.Manifest;
import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.net.Uri;
import android.os.Build;
import android.speech.tts.TextToSpeech;
import android.webkit.JavascriptInterface;
import android.widget.Toast;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.util.Locale;

/** The only bridge between the local web UI and Android platform features. */
public class OmBridge {
    private final Activity activity;
    private final OmDatabase helper;
    private TextToSpeech tts;

    OmBridge(Activity activity, OmDatabase helper) {
        this.activity = activity;
        this.helper = helper;
    }

    @JavascriptInterface
    public String appInfo() {
        try {
            JSONObject o = new JSONObject();
            o.put("name", "OMJAPAN");
            o.put("version", "1.0.0");
            o.put("versionCode", 1);
            o.put("package", "com.omjapan.app");
            o.put("offlineCore", true);
            return o.toString();
        } catch (Exception e) {
            return "{}";
        }
    }

    /** Reads a bundled JSON/HTML asset. Path traversal is rejected. */
    @JavascriptInterface
    public String readAsset(String path) {
        if (path == null || path.contains("..") || path.startsWith("/")) return "";
        try {
            InputStream in = activity.getAssets().open(path);
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            byte[] buf = new byte[8192];
            int read, total = 0;
            while ((read = in.read(buf)) != -1) {
                total += read;
                if (total > 4194304) break; // 4 MB bound
                out.write(buf, 0, read);
            }
            in.close();
            return new String(out.toByteArray(), "UTF-8");
        } catch (Exception e) {
            return "";
        }
    }

    /** High-level key/value store: easy to mirror in tests, mapped to SQLite. */
    @JavascriptInterface
    public synchronized String storeGet(String namespace, String key) {
        if (namespace == null || key == null) return "null";
        SQLiteDatabase db = helper.getReadableDatabase();
        Cursor c = db.rawQuery("SELECT value FROM kv WHERE namespace=? AND key=?",
                new String[]{namespace, key});
        String value = c.moveToFirst() ? c.getString(0) : null;
        c.close();
        return value == null ? "null" : value;
    }

    @JavascriptInterface
    public synchronized String storeSet(String namespace, String key, String valueJson) {
        if (namespace == null || key == null || valueJson == null) return "false";
        try {
            helper.getWritableDatabase().execSQL(
                    "INSERT OR REPLACE INTO kv(namespace,key,value) VALUES(?,?,?)",
                    new Object[]{namespace, key, valueJson});
            return "true";
        } catch (Exception e) {
            return "false";
        }
    }

    @JavascriptInterface
    public synchronized String storeDelete(String namespace, String key) {
        if (namespace == null || key == null) return "false";
        try {
            helper.getWritableDatabase().execSQL("DELETE FROM kv WHERE namespace=? AND key=?",
                    new Object[]{namespace, key});
            return "true";
        } catch (Exception e) {
            return "false";
        }
    }

    @JavascriptInterface
    public synchronized String storeClear(String namespace) {
        if (namespace == null) return "false";
        try {
            helper.getWritableDatabase().execSQL("DELETE FROM kv WHERE namespace=?", new Object[]{namespace});
            return "true";
        } catch (Exception e) {
            return "false";
        }
    }

    @JavascriptInterface
    public synchronized String storeAll(String namespace) {
        if (namespace == null) return "[]";
        JSONArray out = new JSONArray();
        Cursor c = helper.getReadableDatabase().rawQuery(
                "SELECT value FROM kv WHERE namespace=? ORDER BY key", new String[]{namespace});
        try {
            while (c.moveToNext()) {
                String value = c.getString(0);
                if (value != null) out.put(new JSONObject(value));
            }
        } catch (Exception ignored) { }
        c.close();
        return out.toString();
    }

    /** Cached official feed items, written by OmFeedService. */
    @JavascriptInterface
    public synchronized String newsCache() {
        JSONArray out = new JSONArray();
        Cursor c = helper.getReadableDatabase().rawQuery(
                "SELECT itemJson FROM news_cache ORDER BY fetchedAt DESC", null);
        try {
            while (c.moveToNext()) {
                String value = c.getString(0);
                if (value != null) out.put(new JSONObject(value));
            }
        } catch (Exception ignored) { }
        c.close();
        return out.toString();
    }

    @JavascriptInterface
    public synchronized String feedState() {
        JSONObject out = new JSONObject();
        Cursor c = helper.getReadableDatabase().rawQuery("SELECT key,value FROM feed_state", null);
        try {
            while (c.moveToNext()) out.put(c.getString(0), c.getString(1));
        } catch (Exception ignored) { }
        c.close();
        return out.toString();
    }

    /** Parameterised SQL only; kept for maintenance tools, not used by the UI. */
    @JavascriptInterface
    public synchronized String db(String sql, String paramsJson) {
        SQLiteDatabase db = helper.getWritableDatabase();
        try {
            JSONArray params = new JSONArray(paramsJson == null ? "[]" : paramsJson);
            String[] args = new String[params.length()];
            for (int i = 0; i < params.length(); i++) args[i] = String.valueOf(params.get(i));

            JSONObject out = new JSONObject();
            if (sql == null || sql.trim().isEmpty()) {
                out.put("ok", false);
                out.put("error", "empty sql");
                return out.toString();
            }
            String first = sql.trim().substring(0, Math.min(6, sql.trim().length())).toUpperCase(Locale.US);
            if (first.equals("SELECT") || first.startsWith("PRAGMA")) {
                Cursor c = db.rawQuery(sql, args);
                JSONArray rows = new JSONArray();
                while (c.moveToNext()) {
                    JSONObject row = new JSONObject();
                    for (int i = 0; i < c.getColumnCount(); i++) {
                        String value = c.getString(i);
                        if (value != null) row.put(c.getColumnName(i), value);
                    }
                    rows.put(row);
                }
                c.close();
                out.put("ok", true);
                out.put("rows", rows);
            } else {
                db.execSQL(sql, args);
                out.put("ok", true);
                out.put("rows", new JSONArray());
            }
            return out.toString();
        } catch (Exception e) {
            try {
                JSONObject out = new JSONObject();
                out.put("ok", false);
                out.put("error", String.valueOf(e.getMessage()));
                return out.toString();
            } catch (Exception ignored) {
                return "{\"ok\":false}";
            }
        }
    }

    /** Opens genuine external links in YouTube or the browser. Never embedded. */
    @JavascriptInterface
    public void openExternal(String url) {
        try {
            if (url == null) return;
            Uri uri = Uri.parse(url);
            if (!"http".equals(uri.getScheme()) && !"https".equals(uri.getScheme())) return;
            Intent intent = new Intent(Intent.ACTION_VIEW, uri);
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            activity.startActivity(intent);
        } catch (Exception e) {
            toast("No app available to open this link");
        }
    }

    @JavascriptInterface
    public void toast(String message) {
        if (message == null) return;
        Toast.makeText(activity, message, Toast.LENGTH_SHORT).show();
    }

    /** Text-to-speech for listening/speaking drills. Returns false if Japanese voice unavailable. */
    @JavascriptInterface
    public boolean speak(String text, String lang) {
        try {
            if (tts == null) {
                tts = new TextToSpeech(activity, null);
            }
            Locale locale = "ja".equals(lang) ? Locale.JAPAN : Locale.ENGLISH;
            int available = tts.isLanguageAvailable(locale);
            if (available < 0) return false;
            tts.setLanguage(locale);
            tts.speak(text, TextToSpeech.QUEUE_FLUSH, null, "omjapan-utterance");
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    @JavascriptInterface
    public void stopSpeech() {
        try {
            if (tts != null) tts.stop();
        } catch (Exception ignored) { }
    }

    /** Synchronous on the JavaBridge thread: bounded, cached, official feeds only. */
    @JavascriptInterface
    public String refreshFeeds() {
        String feeds = readAsset("content/feeds.json");
        return OmFeedService.refresh(helper.getWritableDatabase(), feeds);
    }

    @JavascriptInterface
    public void requestNotifications() {
        if (Build.VERSION.SDK_INT >= 33 &&
                activity.checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS)
                        != PackageManager.PERMISSION_GRANTED) {
            activity.requestPermissions(new String[]{Manifest.permission.POST_NOTIFICATIONS}, 1001);
        }
    }

    @JavascriptInterface
    public void scheduleReminder(String id, String title, long dueAt) {
        OmNotifier.schedule(activity, id, title, dueAt);
    }

    @JavascriptInterface
    public void cancelReminder(String id) {
        OmNotifier.cancel(activity, id);
    }

    @JavascriptInterface
    public void share(String text) {
        try {
            Intent send = new Intent(Intent.ACTION_SEND);
            send.setType("text/plain");
            send.putExtra(Intent.EXTRA_TEXT, text);
            activity.startActivity(Intent.createChooser(send, "Share"));
        } catch (Exception ignored) { }
    }

    @JavascriptInterface
    public boolean canUseNotifications() {
        if (Build.VERSION.SDK_INT < 33) return true;
        return activity.checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS)
                == PackageManager.PERMISSION_GRANTED;
    }

    void shutdown() {
        try {
            if (tts != null) tts.shutdown();
        } catch (Exception ignored) { }
    }
}
