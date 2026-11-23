// Renders the release banners for a major release into public/images, in the
// themes' own colours: the page in Accessible (AA) Dark, with an editor in
// each theme showing the same code. Four formats (banner, og, square and
// portrait), each at 1x and 2x, as palette PNGs.
//
// Usage: npm run banners -- <release>, e.g. 1.0
// The content is in scripts/banners/<release>.mjs. Every colour is read from
// themes/*.json, and each editor's lowest contrast is measured with
// test/wcag.mjs. Rendering uses system fonts, so nothing is downloaded; see
// scripts/lib/render.mjs for what it needs.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

import { contrast } from '../../test/wcag.mjs';
import { ROOT, render } from '../lib/render.mjs';

const OUT = join(ROOT, 'public', 'images');
const FORMATS = [
  { suffix: '', width: 1200, height: 600, layout: 'wide' },
  { suffix: '-og', width: 1200, height: 630, layout: 'wide' },
  { suffix: '-square', width: 1080, height: 1080, layout: 'tall' },
  { suffix: '-portrait', width: 1080, height: 1350, layout: 'tall' }
];
const SCALES = [1, 2];
// The README's recommended editor fonts, then the system's
const MONO =
  "Menlo, Consolas, 'DejaVu Sans Mono', 'Droid Sans Mono', monospace";
const SANS =
  "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', 'Ubuntu Sans', 'Noto Sans', sans-serif";
const release = process.argv[2];

if (!release) {
  console.error('Usage: npm run banners -- <release>, e.g. 1.0');
  process.exit(1);
}

const { default: content } = await import(
  pathToFileURL(join(ROOT, 'scripts', 'banners', `${release}.mjs`)).href
);
const manifest = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
const themes = manifest.contributes.themes.map(({ label, path }) => ({
  label,
  ...JSON.parse(readFileSync(join(ROOT, path), 'utf8'))
}));
const [dark] = themes;
const escape = (text) =>
  String(text)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
/**
 * The colour and font style of the last rule naming `scope`, as VS Code
 * applies them, or editor.foreground without one.
 */
const style = (theme, scope) => ({
  foreground: theme.colors['editor.foreground'],
  fontStyle: '',
  ...theme.tokenColors.findLast((rule) => [].concat(rule.scope).includes(scope))
    ?.settings
});
/** An editor in `theme`: a tab, the code, and the lowest contrast in it. */
const editor = (theme) => {
  const c = theme.colors;
  const background = c['editor.background'];
  const ratios = [];
  const lines = content.code
    .map((line, index) => {
      const spans = line
        .map(([scope, text]) => {
          const { foreground, fontStyle } = style(theme, scope);

          ratios.push(contrast(foreground, background));

          return `<span style="color:${foreground}${fontStyle.includes('italic') ? ';font-style:italic' : ''}">${escape(text)}</span>`;
        })
        .join('');

      return `<div class="line"><i>${index + 1}</i><code>${spans}</code></div>`;
    })
    .join('');
  // Rounded down, as in the README
  const lowest = Math.floor(Math.min(...ratios) * 100) / 100;

  return `<section class="editor" style="--bg:${background};--tabs:${c['editorGroupHeader.tabsBackground']};
    --tab:${c['tab.activeBackground']};--tab-text:${c['tab.activeForeground']};--tab-top:${c['tab.activeBorderTop']};
    --dim:${c['tab.inactiveForeground']};--border:${c['editorGroup.border']};
    --bar:${c['statusBar.background']};--bar-text:${c['statusBar.foreground']};
    --badge:${c['badge.background']};--badge-text:${c['badge.foreground']}">
    <header><span class="tab">${escape(content.file)}</span><span class="label">${escape(theme.label)}</span></header>
    <div class="code">${lines}</div>
    <footer><span>Lowest contrast</span><em>${lowest.toFixed(2)}:1</em><b>${lowest >= 4.5 ? 'AA' : 'Fails AA'}</b></footer>
  </section>`;
};
const title = content.title
  .map((part) =>
    typeof part === 'string'
      ? escape(part)
      : `<span class="accent">${escape(part.accent)}</span>`
  )
  .join('<br>');
