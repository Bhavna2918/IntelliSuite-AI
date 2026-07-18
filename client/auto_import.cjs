const fs = require('fs');
const path = require('path');
const { ESLint } = require('eslint');

const KNOWN_IMPORTS = {
  // framer-motion
  motion: 'framer-motion',
  AnimatePresence: 'framer-motion',
  // react-router-dom
  Link: 'react-router-dom',
  NavLink: 'react-router-dom',
  useNavigate: 'react-router-dom',
  Outlet: 'react-router-dom',
  // lucide-react
  MessageSquare: 'lucide-react',
  User: 'lucide-react',
  Bot: 'lucide-react',
  Send: 'lucide-react',
  Sparkles: 'lucide-react',
  Image: 'lucide-react',
  PenTool: 'lucide-react',
  Hash: 'lucide-react',
  Eraser: 'lucide-react',
  Scissors: 'lucide-react',
  FileText: 'lucide-react',
  Users: 'lucide-react',
  House: 'lucide-react',
  Code: 'lucide-react',
  Search: 'lucide-react',
  LogOut: 'lucide-react',
  Activity: 'lucide-react',
  Zap: 'lucide-react',
  TrendingUp: 'lucide-react',
  TrendingDown: 'lucide-react',
  CheckCircle2: 'lucide-react',
  Lightbulb: 'lucide-react',
  ChevronDown: 'lucide-react',
  Menu: 'lucide-react',
  X: 'lucide-react',
  Brain: 'lucide-react',
  Mic: 'lucide-react',
  Moon: 'lucide-react',
  Sun: 'lucide-react',
  Settings: 'lucide-react',
  Bell: 'lucide-react',
  Sparkle: 'lucide-react',
  Battery: 'lucide-react',
  SearchCode: 'lucide-react',
  ArrowRight: 'lucide-react',
  Github: 'lucide-react',
  Linkedin: 'lucide-react',
  Twitter: 'lucide-react',
  Loader2: 'lucide-react',
  UploadCloud: 'lucide-react',
  Save: 'lucide-react',
  Trash2: 'lucide-react',
  Edit: 'lucide-react',
  Check: 'lucide-react',
  XCircle: 'lucide-react',
  AlertCircle: 'lucide-react',
  Info: 'lucide-react',
  Play: 'lucide-react',
  Pause: 'lucide-react',
  SquarePen: 'lucide-react',
  // recharts
  ResponsiveContainer: 'recharts',
  LineChart: 'recharts',
  Line: 'recharts',
  AreaChart: 'recharts',
  XAxis: 'recharts',
  YAxis: 'recharts',
  CartesianGrid: 'recharts',
  Tooltip: 'recharts',
  Area: 'recharts',
  PieChart: 'recharts',
  Pie: 'recharts',
  Cell: 'recharts',
  // others
  Markdown: 'react-markdown',
  SyntaxHighlighter: 'react-syntax-highlighter',
  axios: 'axios',
  toast: 'react-hot-toast',
};

(async function main() {
  const eslint = new ESLint({
    overrideConfig: {
      languageOptions: {
        globals: {
          console: "readonly",
          window: "readonly",
          document: "readonly",
          setTimeout: "readonly",
          clearTimeout: "readonly",
          Promise: "readonly",
          require: "readonly",
          module: "readonly",
          process: "readonly"
        }
      },
      rules: {
        'no-undef': 'error'
      }
    }
  });

  const results = await eslint.lintFiles(['src/**/*.jsx']);
  let updatedFiles = new Set();

  for (const result of results) {
    if (result.errorCount > 0) {
      const undefErrors = result.messages.filter(m => m.ruleId === 'no-undef');
      const missingVars = [...new Set(undefErrors.map(e => {
        const match = e.message.match(/'([^']+)'/);
        return match ? match[1] : null;
      }).filter(Boolean))];
      
      let importsToAdd = {};
      
      for (const v of missingVars) {
        if (KNOWN_IMPORTS[v]) {
          const pkg = KNOWN_IMPORTS[v];
          if (!importsToAdd[pkg]) importsToAdd[pkg] = [];
          importsToAdd[pkg].push(v);
        } else {
          // If it's a capitalized word not in our list, it might be a lucide-react icon
          if (/^[A-Z][a-zA-Z0-9]*$/.test(v) && !['React', 'Layout', 'Sidebar', 'App', 'Navbar', 'Footer', 'Hero', 'AiTools', 'Plan'].includes(v) && !v.endsWith('Context') && !v.endsWith('Provider')) {
            console.log(`Guessing ${v} is from lucide-react in ${result.filePath}`);
            const pkg = 'lucide-react';
            if (!importsToAdd[pkg]) importsToAdd[pkg] = [];
            importsToAdd[pkg].push(v);
          }
        }
      }
      
      if (Object.keys(importsToAdd).length > 0) {
        let content = fs.readFileSync(result.filePath, 'utf8');
        
        for (const [pkg, vars] of Object.entries(importsToAdd)) {
          // check if pkg already imported
          const importRegex = new RegExp(`import\\s+{([^}]+)}\\s+from\\s+['"]${pkg}['"]`);
          const match = content.match(importRegex);
          if (match) {
            // Append to existing
            const existingVars = match[1].split(',').map(s => s.trim());
            const newVars = vars.filter(v => !existingVars.includes(v));
            if (newVars.length > 0) {
              const newImport = `import { ${existingVars.concat(newVars).join(', ')} } from '${pkg}';`;
              content = content.replace(match[0], newImport);
            }
          } else {
            // Check default import for axios etc
            if (pkg === 'axios') {
                content = `import axios from '${pkg}';\n` + content;
            } else if (pkg === 'react-hot-toast') {
                content = `import toast from '${pkg}';\n` + content;
            } else {
                content = `import { ${vars.join(', ')} } from '${pkg}';\n` + content;
            }
          }
        }
        
        fs.writeFileSync(result.filePath, content, 'utf8');
        console.log(`Fixed missing imports in ${result.filePath}`);
        updatedFiles.add(result.filePath);
      }
    }
  }
  console.log(`Done. Updated ${updatedFiles.size} files.`);
})().catch(err => {
  console.error(err);
});
