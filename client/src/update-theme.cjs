const fs = require('fs');
const path = require('path');

const files = [
  'Hero.jsx',
  'AiTools.jsx',
  'Footer.jsx',
  'Navbar.jsx'
];

files.forEach(file => {
  const filePath = path.join(__dirname, 'components', file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace background
    content = content.replace(/bg-slate-50 dark:bg-\[#0A0A0A\]/g, 'bg-[#0B1120]');
    content = content.replace(/bg-white\/80 dark:bg-\[#0A0A0A\]\/90/g, 'bg-[#0B1120]/80');
    
    // Replace text colors
    content = content.replace(/text-slate-900 dark:text-white/g, 'text-white');
    content = content.replace(/text-slate-500 dark:text-slate-400/g, 'text-slate-400');
    
    // Replace borders and other specific white backgrounds
    content = content.replace(/bg-white dark:bg-white\/5/g, 'bg-white/5');
    content = content.replace(/border-slate-200 dark:border-white\/10/g, 'border-white/10');
    content = content.replace(/border-slate-300 dark:border-white\/20/g, 'border-white/20');
    content = content.replace(/hover:bg-slate-200\/50 dark:hover:bg-white\/5/g, 'hover:bg-white/5');
    content = content.replace(/bg-slate-200\/50 dark:bg-white\/5/g, 'bg-white/5');
    content = content.replace(/text-slate-600 dark:text-slate-400/g, 'text-slate-400');
    content = content.replace(/shadow-sm dark:shadow-none/g, '');
    
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${file}`);
  }
});
