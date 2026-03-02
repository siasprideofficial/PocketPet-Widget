// Pet mood states
export type PetMood = 'idle' | 'sleep' | 'happy' | 'jump';

// Pet style/appearance options
export type PetStyle = 'default' | 'orange' | 'gray' | 'black' | 'white';

// Pet state interface
export interface PetState {
  mood: PetMood;
  style: PetStyle;
  animationsEnabled: boolean;
  lastInteraction: number;
  tapCount: number;
}

// Widget state for native communication
export interface WidgetState {
  petMood: PetMood;
  petStyle: PetStyle;
  lastUpdate: number;
}

// App settings
export interface AppSettings {
  autoSleepEnabled: boolean;
  sleepStartHour: number;
  sleepEndHour: number;
  randomMoodEnabled: boolean;
  randomMoodInterval: number; // in minutes
}

// Default values
export const DEFAULT_PET_STATE: PetState = {
  mood: 'idle',
  style: 'default',
  animationsEnabled: true,
  lastInteraction: Date.now(),
  tapCount: 0,
};

export const DEFAULT_SETTINGS: AppSettings = {
  autoSleepEnabled: true,
  sleepStartHour: 22,
  sleepEndHour: 7,
  randomMoodEnabled: true,
  randomMoodInterval: 5,
};

// Pet mood display info
export const MOOD_INFO: Record<PetMood, { label: string; emoji: string; description: string }> = {
  idle: { label: 'Idle', emoji: '😺', description: 'Just chilling around' },
  sleep: { label: 'Sleeping', emoji: '😴', description: 'Zzz... dreaming of fish' },
  happy: { label: 'Happy', emoji: '😻', description: 'So happy to see you!' },
  jump: { label: 'Jumping', emoji: '🐱', description: 'Feeling energetic!' },
};

// Pet style display info
export const STYLE_INFO: Record<PetStyle, { label: string; color: string }> = {
  default: { label: 'Tabby', color: '#f59e0b' },
  orange: { label: 'Orange', color: '#ea580c' },
  gray: { label: 'Gray', color: '#6b7280' },
  black: { label: 'Black', color: '#1f2937' },
  white: { label: 'White', color: '#f3f4f6' },
};
