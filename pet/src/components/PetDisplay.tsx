import React, { useState } from 'react';
import { PetMood, PetStyle, MOOD_INFO } from '../types/pet';
import { cn } from '../utils/cn';

interface PetDisplayProps {
  mood: PetMood;
  style: PetStyle;
  animationsEnabled: boolean;
  onTap: () => void;
  size?: 'small' | 'medium' | 'large';
  showStatus?: boolean;
}

// SVG Cat components for different moods
const CatIdle: React.FC<{ color: string }> = ({ color }) => (
  <svg viewBox="0 0 200 200" className="w-full h-full">
    {/* Body */}
    <ellipse cx="100" cy="130" rx="50" ry="40" fill={color} />
    {/* Head */}
    <circle cx="100" cy="80" r="40" fill={color} />
    {/* Ears */}
    <polygon points="65,55 75,20 90,50" fill={color} />
    <polygon points="135,55 125,20 110,50" fill={color} />
    <polygon points="70,50 78,28 87,48" fill="#ffb6c1" />
    <polygon points="130,50 122,28 113,48" fill="#ffb6c1" />
    {/* Eyes */}
    <ellipse cx="85" cy="75" rx="8" ry="10" fill="white" />
    <ellipse cx="115" cy="75" rx="8" ry="10" fill="white" />
    <circle cx="85" cy="77" r="5" fill="#333" />
    <circle cx="115" cy="77" r="5" fill="#333" />
    <circle cx="83" cy="75" r="2" fill="white" />
    <circle cx="113" cy="75" r="2" fill="white" />
    {/* Nose */}
    <ellipse cx="100" cy="90" rx="5" ry="4" fill="#ffb6c1" />
    {/* Mouth */}
    <path d="M95 95 Q100 100 105 95" stroke="#333" strokeWidth="2" fill="none" />
    {/* Whiskers */}
    <line x1="60" y1="85" x2="80" y2="88" stroke="#333" strokeWidth="1" />
    <line x1="60" y1="90" x2="80" y2="90" stroke="#333" strokeWidth="1" />
    <line x1="60" y1="95" x2="80" y2="92" stroke="#333" strokeWidth="1" />
    <line x1="140" y1="85" x2="120" y2="88" stroke="#333" strokeWidth="1" />
    <line x1="140" y1="90" x2="120" y2="90" stroke="#333" strokeWidth="1" />
    <line x1="140" y1="95" x2="120" y2="92" stroke="#333" strokeWidth="1" />
    {/* Tail */}
    <path d="M150 130 Q180 100 160 80" stroke={color} strokeWidth="12" fill="none" strokeLinecap="round" />
    {/* Paws */}
    <ellipse cx="70" cy="165" rx="15" ry="8" fill={color} />
    <ellipse cx="130" cy="165" rx="15" ry="8" fill={color} />
  </svg>
);

const CatSleep: React.FC<{ color: string }> = ({ color }) => (
  <svg viewBox="0 0 200 200" className="w-full h-full">
    {/* Body - curled up */}
    <ellipse cx="100" cy="140" rx="60" ry="35" fill={color} />
    {/* Head */}
    <circle cx="80" cy="110" r="35" fill={color} />
    {/* Ears */}
    <polygon points="50,90 55,60 70,85" fill={color} />
    <polygon points="105,85 100,55 85,80" fill={color} />
    <polygon points="53,87 58,65 68,83" fill="#ffb6c1" />
    <polygon points="102,83 98,60 88,78" fill="#ffb6c1" />
    {/* Closed eyes */}
    <path d="M65 105 Q72 100 80 105" stroke="#333" strokeWidth="3" fill="none" />
    <path d="M85 102 Q92 97 100 102" stroke="#333" strokeWidth="3" fill="none" />
    {/* Nose */}
    <ellipse cx="82" cy="115" rx="4" ry="3" fill="#ffb6c1" />
    {/* Smile */}
    <path d="M78 120 Q82 123 86 120" stroke="#333" strokeWidth="2" fill="none" />
    {/* Tail wrapped around */}
    <path d="M160 140 Q170 120 150 110 Q130 100 110 120" stroke={color} strokeWidth="12" fill="none" strokeLinecap="round" />
    {/* Zzz */}
    <text x="130" y="80" fill="#00ff88" fontSize="16" fontWeight="bold">Z</text>
    <text x="145" y="65" fill="#00ff88" fontSize="14" fontWeight="bold">z</text>
    <text x="155" y="55" fill="#00ff88" fontSize="12" fontWeight="bold">z</text>
  </svg>
);

