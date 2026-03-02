import React from 'react';
import { AppSettings } from '../types/pet';
import { cn } from '../utils/cn';
import { Moon, Shuffle, Clock, RotateCcw } from 'lucide-react';

interface SettingsPanelProps {
  settings: AppSettings;
  animationsEnabled: boolean;
  onSettingsChange: (settings: Partial<AppSettings>) => void;
  onToggleAnimations: () => void;
  onReset: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  settings,
  animationsEnabled,
  onSettingsChange,
  onToggleAnimations,
  onReset,
}) => {
  return (
    <div className="w-full space-y-4">
      <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
        <span className="text-xl">⚙️</span>
        Settings
      </h3>

      {/* Animation Toggle */}
      <ToggleOption
        icon={<Shuffle className="w-5 h-5" />}
        label="Animations"
        description="Enable pet animations"
        enabled={animationsEnabled}
        onToggle={onToggleAnimations}
      />

      {/* Auto Sleep Toggle */}
      <ToggleOption
        icon={<Moon className="w-5 h-5" />}
        label="Auto Sleep Mode"
        description="Pet sleeps at night automatically"
        enabled={settings.autoSleepEnabled}
        onToggle={() => onSettingsChange({ autoSleepEnabled: !settings.autoSleepEnabled })}
      />

      {/* Sleep Time Settings */}
      {settings.autoSleepEnabled && (
        <div className="ml-8 p-3 rounded-lg bg-zinc-900/50 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Sleep Time
            </span>
            <select
              value={settings.sleepStartHour}
              onChange={(e) => onSettingsChange({ sleepStartHour: parseInt(e.target.value) })}
              className="bg-zinc-800 text-white text-sm rounded px-2 py-1 border border-zinc-700"
            >
              {Array.from({ length: 24 }, (_, i) => (
                <option key={i} value={i}>{i.toString().padStart(2, '0')}:00</option>
              ))}
            </select>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Wake Time
            </span>
            <select
              value={settings.sleepEndHour}
              onChange={(e) => onSettingsChange({ sleepEndHour: parseInt(e.target.value) })}
              className="bg-zinc-800 text-white text-sm rounded px-2 py-1 border border-zinc-700"
            >
              {Array.from({ length: 24 }, (_, i) => (
                <option key={i} value={i}>{i.toString().padStart(2, '0')}:00</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Random Mood Toggle */}
      <ToggleOption
        icon={<Shuffle className="w-5 h-5" />}
        label="Random Moods"
        description="Pet changes mood randomly"
        enabled={settings.randomMoodEnabled}
        onToggle={() => onSettingsChange({ randomMoodEnabled: !settings.randomMoodEnabled })}
      />

      {/* Random Mood Interval */}
      {settings.randomMoodEnabled && (
        <div className="ml-8 p-3 rounded-lg bg-zinc-900/50">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Change every</span>
            <select
              value={settings.randomMoodInterval}
              onChange={(e) => onSettingsChange({ randomMoodInterval: parseInt(e.target.value) })}
              className="bg-zinc-800 text-white text-sm rounded px-2 py-1 border border-zinc-700"
            >
              <option value={1}>1 minute</option>
              <option value={5}>5 minutes</option>
              <option value={10}>10 minutes</option>
              <option value={30}>30 minutes</option>
              <option value={60}>1 hour</option>
            </select>
          </div>
        </div>
      )}

      {/* Reset Button */}
      <button
        onClick={onReset}
        className="w-full flex items-center justify-center gap-2 p-3 mt-4 rounded-xl
                   bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors
                   border border-red-500/30"
      >
        <RotateCcw className="w-4 h-4" />
        Reset to Defaults
      </button>
    </div>
  );
};

// Toggle Option Component
interface ToggleOptionProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}

const ToggleOption: React.FC<ToggleOptionProps> = ({
  icon,
  label,
  description,
  enabled,
  onToggle,
}) => (
  <div 
    className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/50 cursor-pointer hover:bg-zinc-800/50 transition-colors"
    onClick={onToggle}
  >
    <div className="flex items-center gap-3">
      <div className={cn(
        'p-2 rounded-lg',
        enabled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-800 text-gray-500'
      )}>
        {icon}
      </div>
      <div>
        <span className="text-white font-medium">{label}</span>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
    </div>
    <div className={cn(
      'w-12 h-6 rounded-full p-1 transition-colors duration-200',
      enabled ? 'bg-emerald-500' : 'bg-zinc-700'
    )}>
      <div className={cn(
        'w-4 h-4 bg-white rounded-full transition-transform duration-200',
        enabled && 'translate-x-6'
      )} />
    </div>
  </div>
);
