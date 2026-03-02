import React from 'react';
import { Cat, Github, Info } from 'lucide-react';

interface HeaderProps {
  onInfoClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onInfoClick }) => {
  return (
    <header className="flex items-center justify-between px-4 py-3 bg-zinc-950/80 backdrop-blur-lg sticky top-0 z-50 border-b border-zinc-800">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500">
          <Cat className="w-5 h-5 text-black" />
        </div>
        <div>
          <h1 className="text-lg font-bold gradient-text">PocketPet</h1>
          <p className="text-[10px] text-gray-500 -mt-1">Widget</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <a
          href="https://github.com/pocketpet/widget"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-gray-400 hover:text-white transition-colors"
        >
          <Github className="w-5 h-5" />
        </a>
        <button
          onClick={onInfoClick}
          className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-gray-400 hover:text-white transition-colors"
        >
          <Info className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};
