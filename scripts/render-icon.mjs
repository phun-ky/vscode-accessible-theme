// Render images/icon.png, the Marketplace icon, from images/icon.svg: 256 by
// 256 pixels, so it stays sharp on high-density screens, with a transparent
// background, turned into a palette PNG to keep it small.
// Needs google-chrome (or CHROME=/path/to/chrome) and Python with Pillow; see
// scripts/lib/render.mjs.
// Usage: node scripts/render-icon.mjs
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { ROOT, render } from './lib/render.mjs';

const SIZE = 256;

render([
  {
    path: join(ROOT, 'images', 'icon.png'),
    html: `<!doctype html><meta charset="utf-8"><style>html,body{margin:0;background:transparent}svg{display:block;width:${SIZE}px;height:${SIZE}px}</style>${readFileSync(join(ROOT, 'images', 'icon.svg'), 'utf8')}`,
    width: SIZE,
    height: SIZE,
    scale: 1,
    transparent: true
  }
]);