const mark = readFileSync(join(ROOT, 'images', 'icon.svg'), 'utf8').replace(
  '<svg ',
  '<svg class="mark" '
);
const editors = themes.map(editor).join('');
const page = (layout, format) => `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><style>
:root { --page: ${dark.colors['editor.background']}; --text: ${dark.colors['editor.foreground']};
  --muted: ${style(dark, 'comment').foreground}; --accent: ${dark.colors.focusBorder};
  --line: ${dark.colors['editorGroup.border']}; }
* { box-sizing: border-box; margin: 0; }
html, body { width: 100%; height: 100%; }
body { position: relative; overflow: hidden; color: var(--text); font-family: ${SANS}; background: var(--page); }
.pill { position: absolute; display: inline-flex; align-items: center; gap: 14px;
  padding: 10px 22px 10px 12px; border: 1px solid var(--line); border-radius: 999px;
  font: 400 18px ${MONO}; letter-spacing: 0.02em; color: var(--muted); }
.pill .mark { width: 32px; height: 32px; }
h1 { position: absolute; font-weight: 700; line-height: 1.05; letter-spacing: -0.03em; }
.accent { color: var(--accent); }
p { position: absolute; color: var(--muted); line-height: 1.5; }
.editor { position: absolute; overflow: hidden; border: 1px solid var(--border); border-radius: 12px;
  background: var(--bg); box-shadow: 0 12px 28px rgb(0 0 0 / 30%); font-family: ${MONO}; }
.editor header { display: flex; align-items: center; justify-content: space-between;
  padding-right: 18px; background: var(--tabs); font-size: 15px; }
.tab { padding: 12px 20px; border-top: 2px solid var(--tab-top); background: var(--tab); color: var(--tab-text); }
.label { color: var(--dim); font-family: ${SANS}; }
.code { padding: 14px 0; font-size: 17px; line-height: 30px; }
.line { display: flex; white-space: pre; }
.line i { width: 52px; padding-right: 18px; text-align: right; font-style: normal; color: var(--dim); }
.editor footer { display: flex; align-items: center; gap: 12px; padding: 8px 18px;
  background: var(--bar); color: var(--bar-text); font: 14px ${SANS}; }
.editor footer em { font: 14px ${MONO}; }
.editor footer b { margin-left: auto; padding: 2px 10px; border-radius: 6px;
  background: var(--badge); color: var(--badge-text); font-weight: 600; }
/* wide: text left, the editors right, overlapping */
.wide .pill { top: 64px; left: 72px; }
.wide h1 { top: 172px; left: 72px; width: 580px; font-size: 58px; }
.wide p { bottom: 64px; left: 72px; width: 540px; font-size: 20px; }
.wide .editor { width: 440px; }
.wide .editor:first-of-type { top: 64px; right: 120px; }
.wide .editor:last-of-type { bottom: 64px; right: 64px; }
/* tall: text on top, the editors below. Zoom also scales an
   editor's offsets, so they are in zoomed pixels */
.tall .pill { top: 80px; left: 80px; font-size: 22px; }
.tall .pill .mark { width: 40px; height: 40px; }
.tall h1 { top: 196px; left: 80px; width: 920px; font-size: 88px; }
.tall p { top: 420px; left: 80px; width: 900px; font-size: 27px; }
.tall .editor { width: 600px; }
.tall .editor:first-of-type { top: 596px; left: 80px; }
.tall .editor:last-of-type { bottom: 72px; right: 80px; }
.portrait .tall .editor { width: 640px; zoom: 1.4; }
.portrait .tall .editor:first-of-type { top: 436px; left: 57px; }
.portrait .tall .editor:last-of-type { bottom: 57px; right: 57px; }
</style></head>
<body class="${format}"><main class="${layout}">
  <div class="pill">${mark}${escape(content.pill)}</div>
  <h1>${title}</h1>
  <p>${escape(content.body)}</p>
  ${editors}
</main></body></html>`;

render(
  FORMATS.flatMap(({ suffix, width, height, layout }) =>
    SCALES.map((scale) => ({
      path: join(
        OUT,
        `vscode-accessible-theme-${content.slug}${suffix}${scale === 2 ? '@2x' : ''}.png`
      ),
      html: page(layout, suffix.slice(1)),
      width,
      height,
      scale
    }))
  )
);
