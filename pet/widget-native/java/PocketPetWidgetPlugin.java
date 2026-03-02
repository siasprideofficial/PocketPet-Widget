package com.pocketpet.widget;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

/**
 * Capacitor Plugin for PocketPet Widget
 * 
 * This plugin bridges the React app with the native Android widget,
 * allowing state synchronization and widget updates from the web layer.
 */
@CapacitorPlugin(name = "PocketPetWidget")
public class PocketPetWidgetPlugin extends Plugin {
    
    private static final String PREFS_NAME = "PocketPetWidgetPrefs";
    private static final String KEY_MOOD = "pet_mood";
    private static final String KEY_STYLE = "pet_style";
    
    /**
     * Update widget with new state from React app
     */
    @PluginMethod
    public void updateWidget(PluginCall call) {
        String mood = call.getString("mood", "idle");
        String style = call.getString("style", "default");
        
        // Save state to SharedPreferences
        Context context = getContext();
        SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        prefs.edit()
            .putString(KEY_MOOD, mood)
            .putString(KEY_STYLE, style)
            .apply();
        
        // Trigger widget update
        PocketPetWidgetProvider.updateAllWidgets(context);
        
        JSObject result = new JSObject();
        result.put("success", true);
        result.put("mood", mood);
        result.put("style", style);
        call.resolve(result);
    }
    
    /**
     * Refresh widget without changing state
     */
    @PluginMethod
    public void refreshWidget(PluginCall call) {
        PocketPetWidgetProvider.updateAllWidgets(getContext());
        
        JSObject result = new JSObject();
        result.put("success", true);
        call.resolve(result);
    }
    
    /**
     * Get current widget state
     */
    @PluginMethod
    public void getWidgetState(PluginCall call) {
        Context context = getContext();
        SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        
        String mood = prefs.getString(KEY_MOOD, "idle");
        String style = prefs.getString(KEY_STYLE, "default");
        
        JSObject result = new JSObject();
        result.put("mood", mood);
        result.put("style", style);
        call.resolve(result);
    }
    
    /**
     * Trigger specific mood animation
     */
    @PluginMethod
    public void triggerMood(PluginCall call) {
        String mood = call.getString("mood", "happy");
        
        Context context = getContext();
        Intent intent = new Intent(PocketPetWidgetProvider.ACTION_UPDATE_MOOD);
        intent.putExtra("mood", mood);
        context.sendBroadcast(intent);
        
        JSObject result = new JSObject();
        result.put("success", true);
        call.resolve(result);
    }
}
