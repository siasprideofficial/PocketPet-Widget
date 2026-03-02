import { useState, useEffect, useCallback } from 'react';
import { PetState, PetMood, PetStyle, DEFAULT_PET_STATE, AppSettings, DEFAULT_SETTINGS } from '../types/pet';

const STORAGE_KEY = 'pocketpet_state';
const SETTINGS_KEY = 'pocketpet_settings';

/**
 * Custom hook for managing pet state with localStorage persistence
 * and widget synchronization capabilities
 */
export function usePetState() {
  const [petState, setPetState] = useState<PetState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_PET_STATE;
    } catch {
      return DEFAULT_PET_STATE;
    }
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  // Persist state to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(petState));
    // Notify widget of state change (for native bridge)
    notifyWidget(petState);
  }, [petState]);

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  // Auto sleep mode based on time
  useEffect(() => {
    if (!settings.autoSleepEnabled) return;

    const checkSleepTime = () => {
      const hour = new Date().getHours();
      const shouldSleep = 
        settings.sleepStartHour > settings.sleepEndHour
          ? hour >= settings.sleepStartHour || hour < settings.sleepEndHour
          : hour >= settings.sleepStartHour && hour < settings.sleepEndHour;

      if (shouldSleep && petState.mood !== 'sleep') {
        setPetState(prev => ({ ...prev, mood: 'sleep' }));
      } else if (!shouldSleep && petState.mood === 'sleep') {
        setPetState(prev => ({ ...prev, mood: 'idle' }));
      }
    };

    checkSleepTime();
    const interval = setInterval(checkSleepTime, 60000);
    return () => clearInterval(interval);
  }, [settings.autoSleepEnabled, settings.sleepStartHour, settings.sleepEndHour, petState.mood]);

  // Random mood changes
  useEffect(() => {
    if (!settings.randomMoodEnabled || petState.mood === 'sleep') return;

    const interval = setInterval(() => {
      const moods: PetMood[] = ['idle', 'happy', 'jump'];
      const randomMood = moods[Math.floor(Math.random() * moods.length)];
      setPetState(prev => ({ ...prev, mood: randomMood }));
    }, settings.randomMoodInterval * 60000);

    return () => clearInterval(interval);
  }, [settings.randomMoodEnabled, settings.randomMoodInterval, petState.mood]);

  // Set specific mood
  const setMood = useCallback((mood: PetMood) => {
    setPetState(prev => ({
      ...prev,
      mood,
      lastInteraction: Date.now(),
    }));
  }, []);

  // Set pet style
  const setStyle = useCallback((style: PetStyle) => {
    setPetState(prev => ({
      ...prev,
      style,
      lastInteraction: Date.now(),
    }));
  }, []);

  // Toggle animations
  const toggleAnimations = useCallback(() => {
    setPetState(prev => ({
      ...prev,
      animationsEnabled: !prev.animationsEnabled,
    }));
  }, []);

  // Handle pet tap
  const handleTap = useCallback(() => {
    setPetState(prev => {
      const newTapCount = prev.tapCount + 1;
      // Every 5 taps, trigger jump animation
      if (newTapCount % 5 === 0) {
        return {
          ...prev,
          mood: 'jump',
          tapCount: newTapCount,
          lastInteraction: Date.now(),
        };
      }
      // Otherwise show happy
      return {
        ...prev,
        mood: 'happy',
        tapCount: newTapCount,
        lastInteraction: Date.now(),
      };
    });

    // Return to idle after animation
    setTimeout(() => {
      setPetState(prev => {
        if (prev.mood === 'happy' || prev.mood === 'jump') {
          return { ...prev, mood: 'idle' };
        }
        return prev;
      });
    }, 2000);
  }, []);

  // Update settings
  const updateSettings = useCallback((newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  // Reset to defaults
  const resetState = useCallback(() => {
    setPetState(DEFAULT_PET_STATE);
    setSettings(DEFAULT_SETTINGS);
  }, []);

  return {
    petState,
    settings,
    setMood,
    setStyle,
    toggleAnimations,
    handleTap,
    updateSettings,
    resetState,
  };
}

/**
 * Notify native widget of state changes
 * This function communicates with the Android widget via Capacitor bridge
 */
function notifyWidget(state: PetState) {
  // Check if running in Capacitor
  if (typeof window !== 'undefined' && (window as any).Capacitor) {
    try {
      // This will be handled by native code
      const message = {
        type: 'PET_STATE_UPDATE',
        payload: {
          mood: state.mood,
          style: state.style,
          timestamp: Date.now(),
        },
      };
      // Post message to native layer
      (window as any).Capacitor.Plugins?.PocketPetWidget?.updateWidget(message);
    } catch (error) {
      console.log('Widget notification not available (web mode)');
    }
  }
}
