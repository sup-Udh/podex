const fs = require('fs');
const path = require('path');

const srcDir = 'c:/podex/src';
const stylesDir = path.join(srcDir, 'styles');

if (!fs.existsSync(stylesDir)) {
    fs.mkdirSync(stylesDir);
}

const filesToProcess = [
    { in: 'app/landing.tsx', out: 'landingStyles.ts' },
    { in: 'app/user/dahsboard.tsx', out: 'dashboardStyles.ts' },
    { in: 'app/user/search.tsx', out: 'searchStyles.ts' },
    { in: 'app/user/brain.tsx', out: 'brainStyles.ts' },
    { in: 'app/user/library.tsx', out: 'libraryStyles.ts' },
    { in: 'app/user/profile.tsx', out: 'profileStyles.ts' },
    { in: 'app/user/player.tsx', out: 'playerStyles.ts' },
    { in: 'components/BottomNavbar.tsx', out: 'bottomNavbarStyles.ts' },
    { in: 'components/SwipeNavigator.tsx', out: 'swipeNavigatorStyles.ts' }
];

filesToProcess.forEach(fileInfo => {
    const fullInPath = path.join(srcDir, fileInfo.in);
    if (!fs.existsSync(fullInPath)) {
        console.log(`Skipping ${fullInPath}, does not exist.`);
        return;
    }
    
    let content = fs.readFileSync(fullInPath, 'utf8');
    
    // Find where styles start
    const stylesIndex = content.indexOf('const styles = StyleSheet.create({');
    if (stylesIndex === -1) {
        console.log(`No styles found in ${fullInPath}`);
        return;
    }
    
    let beforeStyles = content.substring(0, stylesIndex);
    let stylesBlock = content.substring(stylesIndex);
    
    // Convert 'const styles =' to 'export const styles ='
    stylesBlock = stylesBlock.replace('const styles = StyleSheet.create({', 'export const styles = StyleSheet.create({');
    
    // Determine imports needed for styles file
    let imports = `import { StyleSheet`;
    if (stylesBlock.includes('Dimensions')) imports += `, Dimensions`;
    if (stylesBlock.includes('Platform')) imports += `, Platform`;
    imports += ` } from 'react-native';\n\n`;
    
    if (stylesBlock.includes('Dimensions.get')) {
        imports += `const { width, height } = Dimensions.get('window');\n\n`;
    }
    
    const newStylesContent = imports + stylesBlock;
    
    const fullOutPath = path.join(stylesDir, fileInfo.out);
    fs.writeFileSync(fullOutPath, newStylesContent, 'utf8');
    
    // Figure out relative path for import
    const depth = fileInfo.in.split('/').length - 1;
    let relativePrefix = '../'.repeat(depth);
    if (relativePrefix === '') relativePrefix = './';
    const importStatement = `import { styles } from "${relativePrefix}styles/${fileInfo.out.replace('.ts', '')}";\n`;
    
    // We need to insert the import statement at the top of the file, typically after the last import.
    // Let's just insert it before the component export or function definition.
    const exportIndex = beforeStyles.indexOf('export default function');
    if (exportIndex !== -1) {
        beforeStyles = beforeStyles.substring(0, exportIndex) + importStatement + '\n' + beforeStyles.substring(exportIndex);
    } else {
        beforeStyles = importStatement + '\n' + beforeStyles;
    }
    
    fs.writeFileSync(fullInPath, beforeStyles.trim() + '\n', 'utf8');
    console.log(`Refactored ${fileInfo.in}`);
});