const CatHappy: React.FC<{ color: string }> = ({ color }) => (
  <svg viewBox="0 0 200 200" className="w-full h-full">
    {/* Body */}
    <ellipse cx="100" cy="130" rx="50" ry="40" fill={color} />
    {/* Head */}
    <circle cx="100" cy="80" r="40" fill={color} />
    {/* Ears */}
    <polygon points="65,55 75,20 90,50" fill={color} />
    <polygon points="135,55 125,20 110,50" fill={color} />
    <polygon points="70,50 78,28 87,48" fill="#ffb6c1" />
    <polygon points="130,50 122,28 113,48" fill="#ffb6c1" />
    {/* Happy closed eyes */}
    <path d="M75 75 Q85 65 95 75" stroke="#333" strokeWidth="3" fill="none" />
    <path d="M105 75 Q115 65 125 75" stroke="#333" strokeWidth="3" fill="none" />
    {/* Blush */}
    <circle cx="70" cy="85" r="8" fill="#ffb6c1" opacity="0.5" />
    <circle cx="130" cy="85" r="8" fill="#ffb6c1" opacity="0.5" />
    {/* Nose */}
    <ellipse cx="100" cy="88" rx="5" ry="4" fill="#ffb6c1" />
    {/* Big smile */}
    <path d="M85 95 Q100 110 115 95" stroke="#333" strokeWidth="2" fill="none" />
    {/* Whiskers */}
    <line x1="55" y1="83" x2="78" y2="88" stroke="#333" strokeWidth="1" />
    <line x1="55" y1="90" x2="78" y2="90" stroke="#333" strokeWidth="1" />
    <line x1="145" y1="83" x2="122" y2="88" stroke="#333" strokeWidth="1" />
    <line x1="145" y1="90" x2="122" y2="90" stroke="#333" strokeWidth="1" />
    {/* Tail - excited up position */}
    <path d="M150 130 Q175 90 165 60" stroke={color} strokeWidth="12" fill="none" strokeLinecap="round" />
    {/* Paws */}
    <ellipse cx="70" cy="165" rx="15" ry="8" fill={color} />
    <ellipse cx="130" cy="165" rx="15" ry="8" fill={color} />
    {/* Hearts */}
    <text x="45" y="50" fontSize="20">❤️</text>
    <text x="140" y="45" fontSize="16">💕</text>
  </svg>
);

const CatJump: React.FC<{ color: string }> = ({ color }) => (
  <svg viewBox="0 0 200 200" className="w-full h-full">
    {/* Body - stretched */}
    <ellipse cx="100" cy="120" rx="45" ry="35" fill={color} />
    {/* Head */}
    <circle cx="100" cy="70" r="38" fill={color} />
    {/* Ears - alert */}
    <polygon points="68,48 80,10 95,45" fill={color} />
    <polygon points="132,48 120,10 105,45" fill={color} />
    <polygon points="72,45 82,18 92,43" fill="#ffb6c1" />
    <polygon points="128,45 118,18 108,43" fill="#ffb6c1" />
    {/* Wide eyes */}
    <ellipse cx="82" cy="65" rx="12" ry="14" fill="white" />
    <ellipse cx="118" cy="65" rx="12" ry="14" fill="white" />
    <circle cx="82" cy="67" r="7" fill="#333" />
    <circle cx="118" cy="67" r="7" fill="#333" />
    <circle cx="80" cy="63" r="3" fill="white" />
    <circle cx="116" cy="63" r="3" fill="white" />
    {/* Nose */}
    <ellipse cx="100" cy="82" rx="5" ry="4" fill="#ffb6c1" />
    {/* Open mouth */}
    <ellipse cx="100" cy="92" rx="8" ry="5" fill="#333" />
    {/* Whiskers */}
    <line x1="55" y1="78" x2="78" y2="82" stroke="#333" strokeWidth="1" />
    <line x1="55" y1="85" x2="78" y2="85" stroke="#333" strokeWidth="1" />
    <line x1="145" y1="78" x2="122" y2="82" stroke="#333" strokeWidth="1" />
    <line x1="145" y1="85" x2="122" y2="85" stroke="#333" strokeWidth="1" />
    {/* Extended paws */}
    <ellipse cx="55" cy="145" rx="18" ry="10" fill={color} />
    <ellipse cx="145" cy="145" rx="18" ry="10" fill={color} />
    {/* Back paws */}
    <ellipse cx="65" cy="155" rx="12" ry="8" fill={color} />
    <ellipse cx="135" cy="155" rx="12" ry="8" fill={color} />
    {/* Tail - up and wavy */}
    <path d="M145 120 Q180 80 160 40" stroke={color} strokeWidth="12" fill="none" strokeLinecap="round" />
    {/* Motion lines */}
    <line x1="30" y1="170" x2="50" y2="170" stroke="#666" strokeWidth="2" />
    <line x1="35" y1="180" x2="60" y2="180" stroke="#666" strokeWidth="2" />
    <line x1="150" y1="170" x2="170" y2="170" stroke="#666" strokeWidth="2" />
    <line x1="145" y1="180" x2="165" y2="180" stroke="#666" strokeWidth="2" />
  </svg>
);

