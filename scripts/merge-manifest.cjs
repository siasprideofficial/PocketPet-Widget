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

const ANDROID_MAIN_PATH = path.join(__dirname, '../android/app/src/main');
const MANIFEST_PATH = path.join(ANDROID_MAIN_PATH, 'AndroidManifest.xml');
const STRINGS_PATH = path.join(ANDROID_MAIN_PATH, 'res/values/strings.xml');
const WIDGET_STRINGS_PATH = path.join(ANDROID_MAIN_PATH, 'res/values/widget_strings.xml');
const WIDGET_JAVA_PATH = path.join(ANDROID_MAIN_PATH, 'java/com/pocketpet/widget');

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

function cleanupDuplicateFiles() {
    console.log('🧹 Cleaning up duplicate resource files...');
    
    // Remove widget_strings.xml if it exists (to prevent duplicate resources)
    if (fs.existsSync(WIDGET_STRINGS_PATH)) {
        fs.unlinkSync(WIDGET_STRINGS_PATH);
        console.log('✅ Removed duplicate widget_strings.xml');
    }
}

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
        console.log('⚠️ Creating new strings.xml file...');
        
        // Create the values directory if it doesn't exist
        const valuesDir = path.dirname(STRINGS_PATH);
        if (!fs.existsSync(valuesDir)) {
            fs.mkdirSync(valuesDir, { recursive: true });
        }
        
        // Create a new strings.xml with widget strings
        const newStrings = `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">PocketPet Widget</string>
    <string name="title_activity_main">PocketPet</string>
    <string name="package_name">com.pocketpet.widget</string>
    <string name="custom_url_scheme">com.pocketpet.widget</string>
    <!-- Widget Strings -->
    <string name="widget_name">PocketPet Widget</string>
    <string name="widget_description">A cute pet that lives on your home screen</string>
</resources>
`;
        fs.writeFileSync(STRINGS_PATH, newStrings, 'utf8');
        console.log('✅ Created new strings.xml with widget strings');
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

function fixJavaImports() {
    console.log('🔧 Adding R class imports to Java files...');
    
    if (!fs.existsSync(WIDGET_JAVA_PATH)) {
        console.log('⚠️ Widget Java path not found, skipping import fix');
        return;
    }
    
    // The R class package MUST match the applicationId in capacitor.config.ts
    // which is 'com.pocketpet.widget' - NOT from the manifest package attribute
    const APP_ID = 'com.pocketpet.widget';
    const correctImport = `import ${APP_ID}.R;`;
    console.log(`📦 Using App ID for R class: ${APP_ID}`);
    
    const javaFiles = fs.readdirSync(WIDGET_JAVA_PATH).filter(f => f.endsWith('.java'));
    
    for (const file of javaFiles) {
        const filePath = path.join(WIDGET_JAVA_PATH, file);
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;
        
        // First, remove any existing R imports to avoid duplicates
        const existingRImport = content.match(/import com\.[a-zA-Z0-9_.]+\.R;\n?/g);
        if (existingRImport) {
            for (const imp of existingRImport) {
                content = content.replace(imp, '');
                modified = true;
            }
        }
        
        // Now add the correct R import after the last android import
        // Find the last android.* import line
        const importLines = content.match(/import android\.[^;]+;/g);
        if (importLines && importLines.length > 0) {
            const lastAndroidImport = importLines[importLines.length - 1];
            content = content.replace(
                lastAndroidImport,
                `${lastAndroidImport}\n\n${correctImport}`
            );
            modified = true;
        } else {
            // Fallback: add after package declaration
            const packageMatch = content.match(/package [^;]+;/);
            if (packageMatch) {
                content = content.replace(packageMatch[0], `${packageMatch[0]}\n\n${correctImport}`);
                modified = true;
            }
        }
        
        if (modified) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`✅ Added R import to ${file}`);
        }
    }
}

// Run the merges
try {
    // First, clean up any duplicate files from previous runs
    cleanupDuplicateFiles();
    
    mergeManifest();
    mergeStrings();
    fixJavaImports();
    console.log('🎉 Manifest merge complete!');
} catch (error) {
    console.error('❌ Error during merge:', error.message);
    process.exit(1);
}
