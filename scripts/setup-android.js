/**
 * Android Setup Script
 * 
 * This script copies native widget files to the Android project
 * and updates necessary configurations.
 */

const fs = require('fs');
const path = require('path');

const ANDROID_PATH = path.join(__dirname, '../android');
const WIDGET_NATIVE_PATH = path.join(__dirname, '../widget-native');

// Directories to create and copy
const COPY_OPERATIONS = [
    {
        src: 'java',
        dest: 'app/src/main/java/com/pocketpet/widget',
        type: 'dir'
    },
    {
        src: 'res/layout/widget_layout.xml',
        dest: 'app/src/main/res/layout/widget_layout.xml',
        type: 'file'
    },
    {
        src: 'res/xml/widget_info.xml',
        dest: 'app/src/main/res/xml/widget_info.xml',
        type: 'file'
    },
    {
        src: 'res/drawable',
        dest: 'app/src/main/res/drawable',
        type: 'merge' // Merge with existing drawable folder
    },
    {
        src: 'res/values/strings.xml',
        dest: 'app/src/main/res/values/widget_strings.xml',
        type: 'file'
    }
];

function copyFileSync(src, dest) {
    const destDir = path.dirname(dest);
    if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
    }
    fs.copyFileSync(src, dest);
}

function copyDirSync(src, dest) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }
    
    const entries = fs.readdirSync(src, { withFileTypes: true });
    
    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        
        if (entry.isDirectory()) {
            copyDirSync(srcPath, destPath);
        } else {
            copyFileSync(srcPath, destPath);
        }
    }
}

function setupAndroid() {
    console.log('🚀 Setting up Android native widget files...\n');
    
    if (!fs.existsSync(ANDROID_PATH)) {
        console.error('❌ Android directory not found. Run "npx cap add android" first.');
        process.exit(1);
    }
    
    for (const op of COPY_OPERATIONS) {
        const srcPath = path.join(WIDGET_NATIVE_PATH, op.src);
        const destPath = path.join(ANDROID_PATH, op.dest);
        
        console.log(`📁 Copying: ${op.src} -> ${op.dest}`);
        
        if (!fs.existsSync(srcPath)) {
            console.warn(`   ⚠️  Source not found: ${srcPath}`);
            continue;
        }
        
        try {
            if (op.type === 'file') {
                copyFileSync(srcPath, destPath);
            } else {
                copyDirSync(srcPath, destPath);
            }
            console.log(`   ✅ Done`);
        } catch (error) {
            console.error(`   ❌ Error: ${error.message}`);
        }
    }
    
    console.log('\n✅ Android setup complete!');
    console.log('\nNext steps:');
    console.log('1. Run: node scripts/merge-manifest.js');
    console.log('2. Run: npx cap sync android');
    console.log('3. Open in Android Studio: npx cap open android');
}

setupAndroid();
