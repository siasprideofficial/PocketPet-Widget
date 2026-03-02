import { useState } from 'react';
import { Header } from './components/Header';
import { PetDisplay } from './components/PetDisplay';
import { MoodSelector } from './components/MoodSelector';
import { StyleSelector } from './components/StyleSelector';
import { SettingsPanel } from './components/SettingsPanel';
import { WidgetPreview } from './components/WidgetPreview';
import { InfoModal } from './components/InfoModal';
import { usePetState } from './hooks/usePetState';
import { useWidgetBridge } from './hooks/useWidgetBridge';

type TabType = 'pet' | 'customize' | 'settings';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('pet');
  const [showInfo, setShowInfo] = useState(false);

  const {
    petState,
    settings,
    setMood,
    setStyle,
    toggleAnimations,
    handleTap,
    updateSettings,
    resetState,
  } = usePetState();

  // Bridge for widget communication
  const { refreshWidget } = useWidgetBridge(handleTap);

  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'pet', label: 'Pet', icon: '🐱' },
    { id: 'customize', label: 'Customize', icon: '🎨' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Header onInfoClick={() => setShowInfo(true)} />

      {/* Main content */}
      <main className="flex-1 overflow-auto pb-20">
        {/* Pet Tab */}
        {activeTab === 'pet' && (
          <div className="flex flex-col items-center gap-6 p-6">
            {/* Main pet display */}
            <div className="py-8">
              <PetDisplay
                mood={petState.mood}
                style={petState.style}
                animationsEnabled={petState.animationsEnabled}
                onTap={handleTap}
                size="large"
                showStatus
              />
            </div>

            {/* Interaction hint */}
            <div className="text-center">
              <p className="text-gray-400 text-sm">
                Tap your pet to interact! 
              </p>
              <p className="text-gray-600 text-xs mt-1">
                Taps: {petState.tapCount} • Every 5 taps triggers a jump!
              </p>
            </div>

            {/* Widget preview */}
            <div className="w-full max-w-sm mt-4">
              <WidgetPreview
                mood={petState.mood}
                style={petState.style}
                onRefresh={refreshWidget}
              />
            </div>
          </div>
        )}

        {/* Customize Tab */}
        {activeTab === 'customize' && (
          <div className="flex flex-col gap-6 p-6">
            {/* Pet preview */}
            <div className="flex justify-center py-4">
              <PetDisplay
                mood={petState.mood}
                style={petState.style}
                animationsEnabled={petState.animationsEnabled}
                onTap={handleTap}
                size="medium"
                showStatus={false}
              />
            </div>

            {/* Style selector */}
            <StyleSelector
              currentStyle={petState.style}
              onStyleChange={setStyle}
            />

            {/* Mood selector */}
            <MoodSelector
              currentMood={petState.mood}
              onMoodChange={setMood}
            />
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="flex flex-col gap-6 p-6">
            <SettingsPanel
              settings={settings}
              animationsEnabled={petState.animationsEnabled}
              onSettingsChange={updateSettings}
              onToggleAnimations={toggleAnimations}
              onReset={resetState}
            />

            {/* App info card */}
            <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800">
              <h4 className="text-sm font-semibold text-white mb-2">Widget Info</h4>
              <div className="space-y-2 text-xs text-gray-500">
                <p>Last state change: {new Date(petState.lastInteraction).toLocaleTimeString()}</p>
                <p>Current mood: {petState.mood}</p>
                <p>Total interactions: {petState.tapCount}</p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-zinc-950/95 backdrop-blur-lg border-t border-zinc-800 safe-area-bottom">
        <div className="flex justify-around items-center h-16">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-1 px-6 py-2 rounded-xl transition-all ${
                activeTab === tab.id
                  ? 'text-emerald-400'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <span className="text-xl">{tab.icon}</span>
              <span className="text-xs font-medium">{tab.label}</span>
              {activeTab === tab.id && (
                <div className="absolute bottom-1 w-8 h-1 rounded-full bg-emerald-500" />
              )}
            </button>
          ))}
        </div>
      </nav>

      {/* Info modal */}
      <InfoModal isOpen={showInfo} onClose={() => setShowInfo(false)} />
    </div>
  );
}
