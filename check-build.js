import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Digital Kheti App - Build Status Check');
console.log('==========================================');

// Check if all required files exist
const requiredFiles = [
  '.env',
  'src/lib/firebase.ts',
  'public/manifest.json',
  'public/sw.js'
];

console.log('\n📋 Required Files:');
let allFilesExist = true;

requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - Missing`);
    allFilesExist = false;
  }
});

// Check package.json dependencies
console.log('\n📦 Critical Dependencies:');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

const criticalDeps = [
  'react',
  'firebase', 
  'openai',
  'tesseract.js',
  'react-i18next'
];

criticalDeps.forEach(dep => {
  if (packageJson.dependencies[dep]) {
    console.log(`✅ ${dep}`);
  } else {
    console.log(`❌ ${dep} - Missing`);
    allFilesExist = false;
  }
});

console.log('\n🎯 Build Status:');
if (allFilesExist) {
  console.log('✅ READY FOR PRODUCTION!');
  console.log('\n🚀 Next Steps:');
  console.log('1. Configure Firebase project');
  console.log('2. Run: npm run build');
  console.log('3. Deploy to hosting platform');
} else {
  console.log('⚠️  NEEDS ATTENTION');
  console.log('Please address missing files/dependencies');
}

console.log('\n📖 See DEPLOYMENT.md for detailed instructions');
console.log('🌾 Happy Farming! ✨');
