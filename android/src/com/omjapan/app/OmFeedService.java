package com.omjapan.app;

import android.database.sqlite.SQLiteDatabase;

import org.json.JSONArray;
import org.json.JSONObject;
import org.xmlpull.v1.XmlPullParser;
import org.xmlpull.v1.XmlPullParserFactory;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Locale;

/**
 * Fetches only official RSS/Atom feeds that the research step verified.
 * No HTML scraping, no invented dates, no invented statuses.
 */
final class OmFeedService {
    private OmFeedService() {}

    static String refresh(SQLiteDatabase db, String feedsJson) {
        long fetchedAt = System.currentTimeMillis() / 1000L;
        JSONArray errors = new JSONArray();
        JSONArray sources = new JSONArray();
        int count = 0;

        try {
            JSONArray feeds = new JSONArray(feedsJson);
            for (int i = 0; i < feeds.length(); i++) {
                JSONObject feed = feeds.getJSONObject(i);
                if (!feed.optBoolean("works", false)) continue;
                String name = feed.optString("name", "Official source");
                String url = feed.optString("url", "");
                sources.put(name);
                try {
                    String xml = get(url);
                    List<JSONObject> items = parse(xml, name, feed.optString("publisher", name));
                    for (JSONObject item : items) {
                        String itemKey = item.optString("url", item.optString("title", ""));
                        if (itemKey.isEmpty()) continue;
                        db.execSQL("INSERT OR REPLACE INTO news_cache(sourceKey,itemKey,itemJson,fetchedAt) " +
                                        "VALUES(?,?,?,?)",
                                new Object[]{name, itemKey, item.toString(), fetchedAt});
                        count++;
                    }
                } catch (Exception e) {
                    JSONObject err = new JSONObject();
                    err.put("source", name);
                    err.put("error", String.valueOf(e.getMessage()));
                    errors.put(err);
                }
            }
            db.execSQL("INSERT OR REPLACE INTO feed_state(key,value) VALUES('lastAttempt',?)",
                    new Object[]{String.valueOf(fetchedAt)});
            if (count > 0 || feeds.length() == 0) {
                db.execSQL("INSERT OR REPLACE INTO feed_state(key,value) VALUES('lastSuccess',?)",
                        new Object[]{String.valueOf(fetchedAt)});
            }
        } catch (Exception e) {
            try {
                JSONObject err = new JSONObject();
                err.put("source", "feed-list");
                err.put("error", String.valueOf(e.getMessage()));
                errors.put(err);
            } catch (Exception ignored) { }
        }

        try {
            JSONObject out = new JSONObject();
            out.put("success", errors.length() == 0);
            out.put("fetchedAt", fetchedAt);
            out.put("count", count);
            out.put("errors", errors);
            out.put("sources", sources);
            return out.toString();
        } catch (Exception e) {
            return "{\"success\":false,\"count\":0,\"errors\":[{\"error\":\"serialization\"}]}";
        }
    }

    private static String get(String urlString) throws Exception {
        URL url = new URL(urlString);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setConnectTimeout(8000);
        conn.setReadTimeout(8000);
        conn.setRequestMethod("GET");
        conn.setRequestProperty("User-Agent", "OMJAPAN/1.0 (offline-first study app; official feeds only)");
        conn.setInstanceFollowRedirects(true);
        int code = conn.getResponseCode();
        if (code < 200 || code >= 300) throw new IllegalStateException("HTTP " + code);
        InputStream in = conn.getInputStream();
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        byte[] buf = new byte[4096];
        int total = 0, read;
        while ((read = in.read(buf)) != -1) {
            total += read;
            if (total > 1048576) break; // bound memory on low-end devices
            out.write(buf, 0, read);
        }
        in.close();
        conn.disconnect();
        return new String(out.toByteArray(), "UTF-8");
    }

