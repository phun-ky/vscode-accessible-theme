// Render images/icon.png, the Marketplace icon, from images/icon.svg: 256 by
// 256 pixels, so it stays sharp on high-density screens, with a transparent
// background, turned into a palette PNG to keep it small.
// Needs google-chrome (or CHROME=/path/to/chrome) and Python with Pillow.
// Usage: node scripts/render-icon.mjs
import { execFileSync } from 'node:child_process';
import {
  mkdtempSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const SOURCE = join(ROOT, 'images', 'icon.svg');
const OUTPUT = join(ROOT, 'images', 'icon.png');
const SIZE = 256;
const work = mkdtempSync(join(tmpdir(), 'vscode-accessible-theme-icon-'));

try {
  const page = join(work, 'icon.html');

  writeFileSync(
    page,
    `<!doctype html><meta charset="utf-8"><style>html,body{margin:0;background:transparent}svg{display:block;width:${SIZE}px;height:${SIZE}px}</style>${readFileSync(SOURCE, 'utf8')}`
  );
  execFileSync(
    process.env.CHROME ?? 'google-chrome',
    [
      '--headless=new',
      '--disable-gpu',
      '--hide-scrollbars',
      '--force-device-scale-factor=1',
      '--default-background-color=00000000',
      `--window-size=${SIZE},${SIZE}`,
      `--user-data-dir=${join(work, 'profile')}`,
      `--screenshot=${OUTPUT}`,
      pathToFileURL(page).href
    ],
    { stdio: 'ignore' }
  );
} finally {
  rmSync(work, { recursive: true, force: true });
}

// A palette of up to 256 colours keeps flat artwork sharp and small
execFileSync(
  'python3',
  [
    '-I',
    '-c',
    `import sys
from PIL import Image
image = Image.open(sys.argv[1]).convert('RGBA')
assert image.size == (${SIZE}, ${SIZE}), image.size
image.quantize(256, method=Image.Quantize.FASTOCTREE).save(sys.argv[1], optimize=True)`,
    OUTPUT
  ],
  { stdio: 'inherit' }
);

console.log(`images/icon.png: ${statSync(OUTPUT).size} bytes`);
