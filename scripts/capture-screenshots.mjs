// Capture the README screenshots, public/dark.png and public/light.png, from
// VS Code itself: install the packed .vsix into a throwaway profile, open this
// repository on test/wcag.mjs with each theme, and capture the window at
// 1280 × 800 (2x) through the Chrome DevTools protocol. Each capture becomes a
// palette PNG in which every colour the theme sets that appears on screen is
// kept exactly. Both files are written after both captures, so neither capture
// shows the other as a changed file; run it on a clean working tree.
// Needs VS Code (`code`, or CODE=/path/to/code), Python with Pillow, and a
// display: a VS Code window opens for about 20 seconds per theme.
// Usage: npm run package && node scripts/capture-screenshots.mjs
import { execFileSync, spawn } from 'node:child_process';
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  rmSync,
  writeFileSync
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { setTimeout as wait } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const VSIX = join(ROOT, 'vscode-accessible-theme.vsix');
const CODE = process.env.CODE ?? 'code';
const SHOTS = [
  {
    label: 'Accessible (AA) Dark',
    theme: 'themes/accessible-dark-color-theme.json',
    file: 'public/dark.png'
  },
  {
    label: 'Accessible (AA) Light',
    theme: 'themes/accessible-light-color-theme.json',
    file: 'public/light.png'
  }
];
const SETTINGS = {
  'chat.commandCenter.enabled': false,
  'chat.disableAIFeatures': true,
  'editor.fontFamily': "'DejaVu Sans Mono', monospace",
  'editor.fontSize': 15,
  'editor.lineHeight': 22,
  'editor.minimap.enabled': false,
  'extensions.autoCheckUpdates': false,
  'security.workspace.trust.enabled': false,
  'telemetry.telemetryLevel': 'off',
  'update.mode': 'none',
  'window.commandCenter': true,
  'window.restoreWindows': 'none',
  'window.titleBarStyle': 'custom',
  'workbench.editor.empty.hint': 'hidden',
  'workbench.layoutControl.enabled': false,
  'workbench.secondarySideBar.defaultVisibility': 'hidden',
  'workbench.startupEditor': 'none',
  'workbench.tips.enabled': false
};

if (!existsSync(VSIX)) {
  console.error('No vscode-accessible-theme.vsix: run npm run package first');
  process.exit(1);
}

/** Send DevTools protocol commands over a page's WebSocket. */
const connect = async (url) => {
  const ws = new WebSocket(url);

  await new Promise((resolve) =>
    ws.addEventListener('open', resolve, { once: true })
  );

  let id = 0;

  const send = (method, params = {}) =>
    new Promise((resolve) => {
      const mine = ++id;
      const onMessage = (event) => {
        const message = JSON.parse(event.data);

        if (message.id !== mine) return;

        ws.removeEventListener('message', onMessage);
        resolve(message.result);
      };

      ws.addEventListener('message', onMessage);
      ws.send(JSON.stringify({ id: mine, method, params }));
    });

  return { send, close: () => ws.close() };
};
/** The workbench page of the VS Code instance listening on `port`. */
const workbench = async (port) => {
  for (let attempt = 0; attempt < 60; attempt++) {
    await wait(1000);

    try {
      const pages = await (
        await fetch(`http://127.0.0.1:${port}/json/list`)
      ).json();
      const page = pages.find(
        ({ type, url }) => type === 'page' && url.includes('workbench')
      );

      if (page) return page;
    } catch {
      // VS Code isn't listening yet
    }
  }

  throw new Error(`VS Code opened no workbench on port ${port}`);
};
const results = [];

