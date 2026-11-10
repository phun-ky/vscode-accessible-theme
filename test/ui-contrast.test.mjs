// Every UI text colour a theme sets must reach WCAG AA for normal text (4.5:1)
// against the background it is drawn on: chrome, status bar items, bracket
// pair colours and terminal ANSI colours. Colours a theme leaves unset fall
// back to VS Code's defaults and are not checked here.

import assert from 'node:assert/strict';
import fs from 'node:fs';
import { describe, test } from 'node:test';

import { SKIPPED, backgroundFor, isTextColour, uiPairs } from './ui-pairs.mjs';
import { blend, contrast } from './wcag.mjs';

const AA = 4.5;
const manifest = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const themes = manifest.contributes.themes.map(({ label, path }) => ({
  label,
  colors: JSON.parse(fs.readFileSync(path, 'utf8')).colors
}));
const toHex = ({ r, g, b }) =>
  `#${[r, g, b]
    .map((c) => Math.round(c).toString(16).padStart(2, '0'))
    .join('')}`;

describe('pairing UI colours with their backgrounds', () => {
  const colors = {
    'editor.background': '#ffffff',
    'tab.activeBackground': '#eeeeee',
    'statusBar.background': '#dddddd',
    'input.background': '#cccccc',
    'sideBar.background': '#bbbbbb',
    'panel.background': '#aaaaaa'
  };

  test('finds the background named after the key, then the component background', () => {
    assert.equal(
      backgroundFor(colors, 'tab.activeForeground'),
      'tab.activeBackground'
    );
    assert.equal(
      backgroundFor(colors, 'statusBar.foreground'),
      'statusBar.background'
    );
    assert.equal(
      backgroundFor(colors, 'input.placeholderForeground'),
      'input.background'
    );
  });

  test('maps keys whose background has another name', () => {
    assert.equal(
      backgroundFor(colors, 'sideBarTitle.foreground'),
      'sideBar.background'
    );
    assert.equal(
      backgroundFor(colors, 'gitDecoration.addedResourceForeground'),
      'sideBar.background'
    );
    assert.equal(
      backgroundFor(colors, 'editorBracketHighlight.foreground3'),
      'editor.background'
    );
    assert.equal(
      backgroundFor(colors, 'terminal.ansiBlack'),
      'panel.background'
    );
  });

  test('returns undefined when there is no background to pair with', () => {
    assert.equal(backgroundFor(colors, 'unknownThing.foreground'), undefined);
  });

  test('counts numbered and terminal colours as text colours', () => {
    for (const key of [
      'tab.activeForeground',
      'statusBar.foreground',
      'editorBracketHighlight.foreground3',
      'editorBracketHighlight.unexpectedBracket.foreground',
      'terminal.ansiBrightWhite'
    ]) {
      assert.ok(isTextColour(key), key);
    }

    for (const key of ['tab.activeBackground', 'editorGroup.border']) {
      assert.ok(!isTextColour(key), key);
    }
  });
});

describe('UI text colours reach WCAG AA on their backgrounds', () => {
  for (const { label, colors } of themes) {
    test(`${label}: every foreground key is checked or listed as skipped`, () => {
      const unpaired = uiPairs(colors)
        .filter(({ bg }) => bg === undefined)
        .map(({ fgKey }) => fgKey);

      assert.deepEqual(
        unpaired,
        [],
        `${label}: no background found for ${unpaired.join(', ')}; map it in test/ui-pairs.mjs or add it to SKIPPED with the reason`
      );
    });

    test(label, () => {
      const editor = colors['editor.background'];
      const pairs = uiPairs(colors).filter(({ bg }) => bg !== undefined);

      assert.ok(pairs.length > 10, `${label} has UI colours to check`);

      // WCAG does not round: 4.499 fails
      const failures = pairs
        .map(({ fgKey, fg, bgKey, bg }) => {
          const opaque = bg.length === 9 ? toHex(blend(bg, editor)) : bg;

          return { fgKey, fg, bgKey, bg: opaque, ratio: contrast(fg, opaque) };
        })
        .filter(({ ratio }) => ratio < AA);

      assert.deepEqual(
        failures.map(({ fgKey }) => fgKey),
        [],
        `${label}: below ${AA}:1:\n${failures
          .map(
            (f) =>
              `  ${f.fgKey} ${f.fg} on ${f.bgKey} ${f.bg}: ${f.ratio.toFixed(2)}:1`
          )
          .join('\n')}`
      );
    });
  }

  test('every skipped key says why', () => {
    for (const [key, reason] of Object.entries(SKIPPED)) {
      assert.ok(reason.length > 0, key);
    }
  });
});
