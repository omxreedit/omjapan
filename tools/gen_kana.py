#!/usr/bin/env python3
"""Generate kana.json — the 46 basic hiragana and katakana with real example words."""
import json, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

H = [
    ("あ","a","あい","ai","love"), ("い","i","いえ","ie","house"),
    ("う","u","うえ","ue","up / above"), ("え","e","え","e","picture"),
    ("お","o","おいしい","oishii","delicious"),
    ("か","ka","かき","kaki","persimmon"), ("き","ki","き","ki","tree"),
    ("く","ku","くつ","kutsu","shoes"), ("け","ke","けさ","kesa","this morning"),
    ("こ","ko","こども","kodomo","child"),
    ("さ","sa","さけ","sake","salmon / sake"), ("し","shi","しお","shio","salt"),
    ("す","su","すし","sushi","sushi"), ("せ","se","せかい","sekai","world"),
    ("そ","so","そら","sora","sky"),
    ("た","ta","たべる","taberu","to eat"), ("ち","chi","ちかてつ","chikatetsu","subway"),
    ("つ","tsu","つき","tsuki","moon"), ("て","te","て","te","hand"),
    ("と","to","とけい","tokei","clock"),
    ("な","na","なつ","natsu","summer"), ("に","ni","にほん","nihon","Japan"),
    ("ぬ","nu","ぬの","nuno","cloth"), ("ね","ne","ねこ","neko","cat"),
    ("の","no","のり","nori","seaweed"),
    ("は","ha","はな","hana","flower"), ("ひ","hi","ひ","hi","sun / fire"),
    ("ふ","fu","ふじさん","fujisan","Mount Fuji"), ("へ","he","へや","heya","room"),
    ("ほ","ho","ほん","hon","book"),
    ("ま","ma","まど","mado","window"), ("み","mi","みず","mizu","water"),
    ("む","mu","むし","mushi","insect"), ("め","me","め","me","eye"),
    ("も","mo","もり","mori","forest"),
    ("や","ya","やま","yama","mountain"), ("ゆ","yu","ゆき","yuki","snow"),
    ("よ","yo","よる","yoru","night"),
    ("ら","ra","らいねん","rainen","next year"), ("り","ri","りんご","ringo","apple"),
    ("る","ru","るす","rusu","away from home"), ("れ","re","れいぞうこ","reizouko","refrigerator"),
    ("ろ","ro","ろく","roku","six"),
    ("わ","wa","わたし","watashi","I / me"), ("を","wo","ほんをよむ","hon wo yomu","read a book (object particle)"),
    ("ん","n","にほん","nihon","Japan"),
]

K = [
    ("ア","a","アパート","apaato","apartment"), ("イ","i","イメージ","imeeji","image"),
    ("ウ","u","ウイルス","uirusu","virus"), ("エ","e","エアコン","eakon","air conditioner"),
    ("オ","o","オレンジ","orenji","orange"),
    ("カ","ka","カメラ","kamera","camera"), ("キ","ki","キーボード","kiiboodo","keyboard"),
    ("ク","ku","クッキー","kukkii","cookie"), ("ケ","ke","ケーキ","keeki","cake"),
    ("コ","ko","コーヒー","koohii","coffee"),
    ("サ","sa","サッカー","sakkaa","soccer"), ("シ","shi","シャツ","shatsu","shirt"),
    ("ス","su","スマホ","sumaho","smartphone"), ("セ","se","セール","seeru","sale"),
    ("ソ","so","ソファ","sofa","sofa"),
    ("タ","ta","タクシー","takushii","taxi"), ("チ","chi","チョコレート","chokoreeto","chocolate"),
    ("ツ","tsu","ツイッター","tsuittaa","Twitter"), ("テ","te","テレビ","terebi","television"),
    ("ト","to","トマト","tomato","tomato"),
    ("ナ","na","ナイフ","naifu","knife"), ("ニ","ni","ニュース","nyuusu","news"),
    ("ヌ","nu","ヌードル","nuudoru","noodles"), ("ネ","ne","ネクタイ","nekutai","necktie"),
    ("ノ","no","ノート","nooto","notebook"),
    ("ハ","ha","ハンバーガー","hanbaagaa","hamburger"), ("ヒ","hi","ヒーロー","hiieroo","hero"),
    ("フ","fu","フルーツ","furuutsu","fruit"), ("ヘ","he","ヘリコプター","herikoputaa","helicopter"),
    ("ホ","ho","ホテル","hoteru","hotel"),
    ("マ","ma","マグカップ","magukappu","mug"), ("ミ","mi","ミルク","miruku","milk"),
    ("ム","mu","ムービー","muubii","movie"), ("メ","me","メール","meeru","email"),
    ("モ","mo","モバイル","mobairu","mobile"),
    ("ヤ","ya","ヤング","yangu","young"), ("ユ","yu","ユニフォーム","yunifo-mu","uniform"),
    ("ヨ","yo","ヨーグルト","yooguruto","yogurt"),
    ("ラ","ra","ラジオ","rajio","radio"), ("リ","ri","リモコン","rimokon","remote control"),
    ("ル","ru","ルール","ruuru","rule"), ("レ","re","レストラン","resutoran","restaurant"),
    ("ロ","ro","ロボット","robotto","robot"),
    ("ワ","wa","ワイン","wain","wine"), ("ヲ","wo","ヲ","wo","rarely used object marker"),
    ("ン","n","パン","pan","bread"),
]

GROUPS = ["a", "ka", "sa", "ta", "na", "ha", "ma", "ya", "ra", "wa"]
def group(i):
    if i < 5: return GROUPS[0]
    if i < 10: return GROUPS[1]
    if i < 15: return GROUPS[2]
    if i < 20: return GROUPS[3]
    if i < 25: return GROUPS[4]
    if i < 30: return GROUPS[5]
    if i < 35: return GROUPS[6]
    if i < 38: return GROUPS[7]
    if i < 43: return GROUPS[8]
    return GROUPS[9]

out = []
for kind, rows in (("hiragana", H), ("katakana", K)):
    for i, (char, romaji, ex, exr, meaning) in enumerate(rows):
        out.append({
            "id": f"{kind}-{i+1:02d}",
            "type": kind,
            "char": char,
            "romaji": romaji,
            "group": group(i),
            "position": i + 1,
            "example": ex,
            "exampleRomaji": exr,
            "exampleMeaning": meaning,
            "level": "N5",
        })

path = os.path.join(ROOT, "data", "kana.json")
os.makedirs(os.path.dirname(path), exist_ok=True)
with open(path, "w", encoding="utf-8") as f:
    json.dump(out, f, ensure_ascii=False, indent=1)
print(f"wrote {len(out)} kana entries")
