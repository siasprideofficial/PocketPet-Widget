/**
 * AndroidManifest.xml Merger Script
 * 
 * This script merges the widget-related manifest entries into
 * the Capacitor-generated AndroidManifest.xml
 */

const fs = require('fs');
const path = require('path');

const MANIFEST_PATH = path.join(__dirname, '../android/app/src/main/AndroidManifest.xml');
const WIDGET_MANIFEST_SNIPPET = `
        <!-- PocketPet Widget Provider -->
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
`;

function mergeManifest() {
    console.log('📱 Merging widget configuration into AndroidManifest.xml...');
    
    if (!fs.existsSync(MANIFEST_PATH)) {
        console.error('❌ AndroidManifest.xml not found at:', MANIFEST_PATH);
        process.exit(1);
    }
    
    let manifest = fs.readFileSync(MANIFEST_PATH, 'utf8');
    
    // Check if widget is already added
    if (manifest.includes('PocketPetWidgetProvider')) {
        console.log('✅ Widget already configured in manifest');
        return;
    }
    
    // Find the closing </application> tag and insert widget config before it
    const appClosingTag = '</application>';
    const insertIndex = manifest.lastIndexOf(appClosingTag);
    
    if (insertIndex === -1) {
        console.error('❌ Could not find </application> tag in manifest');
        process.exit(1);
    }
    
    // Insert widget configuration
    manifest = manifest.slice(0, insertIndex) + WIDGET_MANIFEST_SNIPPET + '\n        ' + manifest.slice(insertIndex);
    
    // Write updated manifest
    fs.writeFileSync(MANIFEST_PATH, manifest, 'utf8');
    console.log('✅ Widget configuration added to AndroidManifest.xml');
}

// Run the merge
mergeManifest();
