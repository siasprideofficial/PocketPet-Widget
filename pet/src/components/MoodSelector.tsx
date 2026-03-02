import React from 'react';
import { PetMood, MOOD_INFO } from '../types/pet';
import { cn } from '../utils/cn';

interface MoodSelectorProps {
  currentMood: PetMood;
  onMoodChange: (mood: PetMood) => void;
}

export const MoodSelector: React.FC<MoodSelectorProps> = ({
  currentMood,
  onMoodChange,
}) => {
  const moods = Object.entries(MOOD_INFO) as [PetMood, typeof MOOD_INFO[PetMood]][];

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
        <span className="text-xl">🎭</span>
        Pet Mood
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {moods.map(([mood, info]) => (
          <button
            key={mood}
            onClick={() => onMoodChange(mood)}
            className={cn(
              'flex items-center gap-3 p-4 rounded-xl transition-all duration-200',
              'border border-transparent',
              currentMood === mood
                ? 'bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border-emerald-500/50 glow-primary'
                : 'bg-zinc-900/80 hover:bg-zinc-800/80 hover:border-zinc-700'
            )}
          >
            <span className="text-3xl">{info.emoji}</span>
            <div className="flex flex-col items-start">
              <span className={cn(
                'font-medium',
                currentMood === mood ? 'text-emerald-400' : 'text-white'
              )}>
                {info.label}
              </span>
              <span className="text-xs text-gray-500 text-left">
                {info.description}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
