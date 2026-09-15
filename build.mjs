import { build } from 'esbuild';
import { mkdirSync, cpSync, existsSync, rmSync } from 'fs';

const outDir = 'dist';
if (existsSync(outDir)) rmSync(outDir, { recursive: true });
mkdirSync(outDir, { recursive: true });
mkdirSync(`${outDir}/assets/favicon`, { recursive: true });
mkdirSync(`${outDir}/logos`, { recursive: true });
mkdirSync(`${outDir}/bio-coder/assets`, { recursive: true });

await build({
  entryPoints: ['direction-lumen.jsx'],
  outfile: `${outDir}/bundle.js`,
  minify: true,
  target: ['es2018'],
  jsx: 'transform',
  legalComments: 'none',
});

await build({
  entryPoints: ['direction-biocoder.jsx'],
  outfile: `${outDir}/bio-coder/bundle.js`,
  minify: true,
  target: ['es2018'],
  jsx: 'transform',
  legalComments: 'none',
});

cpSync('index.html', `${outDir}/index.html`);
cpSync('robots.txt', `${outDir}/robots.txt`);
cpSync('sitemap.xml', `${outDir}/sitemap.xml`);
cpSync('bio-coder-prod.html', `${outDir}/bio-coder/index.html`);

cpSync('assets/TGB-logo-trimmed.png', `${outDir}/assets/TGB-logo-trimmed.png`);
cpSync('assets/favicon', `${outDir}/assets/favicon`, { recursive: true });

for (const f of ['celemics.png', 'gen2me.png', 'centogene-clean.png', 'medgenome.png', 'gentlegen.svg']) {
  cpSync(`logos/${f}`, `${outDir}/logos/${f}`);
}

for (const f of ['TGB-logo-trimmed.png', 'signature.png']) {
  cpSync(`assets/${f}`, `${outDir}/bio-coder/assets/${f}`);
}

console.log('Build complete → dist/');
