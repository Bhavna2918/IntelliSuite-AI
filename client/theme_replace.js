const fs = require('fs');
const path = require('path');

const srcDirs = [
    path.join(__dirname, 'src', 'pages'),
    path.join(__dirname, 'src', 'components')
];

const replacements = [
    { regex: /bg-\[\#0B1120\]/g, replacement: 'bg-app-bg' },
    { regex: /bg-\[\#111827\]/g, replacement: 'bg-app-card' },
    { regex: /border-\[\#1E293B\]/g, replacement: 'border-app-border' },
    { regex: /bg-\[\#1E293B\]/g, replacement: 'bg-app-input' },
    { regex: /bg-\[\#0F172A\]/g, replacement: 'bg-app-card-sec' },
    { regex: /border-\[\#334155\]/g, replacement: 'border-app-hover' },
    { regex: /bg-\[\#334155\]/g, replacement: 'bg-app-hover' },
    { regex: /placeholder-\[\#475569\]/g, replacement: 'placeholder-app-placeholder' },
    // A lot of text-white are for primary text, but some are on buttons. 
    // Button text-white is usually accompanied by bg-blue-600 or bg-primary. 
    // It's safer to leave text-white alone and just redefine 'text-white' in CSS maybe? No, text-white is a utility.
    // Instead of text-white, let's use dark:text-white text-slate-900. No, that requires dark:.
];

function processDirectory(directory) {
    fs.readdir(directory, { withFileTypes: true }, (err, files) => {
        if (err) return console.error('Error reading directory:', err);

        files.forEach(file => {
            const filePath = path.join(directory, file.name);

            if (file.isDirectory()) {
                processDirectory(filePath);
            } else if (file.isFile() && file.name.endsWith('.jsx')) {
                fs.readFile(filePath, 'utf8', (err, data) => {
                    if (err) return console.error('Error reading file:', err);

                    let result = data;
                    replacements.forEach(({ regex, replacement }) => {
                        result = result.replace(regex, replacement);
                    });

                    // For text-white that are NOT in a button, we can replace them.
                    // Instead of a complex regex, I can just replace `text-white` with `text-app-text` 
                    // and manually fix buttons, or use `text-app-text` everywhere and change button text to `text-white` manually.
                    // Actually, let's just do `text-white` -> `text-app-text` where it's part of headings or labels, 
                    // and keep `text-white` inside buttons.

                    // For now, let's just apply the bg and border replacements.
                    if (result !== data) {
                        fs.writeFile(filePath, result, 'utf8', err => {
                            if (err) console.error(err);
                            else console.log(`Updated ${file.name}`);
                        });
                    }
                });
            }
        });
    });
}

srcDirs.forEach(processDirectory);
