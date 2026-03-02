/**
 * AndroidManifest.xml Merger Script
 * 
 * This script merges the widget-related manifest entries into
 * the Capacitor-generated AndroidManifest.xml
 * 
 * Note: Using .cjs extension for CommonJS compatibility
 */

const fs = require('fs');
const path = require('path');

const MANIFEST_PATH = path.join(__dirname, '../android/app/src/main/AndroidManifest.xml');
const STRINGS_PATH = path.join(__dirname, '../android/app/src/main/res/values/strings.xml');

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

const WIDGET_STRINGS = `
    <!-- Widget Strings -->
    <string name="widget_name">PocketPet Widget</string>
    <string name="widget_description">A cute pet that lives on your home screen</string>
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
    } else {
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
}

function mergeStrings() {
    console.log('📝 Adding widget strings to strings.xml...');
    
    if (!fs.existsSync(STRINGS_PATH)) {
        console.error('❌ strings.xml not found at:', STRINGS_PATH);
        console.log('⚠️ Skipping strings merge - will be handled by Capacitor');
        return;
    }
    
    let strings = fs.readFileSync(STRINGS_PATH, 'utf8');
    
    // Check if widget strings already added
    if (strings.includes('widget_name')) {
        console.log('✅ Widget strings already configured');
        return;
    }
    
    // Find closing </resources> tag
    const resourcesClosingTag = '</resources>';
    const insertIndex = strings.lastIndexOf(resourcesClosingTag);
    
    if (insertIndex === -1) {
        console.error('❌ Could not find </resources> tag in strings.xml');
        return;
    }
    
    // Insert widget strings
    strings = strings.slice(0, insertIndex) + WIDGET_STRINGS + '\n' + strings.slice(insertIndex);
    
    fs.writeFileSync(STRINGS_PATH, strings, 'utf8');
    console.log('✅ Widget strings added to strings.xml');
}

// Run the merges
try {
    mergeManifest();
    mergeStrings();
    console.log('🎉 Manifest merge complete!');
} catch (error) {
    console.error('❌ Error during merge:', error.message);
    process.exit(1);
}