for (const [index, shot] of SHOTS.entries()) {
  const work = mkdtempSync(join(tmpdir(), 'vscode-accessible-theme-shot-'));
  const userDir = join(work, 'user');
  const port = 9333 + index;
  const profile = [
    `--user-data-dir=${userDir}`,
    `--extensions-dir=${join(work, 'extensions')}`
  ];

  execFileSync(CODE, [...profile, '--install-extension', VSIX], {
    stdio: 'ignore'
  });
  mkdirSync(join(userDir, 'User'), { recursive: true });
  writeFileSync(
    join(userDir, 'User', 'settings.json'),
    JSON.stringify({ ...SETTINGS, 'workbench.colorTheme': shot.label })
  );

  const raw = join(work, 'raw.png');
  const child = spawn(
    CODE,
    [
      ...profile,
      '--new-window',
      '--disable-workspace-trust',
      '--skip-welcome',
      '--skip-release-notes',
      `--remote-debugging-port=${port}`,
      ROOT,
      join(ROOT, 'test', 'wcag.mjs')
    ],
    { stdio: 'ignore', detached: true }
  );

  try {
    const page = await workbench(port);

    // Let the editor tokenise and the explorer settle
    await wait(9000);

    const devtools = await connect(page.webSocketDebuggerUrl);

    await devtools.send('Emulation.setDeviceMetricsOverride', {
      width: 1280,
      height: 800,
      deviceScaleFactor: 2,
      mobile: false
    });
    await wait(3000);

    const { data } = await devtools.send('Page.captureScreenshot', {
      format: 'png'
    });

    writeFileSync(raw, Buffer.from(data, 'base64'));
    devtools.close();
  } finally {
    try {
      process.kill(-child.pid);
    } catch {
      // Already gone
    }

    // The snap wrapper detaches VS Code, so close this profile's processes by
    // the profile path, which no other VS Code uses
    try {
      execFileSync('pkill', ['-9', '-f', '--', `--user-data-dir=${userDir}`]);
    } catch {
      // Nothing left to close
    }
  }

  // Pin the theme's own colours in the palette, fill the rest with median cut,
  // and map each pixel to its nearest palette colour exactly
  execFileSync(
    'python3',
    [
      '-I',
      '-c',
      `import sys, json
from PIL import Image
raw_path, theme_path, out_path = sys.argv[1:4]
theme = json.load(open(theme_path))
hx = lambda c: '#%02X%02X%02X' % c
rgb = lambda h: tuple(int(h[i:i + 2], 16) for i in (1, 3, 5))
raw = Image.open(raw_path).convert('RGB')
counts = raw.getcolors(1 << 24)
present = {hx(c) for _, c in counts}
values = list(theme['colors'].values()) + [r.get('settings', {}).get('foreground') for r in theme['tokenColors']]
pinned = sorted({v.upper() for v in values if v and len(v) == 7} & present)
palette = [rgb(p) for p in pinned]
rest = raw.quantize(256 - len(pinned), method=Image.Quantize.MEDIANCUT, dither=Image.Dither.NONE).convert('RGB')
for _, c in sorted(rest.getcolors(1 << 16), reverse=True):
    if c not in palette and len(palette) < 256:
        palette.append(c)
nearest = lambda c: min(range(len(palette)), key=lambda i: sum((palette[i][k] - c[k]) ** 2 for k in range(3)))
lookup = {c: nearest(c) for _, c in counts}
out = Image.new('P', raw.size)
out.putpalette([v for c in palette for v in c] + [0] * (768 - 3 * len(palette)))
out.putdata([lookup[c] for c in raw.get_flattened_data()])
out.save(out_path, optimize=True)
kept = {hx(c) for _, c in out.convert('RGB').getcolors(1 << 16)}
lost = [p for p in pinned if p not in kept]
assert not lost, lost
print(theme_path.split('/')[-1], 'keeps', len(pinned), 'theme colours exactly')`,
      raw,
      join(ROOT, shot.theme),
      join(work, 'out.png')
    ],
    { stdio: 'inherit' }
  );
  results.push({ work, file: shot.file });
}

for (const { work, file } of results) {
  copyFileSync(join(work, 'out.png'), join(ROOT, file));
  rmSync(work, { recursive: true, force: true });
  console.log(`wrote ${file}`);
}
