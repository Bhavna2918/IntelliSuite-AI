const fs = require('fs');
const path = require('path');
const lucide = require('lucide-react');

// Get all valid lucide-react exports
const lucideIcons = Object.keys(lucide).filter(k => /^[A-Z]/.test(k));
const lucideSet = new Set(lucideIcons);

function walkSync(dir, filelist = []) {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    if (fs.statSync(dirFile).isDirectory()) {
      if (!dirFile.includes('node_modules') && !dirFile.includes('.git')) {
        filelist = walkSync(dirFile, filelist);
      }
    } else {
      if (dirFile.endsWith('.jsx')) {
        filelist.push(dirFile);
      }
    }
  });
  return filelist;
}

const files = walkSync(path.join(__dirname, 'src'));
let updatedCount = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let missingLucideIcons = [];
  
  // Find all capitalized words used as components or icons
  const words = content.match(/[A-Z][a-zA-Z0-9]*/g) || [];
  const uniqueWords = [...new Set(words)];
  
  uniqueWords.forEach(word => {
    if (lucideSet.has(word)) {
      // Check if it's already imported
      const importRegex = new RegExp(`import\\s+.*?\\b${word}\\b.*?\\s+from`);
      const declaredRegex = new RegExp(`(const|let|var|function|class)\\s+${word}\\b`);
      
      if (!importRegex.test(content) && !declaredRegex.test(content)) {
        missingLucideIcons.push(word);
      }
    }
  });
  
  if (missingLucideIcons.length > 0) {
    const pkg = 'lucide-react';
    const importRegex = new RegExp(`import\\s+{([^}]+)}\\s+from\\s+['"]${pkg}['"]`);
    const match = content.match(importRegex);
    
    if (match) {
      const existingVars = match[1].split(',').map(s => s.trim());
      const newVars = missingLucideIcons.filter(v => !existingVars.includes(v));
      if (newVars.length > 0) {
        const newImport = `import { ${existingVars.concat(newVars).join(', ')} } from '${pkg}';`;
        content = content.replace(match[0], newImport);
      }
    } else {
      content = `import { ${missingLucideIcons.join(', ')} } from '${pkg}';\n` + content;
    }
    
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${path.basename(file)} with missing lucide icons: ${missingLucideIcons.join(', ')}`);
    updatedCount++;
  }
});

console.log(`Done. Updated ${updatedCount} files.`);