    private static List<JSONObject> parse(String xml, String sourceKey, String publisher) throws Exception {
        List<JSONObject> result = new ArrayList<>();
        XmlPullParserFactory factory = XmlPullParserFactory.newInstance();
        factory.setNamespaceAware(true);
        XmlPullParser parser = factory.newPullParser();
        parser.setInput(new java.io.StringReader(xml));

        String title = null, link = null, desc = null, dateText = null;
        boolean inItem = false;
        String tag = null;
        int event = parser.getEventType();
        while (event != XmlPullParser.END_DOCUMENT) {
            if (event == XmlPullParser.START_TAG) {
                String name = parser.getName();
                if ("item".equals(name) || "entry".equals(name)) {
                    inItem = true;
                    title = link = desc = dateText = null;
                } else if (inItem) {
                    tag = name;
                    if ("link".equals(name)) {
                        String href = parser.getAttributeValue(null, "href");
                        if (href != null && !href.isEmpty()) link = href;
                    }
                }
            } else if (event == XmlPullParser.TEXT && inItem && tag != null) {
                String text = parser.getText() == null ? "" : parser.getText().trim();
                if (!text.isEmpty()) {
                    if ("title".equals(tag)) title = text;
                    else if ("description".equals(tag) || "summary".equals(tag)) desc = text;
                    else if ("pubDate".equals(tag) || "published".equals(tag) || "updated".equals(tag)) dateText = text;
                    else if ("link".equals(tag) && (link == null || link.isEmpty())) link = text;
                }
            } else if (event == XmlPullParser.END_TAG) {
                String name = parser.getName();
                if ("item".equals(name) || "entry".equals(name)) {
                    if (title != null && link != null) {
                        JSONObject item = new JSONObject();
                        item.put("id", "feed-" + safeId(sourceKey + "-" + link));
                        item.put("title", title);
                        item.put("program", title);
                        item.put("institution", publisher);
                        item.put("countryEligibility", "See official source");
                        item.put("category", "other");
                        item.put("publishedDate", normalizeDate(dateText));
                        item.put("deadline", JSONObject.NULL); // never guessed
                        item.put("status", "VERIFIED");        // official feed we actually fetched
                        item.put("summary", clean(desc, title));
                        item.put("sourceUrl", link);
                        item.put("verifiedOn", new SimpleDateFormat("yyyy-MM-dd", Locale.US).format(new Date()));
                        item.put("evidence", new JSONArray().put(link));
                        item.put("live", true);
                        result.add(item);
                    }
                    inItem = false;
                }
                tag = null;
            }
            event = parser.next();
        }
        return result;
    }

    private static String normalizeDate(String text) {
        if (text == null || text.trim().isEmpty()) return null;
        String t = text.trim();
        try {
            SimpleDateFormat rss = new SimpleDateFormat("EEE, dd MMM yyyy HH:mm:ss Z", Locale.US);
            return new SimpleDateFormat("yyyy-MM-dd", Locale.US).format(rss.parse(t));
        } catch (Exception ignored) { }
        try {
            String iso = t.replace("Z", "+0000");
            SimpleDateFormat atom = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ssZ", Locale.US);
            return new SimpleDateFormat("yyyy-MM-dd", Locale.US).format(atom.parse(iso));
        } catch (Exception ignored) { }
        try {
            return new SimpleDateFormat("yyyy-MM-dd", Locale.US).format(
                    new SimpleDateFormat("yyyy-MM-dd", Locale.US).parse(t.substring(0, 10)));
        } catch (Exception ignored) { }
        return null;
    }

    private static String clean(String html, String fallback) {
        if (html == null || html.trim().isEmpty()) return fallback;
        String s = html.replaceAll("<[^>]+>", " ").replaceAll("\\s+", " ").trim();
        if (s.length() > 260) s = s.substring(0, 257) + "...";
        return s;
    }

    private static String safeId(String s) {
        return s.replaceAll("[^a-zA-Z0-9-_]", "-");
    }
}
