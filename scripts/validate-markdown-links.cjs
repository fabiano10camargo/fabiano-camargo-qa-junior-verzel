const fs = require('node:fs');
const path = require('node:path');

const projectRoot = path.resolve(__dirname, '..');
const markdownFiles = [
  path.join(projectRoot, 'README.md'),
  ...findMarkdownFiles(path.join(projectRoot, 'docs')),
];
const missingLinks = [];

function findMarkdownFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      return findMarkdownFiles(entryPath);
    }

    return entry.isFile() && entry.name.endsWith('.md') ? [entryPath] : [];
  });
}

for (const markdownFile of markdownFiles) {
  const content = fs.readFileSync(markdownFile, 'utf8');
  const links = content.matchAll(/!?(?:\[[^\]]*\])\(([^)]+)\)/g);

  for (const match of links) {
    const rawTarget = match[1].trim().replace(/^<|>$/g, '');

    if (/^(?:https?:|mailto:|#)/i.test(rawTarget)) {
      continue;
    }

    const relativeTarget = decodeURIComponent(rawTarget.split('#')[0]);
    const resolvedTarget = path.resolve(path.dirname(markdownFile), relativeTarget);

    if (!fs.existsSync(resolvedTarget)) {
      missingLinks.push(`${path.relative(projectRoot, markdownFile)} -> ${relativeTarget}`);
    }
  }
}

if (missingLinks.length > 0) {
  console.error('Links Markdown com destino inexistente:');
  for (const missingLink of missingLinks) {
    console.error(`- ${missingLink}`);
  }
  process.exitCode = 1;
} else {
  console.log(`${markdownFiles.length} arquivos Markdown validados sem links locais quebrados.`);
}
