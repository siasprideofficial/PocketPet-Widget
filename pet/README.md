# 🐱 PocketPet Widget

A cute animated pet widget for your Android home screen! Your virtual cat lives right on your phone.

![PocketPet Widget](./docs/preview.png)

## ✨ Features

- **Home Screen Widget** - Beautiful widget showing your animated pet
- **Interactive** - Tap to interact with your pet
- **Multiple Moods** - Idle, Sleep, Happy, Jump animations
- **Customizable Styles** - Choose from different cat colors
- **Auto Sleep Mode** - Pet sleeps at night automatically
- **Random Mood Changes** - Pet changes mood randomly throughout the day

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Java JDK 17+
- Android Studio (for manual builds)
- Android SDK

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/pocketpet-widget.git
cd pocketpet-widget

# Install dependencies
npm install

# Build the web app
npm run build

# Add Android platform
npx cap add android

# Setup native widget files
npm run setup:android

# Sync Capacitor
npx cap sync android
```

### Running Locally

```bash
# Start development server
npm run dev

# Build for production
npm run build
```

### Building APK

#### Option 1: GitHub Actions (Recommended)

1. Push code to GitHub
2. Go to Actions tab
3. Run "Build Android APK" workflow
4. Download APK from artifacts

#### Option 2: Local Build

```bash
# Build web app
npm run build

# Sync with Android
npx cap sync android

# Build APK (requires Android Studio)
cd android
./gradlew assembleDebug

# APK will be at: android/app/build/outputs/apk/debug/app-debug.apk
```

## 📁 Project Structure

```
pocketpet-widget/
├── src/                          # React source code
│   ├── components/               # UI components
│   │   ├── PetDisplay.tsx       # Main pet display with SVG
│   │   ├── MoodSelector.tsx     # Mood selection buttons
│   │   ├── StyleSelector.tsx    # Pet style/color picker
│   │   ├── SettingsPanel.tsx    # App settings
│   │   ├── WidgetPreview.tsx    # Widget mockup preview
│   │   ├── Header.tsx           # App header
│   │   └── InfoModal.tsx        # About modal
│   ├── hooks/                    # Custom React hooks
│   │   ├── usePetState.ts       # Pet state management
│   │   └── useWidgetBridge.ts   # Native widget communication
│   ├── types/                    # TypeScript types
│   │   └── pet.ts               # Pet-related types
│   ├── App.tsx                   # Main app component
│   ├── main.tsx                  # App entry point
│   └── index.css                 # Global styles
├── widget-native/                # Native Android widget code
│   ├── java/                     # Java source files
│   │   ├── PocketPetWidgetProvider.java
│   │   └── PocketPetWidgetPlugin.java
│   └── res/                      # Android resources
│       ├── layout/               # Widget layouts
│       ├── xml/                  # Widget info
│       ├── drawable/             # Cat vector drawables
│       └── values/               # Strings
├── scripts/                      # Build scripts
│   ├── merge-manifest.cjs       # Manifest merger (CommonJS)
│   └── setup-android.cjs        # Android setup script (CommonJS)
├── .github/
│   └── workflows/
│       └── build-apk.yml        # GitHub Actions workflow
├── capacitor.config.ts          # Capacitor configuration
├── vite.config.ts               # Vite configuration
└── package.json                 # Project dependencies
```

## 🎨 Customization

### Adding New Pet Styles

1. Add new style to `src/types/pet.ts`:
```typescript
export type PetStyle = 'default' | 'orange' | 'gray' | 'black' | 'white' | 'YOUR_NEW_STYLE';
```

2. Add color mapping in `src/components/PetDisplay.tsx`:
```typescript
const STYLE_COLORS: Record<PetStyle, string> = {
  // ... existing styles
  YOUR_NEW_STYLE: '#HEX_COLOR',
};
```

3. Add style info in `src/types/pet.ts`:
```typescript
export const STYLE_INFO: Record<PetStyle, { label: string; color: string }> = {
  // ... existing styles
  YOUR_NEW_STYLE: { label: 'Display Name', color: '#HEX_COLOR' },
};
```

### Adding New Moods

1. Update `PetMood` type in `src/types/pet.ts`
2. Add SVG component in `PetDisplay.tsx`
3. Add drawable in `widget-native/res/drawable/`
4. Update `PocketPetWidgetProvider.java`

## 📱 Widget Installation

After installing the app:

1. Long press on your home screen
2. Select "Widgets"
3. Find "PocketPet Widget"
4. Drag to your home screen
5. Tap the widget to open the app!

## 🔧 Technical Details

### Technologies Used

- **Frontend**: React 19, Vite, Tailwind CSS
- **Mobile Bridge**: Capacitor
- **Native Widget**: Android AppWidgetProvider
- **Build**: GitHub Actions, Gradle

### Widget Update Flow

1. User taps widget → `PocketPetWidgetProvider.onReceive()`
2. Provider updates mood and triggers RemoteViews update
3. Provider broadcasts event to React app
4. React app (if open) receives event via `useWidgetBridge`

### State Synchronization

- Widget state stored in SharedPreferences
- React app state stored in localStorage
- Capacitor plugin syncs between both layers

## 📄 License

MIT License - feel free to use this project as you wish!

## 🤝 Contributing

Contributions welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 💖 Support

If you like this project, please give it a ⭐ on GitHub!

---

Made with ❤️ for cat lovers everywhere
