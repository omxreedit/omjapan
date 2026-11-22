package com.omjapan.app;

import android.content.Context;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;

/** Single local source of truth. No account, no cloud, no secrets. */
public class OmDatabase extends SQLiteOpenHelper {
    public static final String DB_NAME = "omjapan.db";
    public static final int DB_VERSION = 1;

    public OmDatabase(Context context) {
        super(context, DB_NAME, null, DB_VERSION);
    }

    @Override
    public void onCreate(SQLiteDatabase db) {
        db.execSQL("CREATE TABLE settings(key TEXT PRIMARY KEY, value TEXT)");
        db.execSQL("CREATE TABLE kv(namespace TEXT NOT NULL, key TEXT NOT NULL, value TEXT NOT NULL, " +
                "PRIMARY KEY(namespace,key))");
        db.execSQL("CREATE TABLE profile(id INTEGER PRIMARY KEY CHECK(id=1), displayName TEXT, " +
                "jlptTarget TEXT, dailyGoal INTEGER, reduceMotion INTEGER, onboarded INTEGER, createdAt INTEGER)");
        db.execSQL("CREATE TABLE progress(itemType TEXT NOT NULL, itemId TEXT NOT NULL, " +
                "status TEXT NOT NULL, score INTEGER, updatedAt INTEGER, PRIMARY KEY(itemType,itemId))");
        db.execSQL("CREATE TABLE quiz_history(id INTEGER PRIMARY KEY AUTOINCREMENT, itemType TEXT, " +
                "itemId TEXT, correct INTEGER, total INTEGER, at INTEGER)");
        db.execSQL("CREATE TABLE bookmarks(itemType TEXT NOT NULL, itemId TEXT NOT NULL, " +
                "createdAt INTEGER, PRIMARY KEY(itemType,itemId))");
        db.execSQL("CREATE TABLE mistakes(id INTEGER PRIMARY KEY AUTOINCREMENT, itemType TEXT, " +
                "itemId TEXT, at INTEGER)");
        db.execSQL("CREATE TABLE study_sessions(id INTEGER PRIMARY KEY AUTOINCREMENT, seconds INTEGER, at INTEGER)");
        db.execSQL("CREATE TABLE daily_activity(day TEXT PRIMARY KEY, minutes INTEGER, lessons INTEGER, " +
                "words INTEGER, quizzes INTEGER)");
        db.execSQL("CREATE TABLE collections(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, createdAt INTEGER)");
        db.execSQL("CREATE TABLE collection_items(id INTEGER PRIMARY KEY AUTOINCREMENT, collectionId INTEGER, " +
                "itemType TEXT, itemId TEXT, UNIQUE(collectionId,itemType,itemId))");
        db.execSQL("CREATE TABLE scholarship_tracker(scholarshipId TEXT PRIMARY KEY, status TEXT, notes TEXT, " +
                "applied INTEGER DEFAULT 0, shortlisted INTEGER DEFAULT 0, accepted INTEGER DEFAULT 0, " +
                "rejected INTEGER DEFAULT 0, completed INTEGER DEFAULT 0, deadline TEXT, " +
                "reminderAt INTEGER, updatedAt INTEGER)");
        db.execSQL("CREATE TABLE checklist_items(id INTEGER PRIMARY KEY AUTOINCREMENT, scholarshipId TEXT, " +
                "label TEXT, done INTEGER DEFAULT 0, custom INTEGER DEFAULT 0, UNIQUE(scholarshipId,label))");
        db.execSQL("CREATE TABLE reminders(id INTEGER PRIMARY KEY AUTOINCREMENT, scholarshipId TEXT, " +
                "title TEXT, dueAt INTEGER, enabled INTEGER DEFAULT 1)");
        db.execSQL("CREATE TABLE news_cache(id INTEGER PRIMARY KEY AUTOINCREMENT, sourceKey TEXT, itemKey TEXT, " +
                "itemJson TEXT, fetchedAt INTEGER, UNIQUE(sourceKey,itemKey))");
        db.execSQL("CREATE TABLE feed_state(key TEXT PRIMARY KEY, value TEXT)");
        db.execSQL("CREATE TABLE creator_cache(id INTEGER PRIMARY KEY AUTOINCREMENT, itemJson TEXT, fetchedAt INTEGER)");

        db.execSQL("INSERT INTO profile(id,displayName,jlptTarget,dailyGoal,reduceMotion,onboarded,createdAt) " +
                "VALUES(1,'Learner','N5',10,0,0,strftime('%s','now'))");
        db.execSQL("INSERT INTO settings(key,value) VALUES('theme','dark')");
        db.execSQL("INSERT INTO settings(key,value) VALUES('accent','lime')");
        db.execSQL("INSERT INTO settings(key,value) VALUES('romaji','1')");
        db.execSQL("INSERT INTO settings(key,value) VALUES('furigana','1')");
        db.execSQL("INSERT INTO settings(key,value) VALUES('notifications','0')");
        db.execSQL("INSERT INTO settings(key,value) VALUES('audio','1')");
    }

    @Override
    public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {
        // v1: nothing to migrate. Future versions add explicit ALTER statements.
    }
}
