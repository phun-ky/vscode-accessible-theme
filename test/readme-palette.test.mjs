// The README palette tables must list exactly the text colours each theme
// uses, with the contrast ratio and WCAG levels measured from the theme files.

import assert from 'node:assert/strict';
import fs from 'node:fs';
import { describe, test } from 'node:test';

import { textColours } from './syntax-colours.mjs';
import { contrast } from './wcag.mjs';

const manifest = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const themes = manifest.contributes.themes.map(({ label, path }) => ({
  label,
  theme: JSON.parse(fs.readFileSync(path, 'utf8'))
}));
const readme = fs.readFileSync('README.md', 'utf8');
// **With dark background: Sky Captain - `#262831`**:
const HEADING =
  /^\*\*With (dark|light) background: (.+) - `(#[0-9A-F]{6})`\*\*:$/;
/**
 * The palette tables in a README, keyed by background hex.
 * @param {string} markdown
 * @returns {Map<string, { type: string, name: string, rows: string[][] }>}
 */
const paletteTables = (markdown) => {
  const tables = new Map();

  let current;

  for (const line of markdown.split('\n')) {
    const heading = line.match(HEADING);

    if (heading) {
      const [, type, name, hex] = heading;

      current = { type, name, rows: [] };
      tables.set(hex, current);
    } else if (current && line.startsWith('|')) {
      current.rows.push(
        line
          .slice(1, -1)
          .split('|')
          .map((cell) => cell.trim().replace(/^`|`$/g, ''))
      );
    } else if (current && current.rows.length > 0) {
      current = undefined;
    }
  }

  // Drop the header and separator rows
  for (const table of tables.values()) table.rows = table.rows.slice(2);

  return tables;
};
// Shown rounded down, so the README never claims more than the colour has
const shown = (ratio) =>
  `${(Math.floor(ratio * 100 + 1e-9) / 100).toFixed(2)}:1`;
const normalText = (ratio) =>
  ratio >= 7 ? 'AAA' : ratio >= 4.5 ? 'AA' : 'Fail';
const largeText = (ratio) =>
  ratio >= 4.5 ? 'AAA' : ratio >= 3 ? 'AA' : 'Fail';

describe('reading the README palette tables', () => {
  test('finds each table by its background and skips the header rows', () => {
    const tables = paletteTables(
      [
        '**With light background: Paper - `#FFFFFF`**:',
        '',
        '| Colour | Hex | Ratio | Normal Text | Large Text |',
        '| ------ | --- | ----- | ----------- | ---------- |',
        '| Ink | `#000000` | 21.00:1 | AAA | AAA |',
        '',
        'Not part of the table.'
      ].join('\n')
    );

    assert.deepEqual([...tables.keys()], ['#FFFFFF']);
    assert.equal(tables.get('#FFFFFF').type, 'light');
    assert.deepEqual(tables.get('#FFFFFF').rows, [
      ['Ink', '#000000', '21.00:1', 'AAA', 'AAA']
    ]);
  });

  test('rounds ratios down and grades them', () => {
    assert.equal(shown(4.4999), '4.49:1');
    assert.equal(shown(5.0785), '5.07:1');
    assert.equal(normalText(4.5), 'AA');
    assert.equal(normalText(7), 'AAA');
    assert.equal(largeText(3.2), 'AA');
  });
});

describe('README palette matches the themes', () => {
  const tables = paletteTables(readme);

  for (const { label, theme } of themes) {
    const background = theme.colors['editor.background'].toUpperCase();

    test(`${label}: has a table for ${background}`, () => {
      assert.ok(tables.has(background), `no palette table for ${background}`);
      assert.equal(tables.get(background).type, theme.type);
    });

    test(`${label}: lists every text colour once, and nothing else`, () => {
      const used = [
        ...new Set(textColours(theme).map(({ colour }) => colour.toUpperCase()))
      ].sort();
      const listed = (tables.get(background)?.rows ?? []).map(([, hex]) => hex);

      assert.deepEqual([...listed].sort(), used);
      assert.equal(
        new Set(listed).size,
        listed.length,
        'a colour is listed twice'
      );
    });

    test(`${label}: ratios and levels are measured`, () => {
      for (const [name, hex, ratio, normal, large] of tables.get(background)
        ?.rows ?? []) {
        const measured = contrast(hex, background);

        assert.deepEqual(
          { name, ratio, normal, large },
          {
            name,
            ratio: shown(measured),
            normal: normalText(measured),
            large: largeText(measured)
          }
        );
      }
    });
  }
});
