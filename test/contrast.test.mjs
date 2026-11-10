// Every syntax colour in every contributed theme must reach WCAG AA for normal
// text (4.5:1) against the editor background, as the README promises.

import assert from 'node:assert/strict';
import fs from 'node:fs';
import { describe, test } from 'node:test';

import { textColours } from './syntax-colours.mjs';
import { contrast } from './wcag.mjs';

const AA = 4.5;
const manifest = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const themes = manifest.contributes.themes.map(({ label, path }) => ({
  label,
  theme: JSON.parse(fs.readFileSync(path, 'utf8'))
}));

describe('syntax colours reach WCAG AA on the editor background', () => {
  test('there are themes to check', () => {
    assert.ok(themes.length > 0);
  });

  for (const { label, theme } of themes) {
    test(label, () => {
      const background = theme.colors['editor.background'];
      const colours = textColours(theme);

      assert.ok(colours.length > 1, `${label} has syntax colours`);

      // WCAG does not round: 4.499 fails
      const failures = colours
        .map(({ where, colour }) => ({
          where,
          colour,
          ratio: contrast(colour, background)
        }))
        .filter(({ ratio }) => ratio < AA)
        .map((f) => ({ ...f, ratio: Number(f.ratio.toFixed(2)) }));

      assert.deepEqual(
        failures,
        [],
        `${label}: below ${AA}:1 on ${background}:\n${failures
          .map((f) => `  ${f.where}: ${f.colour} ${f.ratio}:1`)
          .join('\n')}`
      );
    });
  }
});
