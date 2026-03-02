import React from 'react';
import { PetStyle, STYLE_INFO } from '../types/pet';
import { cn } from '../utils/cn';
import { Check } from 'lucide-react';

interface StyleSelectorProps {
  currentStyle: PetStyle;
  onStyleChange: (style: PetStyle) => void;
}

export const StyleSelector: React.FC<StyleSelectorProps> = ({
  currentStyle,
  onStyleChange,
}) => {
  const styles = Object.entries(STYLE_INFO) as [PetStyle, typeof STYLE_INFO[PetStyle]][];

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
        <span className="text-xl">🎨</span>
        Pet Style
      </h3>
      <div className="flex flex-wrap gap-3">
        {styles.map(([style, info]) => (
          <button
            key={style}
            onClick={() => onStyleChange(style)}
            className={cn(
              'relative flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-200',
              'border-2 min-w-[80px]',
              currentStyle === style
                ? 'border-emerald-500 bg-zinc-900'
                : 'border-zinc-700 bg-zinc-900/50 hover:border-zinc-600'
            )}
          >
            {/* Color swatch */}
            <div
              className="w-10 h-10 rounded-full shadow-lg"
              style={{ 
                backgroundColor: info.color,
                boxShadow: currentStyle === style 
                  ? `0 0 15px ${info.color}50` 
                  : 'none'
              }}
            />
            
            {/* Label */}
            <span className={cn(
              'text-sm font-medium',
              currentStyle === style ? 'text-emerald-400' : 'text-gray-400'
            )}>
              {info.label}
            </span>

            {/* Check indicator */}
            {currentStyle === style && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                <Check className="w-3 h-3 text-black" />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