// Color mapping for pet styles
const STYLE_COLORS: Record<PetStyle, string> = {
  default: '#f59e0b',
  orange: '#ea580c',
  gray: '#9ca3af',
  black: '#374151',
  white: '#e5e7eb',
};

export const PetDisplay: React.FC<PetDisplayProps> = ({
  mood,
  style,
  animationsEnabled,
  onTap,
  size = 'medium',
  showStatus = true,
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number }[]>([]);

  const color = STYLE_COLORS[style];
  const moodInfo = MOOD_INFO[mood];

  // Add sparkle effect on tap
  const handleTap = () => {
    onTap();
    
    // Add random sparkles
    const newSparkles = Array.from({ length: 5 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      y: Math.random() * 100,
    }));
    setSparkles(prev => [...prev, ...newSparkles]);
    
    // Remove sparkles after animation
    setTimeout(() => {
      setSparkles(prev => prev.filter(s => !newSparkles.find(ns => ns.id === s.id)));
    }, 1000);
  };

  const sizeClasses = {
    small: 'w-32 h-32',
    medium: 'w-48 h-48',
    large: 'w-64 h-64',
  };

  const animationClass = animationsEnabled ? {
    idle: 'animate-pet-idle',
    sleep: 'animate-pet-sleep',
    happy: 'animate-pet-happy',
    jump: 'animate-pet-jump',
  }[mood] : '';

  const CatComponent = {
    idle: CatIdle,
    sleep: CatSleep,
    happy: CatHappy,
    jump: CatJump,
  }[mood];

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Pet container */}
      <div
        className={cn(
          'relative cursor-pointer transition-transform',
          sizeClasses[size],
          isPressed && 'scale-95',
        )}
        onClick={handleTap}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onMouseLeave={() => setIsPressed(false)}
        onTouchStart={() => setIsPressed(true)}
        onTouchEnd={() => setIsPressed(false)}
      >
        {/* Glow effect background */}
        <div 
          className={cn(
            'absolute inset-0 rounded-full blur-xl opacity-30',
            animationsEnabled && 'animate-pulse-glow'
          )}
          style={{ backgroundColor: color }}
        />
        
        {/* Pet SVG */}
        <div className={cn('relative z-10', animationClass)}>
          <CatComponent color={color} />
        </div>

        {/* Sparkle effects */}
        {sparkles.map(sparkle => (
          <div
            key={sparkle.id}
            className="absolute w-4 h-4 text-yellow-400 animate-ping"
            style={{ left: `${sparkle.x}%`, top: `${sparkle.y}%` }}
          >
            ✨
          </div>
        ))}
      </div>

      {/* Status indicator */}
      {showStatus && (
        <div className="flex items-center gap-2 px-4 py-2 rounded-full glass-card">
          <span className="text-2xl">{moodInfo.emoji}</span>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-white">{moodInfo.label}</span>
            <span className="text-xs text-gray-400">{moodInfo.description}</span>
          </div>
        </div>
      )}
    </div>
  );
};
