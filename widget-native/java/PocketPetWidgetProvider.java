package com.pocketpet.widget;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Handler;
import android.os.Looper;
import android.widget.RemoteViews;

import java.util.Calendar;
import java.util.Random;

/**
 * PocketPet Widget Provider
 * 
 * This class handles the Android App Widget functionality including:
 * - Widget updates and rendering
 * - Click event handling
 * - State management
 * - Auto-refresh with mood changes
 */
public class PocketPetWidgetProvider extends AppWidgetProvider {
    
    // Action constants
    public static final String ACTION_WIDGET_TAP = "com.pocketpet.widget.TAP";
    public static final String ACTION_UPDATE_MOOD = "com.pocketpet.widget.UPDATE_MOOD";
    
    // Preference keys
    private static final String PREFS_NAME = "PocketPetWidgetPrefs";
    private static final String KEY_MOOD = "pet_mood";
    private static final String KEY_STYLE = "pet_style";
    private static final String KEY_LAST_UPDATE = "last_update";
    
    // Mood constants
    private static final String MOOD_IDLE = "idle";
    private static final String MOOD_SLEEP = "sleep";
    private static final String MOOD_HAPPY = "happy";
    private static final String MOOD_JUMP = "jump";
    
    // Handler for delayed mood reset
    private static Handler handler = new Handler(Looper.getMainLooper());
    
    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        // Update each widget instance
        for (int appWidgetId : appWidgetIds) {
            updateAppWidget(context, appWidgetManager, appWidgetId);
        }
    }
    
    @Override
    public void onReceive(Context context, Intent intent) {
        super.onReceive(context, intent);
        
        String action = intent.getAction();
        
        if (ACTION_WIDGET_TAP.equals(action)) {
            handleWidgetTap(context);
        } else if (ACTION_UPDATE_MOOD.equals(action)) {
            String mood = intent.getStringExtra("mood");
            if (mood != null) {
                setMood(context, mood);
                updateAllWidgets(context);
            }
        }
    }
    
    @Override
    public void onEnabled(Context context) {
        super.onEnabled(context);
        // Widget enabled for the first time
        setMood(context, MOOD_IDLE);
    }
    
    @Override
    public void onDisabled(Context context) {
        super.onDisabled(context);
        // Last widget instance removed
        handler.removeCallbacksAndMessages(null);
    }
    
    /**
     * Update a single widget instance
     */
    static void updateAppWidget(Context context, AppWidgetManager appWidgetManager, int appWidgetId) {
        // Create RemoteViews
        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.widget_layout);
        
        // Get current mood and set appropriate image
        String mood = getMood(context);
        int imageResource = getMoodDrawable(mood);
        views.setImageViewResource(R.id.pet_image, imageResource);
        
        // Set mood text
        String moodText = getMoodText(mood);
        views.setTextViewText(R.id.mood_text, moodText);
        
        // Set click listener
        Intent tapIntent = new Intent(context, PocketPetWidgetProvider.class);
        tapIntent.setAction(ACTION_WIDGET_TAP);
        PendingIntent pendingIntent = PendingIntent.getBroadcast(
            context, 
            0, 
            tapIntent, 
            PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );
        views.setOnClickPendingIntent(R.id.widget_container, pendingIntent);
        
        // Also open app on pet image tap
        Intent openAppIntent = context.getPackageManager()
            .getLaunchIntentForPackage(context.getPackageName());
        if (openAppIntent != null) {
            PendingIntent openAppPendingIntent = PendingIntent.getActivity(
                context,
                1,
                openAppIntent,
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
            );
            views.setOnClickPendingIntent(R.id.pet_image, openAppPendingIntent);
        }
        
        // Update the widget
        appWidgetManager.updateAppWidget(appWidgetId, views);
    }
    
    /**
     * Handle widget tap interaction
     */
    private void handleWidgetTap(Context context) {
        // Get current mood
        String currentMood = getMood(context);
        
        // If sleeping, wake up
        if (MOOD_SLEEP.equals(currentMood)) {
            setMood(context, MOOD_IDLE);
        } else {
            // Show happy reaction
            setMood(context, MOOD_HAPPY);
            
            // Reset to idle after 2 seconds
            handler.postDelayed(() -> {
                setMood(context, MOOD_IDLE);
                updateAllWidgets(context);
            }, 2000);
        }
        
        updateAllWidgets(context);
        
        // Notify the app
        sendToApp(context, "TAP");
    }
    
    /**
     * Update all widget instances
     */
    public static void updateAllWidgets(Context context) {
        AppWidgetManager appWidgetManager = AppWidgetManager.getInstance(context);
        ComponentName thisWidget = new ComponentName(context, PocketPetWidgetProvider.class);
        int[] appWidgetIds = appWidgetManager.getAppWidgetIds(thisWidget);
        
        for (int appWidgetId : appWidgetIds) {
            updateAppWidget(context, appWidgetManager, appWidgetId);
        }
    }
    
    /**
     * Get current pet mood from SharedPreferences
     */
    private static String getMood(Context context) {
        SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        String mood = prefs.getString(KEY_MOOD, MOOD_IDLE);
        
        // Check if it's sleep time
        if (shouldSleep()) {
            return MOOD_SLEEP;
        }
        
        return mood;
    }
    
    /**
     * Set pet mood in SharedPreferences
     */
    private static void setMood(Context context, String mood) {
        SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        prefs.edit()
            .putString(KEY_MOOD, mood)
            .putLong(KEY_LAST_UPDATE, System.currentTimeMillis())
            .apply();
    }
    
    /**
     * Check if it's sleep time (10 PM - 7 AM)
     */
    private static boolean shouldSleep() {
        Calendar calendar = Calendar.getInstance();
        int hour = calendar.get(Calendar.HOUR_OF_DAY);
        return hour >= 22 || hour < 7;
    }
    
    /**
     * Get drawable resource for mood
     */
    private static int getMoodDrawable(String mood) {
        switch (mood) {
            case MOOD_SLEEP:
                return R.drawable.cat_sleep;
            case MOOD_HAPPY:
                return R.drawable.cat_happy;
            case MOOD_JUMP:
                return R.drawable.cat_jump;
            case MOOD_IDLE:
            default:
                return R.drawable.cat_idle;
        }
    }
    
    /**
     * Get display text for mood
     */
    private static String getMoodText(String mood) {
        switch (mood) {
            case MOOD_SLEEP:
                return "😴 Sleeping";
            case MOOD_HAPPY:
                return "😻 Happy!";
            case MOOD_JUMP:
                return "🐱 Jumping!";
            case MOOD_IDLE:
            default:
                return "😺 Chillin'";
        }
    }
    
    /**
     * Send event to the main app
     */
    private void sendToApp(Context context, String eventType) {
        Intent intent = new Intent("com.pocketpet.widget.WIDGET_EVENT");
        intent.putExtra("event_type", eventType);
        intent.putExtra("timestamp", System.currentTimeMillis());
        context.sendBroadcast(intent);
    }
    
    /**
     * Trigger random mood change (called by AlarmManager)
     */
    public static void triggerRandomMood(Context context) {
        if (shouldSleep()) {
            setMood(context, MOOD_SLEEP);
        } else {
            String[] moods = {MOOD_IDLE, MOOD_HAPPY, MOOD_IDLE, MOOD_IDLE};
            String randomMood = moods[new Random().nextInt(moods.length)];
            setMood(context, randomMood);
        }
        updateAllWidgets(context);
    }
}
