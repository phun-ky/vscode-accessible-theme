// Shared by the icon and banner scripts: screenshots HTML pages in headless
// Chrome and turns the PNGs into palette images.
// Needs google-chrome (or CHROME=/path/to/chrome) and Python with Pillow.
import { execFileSync } from 'node:child_process';
import {
  mkdirSync,
  mkdtempSync,
  rmSync,
  statSync,
  writeFileSync
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const ROOT = fileURLToPath(new URL('../..', import.meta.url));

/**
 * Screenshots each page and writes it as a palette PNG.
 * @param {Array<{ path: string, html: string, width: number, height: number,
 *   scale: number, transparent?: boolean }>} outputs - `path` is absolute.
 */
export const render = (outputs) => {
  const work = mkdtempSync(join(tmpdir(), 'vscode-accessible-theme-render-'));

  try {
    for (const [index, output] of outputs.entries()) {
      const page = join(work, `${index}.html`);

      writeFileSync(page, output.html);
      mkdirSync(dirname(output.path), { recursive: true });
      execFileSync(
        process.env.CHROME ?? 'google-chrome',
        [
          '--headless=new',
          '--disable-gpu',
          '--hide-scrollbars',
          `--force-device-scale-factor=${output.scale}`,
          ...(output.transparent
            ? ['--default-background-color=00000000']
            : []),
          `--window-size=${output.width},${output.height}`,
          `--user-data-dir=${join(work, 'profile')}`,
          `--screenshot=${output.path}`,
          pathToFileURL(page).href
        ],
        { stdio: 'ignore' }
      );
    }
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
for path, width, height in zip(*[iter(sys.argv[1:])] * 3):
    image = Image.open(path).convert('RGBA')
    assert image.size == (int(width), int(height)), (path, image.size)
    image.quantize(256, method=Image.Quantize.FASTOCTREE).save(path, optimize=True)`,
      ...outputs.flatMap(({ path, width, height, scale }) => [
        path,
        width * scale,
        height * scale
      ])
    ],
    { stdio: 'inherit' }
  );

  for (const { path } of outputs) {
    console.log(`${relative(ROOT, path)}: ${statSync(path).size} bytes`);
  }
};
