# 🚀 GitHub Actions APK Build

This project includes a GitHub Actions workflow that automatically builds Android APKs.

## Workflow Location

`.github/workflows/build-apk.yml`

## Triggers

The workflow runs on:

1. **Push to main/master** - Automatically builds when code is pushed
2. **Pull Requests** - Builds on PRs to verify they work
3. **Manual Trigger** - Can be triggered manually from GitHub UI

## What It Does

1. **Checkout** - Gets the code from the repository
2. **Setup Node.js** - Installs Node.js 20
3. **Install Dependencies** - Runs `npm ci`
4. **Build Web App** - Runs `npm run build`
5. **Setup Android** - Adds Android platform and copies native files
6. **Sync Capacitor** - Syncs web assets to Android
7. **Setup Java** - Installs JDK 17
8. **Build APKs** - Creates both debug and release APKs
9. **Upload Artifacts** - Makes APKs downloadable

## Downloading APKs

1. Go to your GitHub repository
2. Click on "Actions" tab
3. Click on the latest workflow run
4. Scroll down to "Artifacts"
5. Download `pocketpet-debug-apk` or `pocketpet-release-apk`

## Manual Trigger

1. Go to "Actions" tab
2. Click on "Build Android APK" workflow
3. Click "Run workflow"
4. Select branch and click green "Run workflow" button

## Adding Signed Release

To create signed release builds:

### 1. Create Repository Secrets

Go to Settings > Secrets and variables > Actions, add:

- `KEYSTORE_BASE64` - Your keystore file encoded in base64
- `KEYSTORE_PASSWORD` - Keystore password
- `KEY_ALIAS` - Key alias
- `KEY_PASSWORD` - Key password

### 2. Encode Your Keystore

```bash
base64 -i pocketpet.keystore -o keystore.base64
```

Copy the contents of `keystore.base64` to the `KEYSTORE_BASE64` secret.

### 3. Add Signing Steps to Workflow

Add these steps before the "Build Release APK" step:

```yaml
- name: Decode Keystore
  run: |
    echo "${{ secrets.KEYSTORE_BASE64 }}" | base64 -d > android/app/pocketpet.keystore
    
- name: Setup signing
  run: |
    echo "storeFile=pocketpet.keystore" >> android/app/signing.properties
    echo "storePassword=${{ secrets.KEYSTORE_PASSWORD }}" >> android/app/signing.properties
    echo "keyAlias=${{ secrets.KEY_ALIAS }}" >> android/app/signing.properties
    echo "keyPassword=${{ secrets.KEY_PASSWORD }}" >> android/app/signing.properties
```

## Creating Releases

To automatically create GitHub releases with APKs:

1. Tag your commit: `git tag v1.0.0`
2. Push the tag: `git push origin v1.0.0`
3. The workflow will create a release with APKs attached

## Customizing the Workflow

### Change Node.js Version

```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '22'  # Change version here
```

### Change Java Version

```yaml
- name: Set up JDK 17
  uses: actions/setup-java@v4
  with:
    java-version: '21'  # Change version here
```

### Add Tests

```yaml
- name: Run Tests
  run: npm test
```

## Troubleshooting

### Build Fails at Gradle Step

- Check Java version compatibility
- Ensure Gradle wrapper is present
- Check for missing dependencies

### Missing Android SDK

The workflow uses default Android SDK from the runner. If specific SDK versions are needed:

```yaml
- name: Setup Android SDK
  uses: android-actions/setup-android@v3
  with:
    api-level: 34
```

### Artifact Not Found

Check that the APK paths match:
- Debug: `android/app/build/outputs/apk/debug/app-debug.apk`
- Release: `android/app/build/outputs/apk/release/app-release-unsigned.apk`
