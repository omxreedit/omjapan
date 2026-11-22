package com.omjapan.app;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

public class OmReminderReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        if (intent == null) return;
        OmNotifier.show(context, intent.getStringExtra("om_title"), intent.getStringExtra("om_id"));
    }
}
