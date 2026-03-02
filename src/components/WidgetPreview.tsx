import React from 'react';
import { PetMood, PetStyle, MOOD_INFO } from '../types/pet';
import { cn } from '../utils/cn';
import { Smartphone, RefreshCw } from 'lucide-react';

interface WidgetPreviewProps {
  mood: PetMood;
  style: PetStyle;
  onRefresh?: () => void;
}

// Mini cat SVG for widget preview
const MiniCat: React.FC<{ mood: PetMood; color: string }> = ({ mood, color }) => {
  const isAsleep = mood === 'sleep';
  
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      {/* Body */}
      <ellipse cx="50" cy="65" rx="25" ry="20" fill={color} />
      {/* Head */}
      <circle cx="50" cy="40" r="20" fill={color} />
      {/* Ears */}
      <polygon points="33,28 38,10 45,25" fill={color} />
      <polygon points="67,28 62,10 55,25" fill={color} />
      <polygon points="35,26 39,14 44,24" fill="#ffb6c1" />
      <polygon points="65,26 61,14 56,24" fill="#ffb6c1" />
      {/* Eyes */}
      {isAsleep ? (
        <>
          <path d="M40 38 Q45 35 50 38" stroke="#333" strokeWidth="2" fill="none" />
          <path d="M50 38 Q55 35 60 38" stroke="#333" strokeWidth="2" fill="none" />
        </>
      ) : (
        <>
          <circle cx="43" cy="38" r="4" fill="white" />
          <circle cx="57" cy="38" r="4" fill="white" />
          <circle cx="43" cy="39" r="2" fill="#333" />
          <circle cx="57" cy="39" r="2" fill="#333" />
        </>
      )}
      {/* Nose */}
      <ellipse cx="50" cy="45" rx="2" ry="1.5" fill="#ffb6c1" />
      {/* Mouth */}
      <path d="M47 48 Q50 51 53 48" stroke="#333" strokeWidth="1" fill="none" />
      {/* Tail */}
      <path d="M75 65 Q90 50 80 35" stroke={color} strokeWidth="6" fill="none" strokeLinecap="round" />
    </svg>
  );
};

// Color mapping for pet styles
const STYLE_COLORS: Record<PetStyle, string> = {
  default: '#f59e0b',
  orange: '#ea580c',
  gray: '#9ca3af',
  black: '#374151',
  white: '#e5e7eb',
};

export const WidgetPreview: React.FC<WidgetPreviewProps> = ({
  mood,
  style,
  onRefresh,
}) => {
  const color = STYLE_COLORS[style];
  const moodInfo = MOOD_INFO[mood];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Smartphone className="w-5 h-5" />
          Widget Preview
        </h3>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-gray-400 hover:text-white transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Widget mockup */}
      <div className="relative mx-auto max-w-[200px]">
        {/* Phone frame */}
        <div className="bg-zinc-800 rounded-3xl p-2 shadow-xl">
          {/* Screen */}
          <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 rounded-2xl p-4 aspect-square">
            {/* Widget container */}
            <div 
              className={cn(
                'w-full h-full rounded-2xl p-3 flex flex-col items-center justify-center',
                'bg-gradient-to-br from-zinc-800/90 to-zinc-900/90',
                'border border-zinc-700/50 shadow-lg'
              )}
            >
              {/* Pet */}
              <div className="w-20 h-20 mb-2 animate-float">
                <MiniCat mood={mood} color={color} />
              </div>
              
              {/* Status */}
              <div className="flex items-center gap-1 text-xs">
                <span>{moodInfo.emoji}</span>
                <span className="text-gray-400">{moodInfo.label}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Glow effect */}
        <div 
          className="absolute inset-0 rounded-3xl blur-2xl opacity-20 -z-10"
          style={{ backgroundColor: color }}
        />
      </div>

      <p className="text-center text-xs text-gray-500 mt-3">
        Tap widget on home screen to interact
      </p>
    </div>
  );
};
