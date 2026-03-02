# 🛠️ PocketPet Widget - Setup Guide

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or later) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Java JDK 17** - [Download](https://adoptium.net/)
- **Android Studio** - [Download](https://developer.android.com/studio)
- **Android SDK** (installed via Android Studio)

## Local Development Setup

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/yourusername/pocketpet-widget.git
cd pocketpet-widget

# Install dependencies
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

Open http://localhost:5173 in your browser to see the app.

### 3. Build for Production

```bash
npm run build
```

## Android Setup

### 1. Add Android Platform

```bash
npx cap add android
```

### 2. Setup Native Widget Files

```bash
npm run setup:android
```

This copies the native widget Java files and resources to the Android project.

### 3. Sync Capacitor

```bash
npx cap sync android
```

### 4. Open in Android Studio

```bash
npx cap open android
```

### 5. Manual Configuration (if needed)

If the automatic setup didn't work, manually add the widget receiver to `android/app/src/main/AndroidManifest.xml`:

```xml
<application ...>
    <!-- Add inside application tag -->
    <receiver
        android:name="com.pocketpet.widget.PocketPetWidgetProvider"
        android:exported="true"
        android:label="@string/widget_name">
        <intent-filter>
            <action android:name="android.appwidget.action.APPWIDGET_UPDATE" />
            <action android:name="com.pocketpet.widget.TAP" />
            <action android:name="com.pocketpet.widget.UPDATE_MOOD" />
        </intent-filter>
        <meta-data
            android:name="android.appwidget.provider"
            android:resource="@xml/widget_info" />
    </receiver>
</application>
```

### 6. Register Plugin (Manual Step)

Edit `android/app/src/main/java/com/pocketpet/widget/MainActivity.java`:

```java
package com.pocketpet.widget;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(PocketPetWidgetPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
```

## Building APK

### Debug APK (Local)

```bash
npm run android:build
```

APK location: `android/app/build/outputs/apk/debug/app-debug.apk`

### Release APK (Local)

```bash
npm run android:release
```

APK location: `android/app/build/outputs/apk/release/app-release-unsigned.apk`

### Using GitHub Actions

1. Push your code to GitHub
2. Go to the "Actions" tab in your repository
3. Click on "Build Android APK" workflow
4. Click "Run workflow"
5. Wait for the build to complete
6. Download the APK from the workflow artifacts

## Signing the APK (for Play Store)

### Generate Keystore

```bash
keytool -genkey -v -keystore pocketpet.keystore -alias pocketpet -keyalg RSA -keysize 2048 -validity 10000
```

### Configure Signing in Gradle

Edit `android/app/build.gradle`:

```gradle
android {
    signingConfigs {
        release {
            storeFile file('pocketpet.keystore')
            storePassword 'your_store_password'
            keyAlias 'pocketpet'
            keyPassword 'your_key_password'
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
        }
    }
}
```

## Troubleshooting

### "Widget not showing in widget picker"

1. Make sure the app is installed (not just running from Android Studio)
2. Check that `AndroidManifest.xml` has the widget receiver
3. Reboot your device or emulator

### "App crashes when widget is tapped"

1. Check logcat for errors: `adb logcat | grep pocketpet`
2. Ensure `PocketPetWidgetPlugin` is registered in `MainActivity`

### "Gradle build fails"

1. Make sure Java 17 is installed and `JAVA_HOME` is set
2. Run `cd android && ./gradlew clean`
3. Update Android Gradle Plugin if needed

### "Capacitor sync fails"

1. Run `npm run build` first
2. Check that `capacitor.config.ts` has correct `webDir: 'dist'`

## Project Structure

```
android/
├── app/
│   ├── src/main/
│   │   ├── java/com/pocketpet/widget/
│   │   │   ├── MainActivity.java
│   │   │   ├── PocketPetWidgetProvider.java
│   │   │   └── PocketPetWidgetPlugin.java
│   │   ├── res/
│   │   │   ├── drawable/
│   │   │   │   ├── cat_idle.xml
│   │   │   │   ├── cat_sleep.xml
│   │   │   │   ├── cat_happy.xml
│   │   │   │   └── cat_jump.xml
│   │   │   ├── layout/
│   │   │   │   └── widget_layout.xml
│   │   │   ├── xml/
│   │   │   │   └── widget_info.xml
│   │   │   └── values/
│   │   │       └── widget_strings.xml
│   │   └── AndroidManifest.xml
│   └── build.gradle
└── build.gradle
```

## Commands Reference

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build production web app |
| `npm run setup:android` | Copy native widget files |
| `npm run cap:sync` | Sync web assets to Android |
| `npm run cap:open` | Open in Android Studio |
| `npm run android:build` | Build debug APK |
| `npm run android:release` | Build release APK |
