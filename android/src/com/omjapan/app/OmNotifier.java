package com.omjapan.app;

import android.app.AlarmManager;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.os.Build;

/** User-controlled deadline reminders. No background scraping or silent polling. */
final class OmNotifier {
    private static final String CHANNEL = "omjapan_reminders";

    private OmNotifier() {}

    static void schedule(Context context, String id, String title, long dueAt) {
        try {
            int numericId = Math.abs((id == null ? "reminder" : id).hashCode());
            Intent intent = new Intent(context, OmReminderReceiver.class);
            intent.putExtra("om_title", title == null ? "OMJAPAN reminder" : title);
            intent.putExtra("om_id", id);
            PendingIntent pi = PendingIntent.getBroadcast(context, numericId, intent,
                    PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
            AlarmManager manager = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
            if (manager != null && dueAt > System.currentTimeMillis()) {
                manager.set(AlarmManager.RTC_WAKEUP, dueAt, pi);
            }
        } catch (Exception ignored) { }
    }

    static void cancel(Context context, String id) {
        try {
            int numericId = Math.abs((id == null ? "reminder" : id).hashCode());
            Intent intent = new Intent(context, OmReminderReceiver.class);
            PendingIntent pi = PendingIntent.getBroadcast(context, numericId, intent,
                    PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
            AlarmManager manager = (AlarmManager) context.getSystemService(Context.ALARM_SERVICE);
            if (manager != null) manager.cancel(pi);
        } catch (Exception ignored) { }
    }

    static void show(Context context, String title, String id) {
        try {
            NotificationManager nm = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
            if (nm == null) return;
            if (Build.VERSION.SDK_INT >= 26) {
                NotificationChannel channel = new NotificationChannel(CHANNEL, "OMJAPAN reminders",
                        NotificationManager.IMPORTANCE_DEFAULT);
                channel.setDescription("Deadline reminders you created in OMJAPAN");
                nm.createNotificationChannel(channel);
            }
            Intent open = context.getPackageManager().getLaunchIntentForPackage(context.getPackageName());
            PendingIntent content = open == null ? null : PendingIntent.getActivity(context, 0, open,
                    PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);

            Notification.Builder builder = Build.VERSION.SDK_INT >= 26
                    ? new Notification.Builder(context, CHANNEL)
                    : new Notification.Builder(context);
            builder.setSmallIcon(android.R.drawable.ic_dialog_info)
                    .setContentTitle(title == null ? "OMJAPAN reminder" : title)
                    .setContentText("Open OMJAPAN to review your application checklist.")
                    .setAutoCancel(true);
            if (content != null) builder.setContentIntent(content);
            nm.notify(Math.abs((id == null ? "reminder" : id).hashCode()), builder.build());
        } catch (Exception ignored) { }
    }
}
