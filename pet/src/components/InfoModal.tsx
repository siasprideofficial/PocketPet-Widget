import React from 'react';
import { X, Heart, Smartphone, Sparkles, Moon } from 'lucide-react';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      
      {/* Modal */}
      <div 
        className="relative w-full max-w-md bg-zinc-900 rounded-2xl border border-zinc-800 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-800">
          <h2 className="text-xl font-bold text-white">About PocketPet</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-zinc-800 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          <p className="text-gray-400">
            PocketPet is a cute animated cat widget for your Android home screen. 
            Your virtual pet lives right on your phone!
          </p>

          <div className="space-y-3">
            <Feature
              icon={<Sparkles className="w-5 h-5" />}
              title="Interactive"
              description="Tap your pet to make it happy and see different animations"
            />
            <Feature
              icon={<Moon className="w-5 h-5" />}
              title="Auto Sleep"
              description="Your pet sleeps at night and wakes up in the morning"
            />
            <Feature
              icon={<Smartphone className="w-5 h-5" />}
              title="Home Widget"
              description="Add the widget to your home screen for quick access"
            />
            <Feature
              icon={<Heart className="w-5 h-5" />}
              title="Customizable"
              description="Choose from different pet styles and mood settings"
            />
          </div>

          {/* Widget Instructions */}
          <div className="p-4 rounded-xl bg-zinc-800/50 border border-zinc-700">
            <h3 className="text-sm font-semibold text-white mb-2">How to add widget:</h3>
            <ol className="text-sm text-gray-400 space-y-1 list-decimal list-inside">
              <li>Long press on your home screen</li>
              <li>Select "Widgets"</li>
              <li>Find "PocketPet Widget"</li>
              <li>Drag to your home screen</li>
            </ol>
          </div>

          {/* Version */}
          <p className="text-center text-xs text-gray-600">
            Version 1.0.0 • Made with ❤️
          </p>
        </div>
      </div>
    </div>
  );
};

// Feature item component
const Feature: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({ icon, title, description }) => (
  <div className="flex items-start gap-3">
    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
      {icon}
    </div>
    <div>
      <h4 className="text-sm font-medium text-white">{title}</h4>
      <p className="text-xs text-gray-500">{description}</p>
    </div>
  </div>
);
