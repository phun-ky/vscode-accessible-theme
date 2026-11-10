// Checks the packaged extension (.vsix) before it is published: exactly the
// expected files, a manifest that matches package.json, themes that parse and
// match their contribution, and README images that will load.
//
// Usage: node scripts/check-pack.mjs <file.vsix>

import fs from 'node:fs';
import { inflateRawSync } from 'node:zlib';

const EXPECTED_FILES = [
  '[Content_Types].xml',
  'extension.vsixmanifest',
  'extension/LICENSE.txt',
  'extension/changelog.md',
  'extension/package.json',
  'extension/readme.md',
  'extension/themes/accessible-dark-color-theme.json',
  'extension/themes/accessible-light-color-theme.json'
];
// The theme type each uiTheme in contributes.themes expects
const UI_THEME_TYPES = Object.freeze({
  vs: 'light',
  'vs-dark': 'dark',
  'hc-black': 'hc',
  'hc-light': 'hcLight'
});
/**
 * Reads every entry of a zip archive (no zip64, which a VSIX never needs).
 * @param {Buffer} zip
 * @returns {Map<string, Buffer>}
 */
const readZip = (zip) => {
  const eocd = zip.lastIndexOf(Buffer.from([0x50, 0x4b, 0x05, 0x06]));

  if (eocd < 0) throw new Error('not a zip file: no end of central directory');

  const count = zip.readUInt16LE(eocd + 10);

  let offset = zip.readUInt32LE(eocd + 16);

  const entries = new Map();

  for (let i = 0; i < count; i++) {
    if (zip.readUInt32LE(offset) !== 0x02014b50) {
      throw new Error(`bad central directory entry ${i}`);
    }

    const method = zip.readUInt16LE(offset + 10);
    const compressedSize = zip.readUInt32LE(offset + 20);
    const nameLength = zip.readUInt16LE(offset + 28);
    const extraLength = zip.readUInt16LE(offset + 30);
    const commentLength = zip.readUInt16LE(offset + 32);
    const localOffset = zip.readUInt32LE(offset + 42);
    const name = zip.toString('utf8', offset + 46, offset + 46 + nameLength);
    const localNameLength = zip.readUInt16LE(localOffset + 26);
    const localExtraLength = zip.readUInt16LE(localOffset + 28);
    const start = localOffset + 30 + localNameLength + localExtraLength;
    const data = zip.subarray(start, start + compressedSize);

    if (method !== 0 && method !== 8) {
      throw new Error(`${name}: unsupported compression method ${method}`);
    }

    entries.set(name, method === 8 ? inflateRawSync(data) : data);
    offset += 46 + nameLength + extraLength + commentLength;
  }

  return entries;
};
const file = process.argv[2];

if (!file) {
  console.error('Usage: node scripts/check-pack.mjs <file.vsix>');
  process.exit(2);
}

const failures = [];
const check = (ok, message) => {
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${message}`);

  if (!ok) failures.push(message);
};
const entries = readZip(fs.readFileSync(file));
const names = [...entries.keys()].sort();
const extra = names.filter((name) => !EXPECTED_FILES.includes(name));
const missing = EXPECTED_FILES.filter((name) => !entries.has(name));

check(
  extra.length === 0,
  `no unexpected files${extra.length ? `: ${extra.join(', ')}` : ''}`
);
check(
  missing.length === 0,
  `all expected files${missing.length ? `, missing: ${missing.join(', ')}` : ''}`
);

const local = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const manifest = JSON.parse(entries.get('extension/package.json') ?? '{}');

for (const key of ['name', 'publisher', 'version', 'displayName']) {
  check(
    manifest[key] === local[key] && Boolean(manifest[key]),
    `packaged ${key} is ${JSON.stringify(manifest[key])}, package.json has ${JSON.stringify(local[key])}`
  );
}

check(
  typeof manifest.engines?.vscode === 'string',
  `engines.vscode is set (${manifest.engines?.vscode})`
);

const vsixManifest = entries.get('extension.vsixmanifest')?.toString() ?? '';

check(
  vsixManifest.includes(`Version="${local.version}"`) &&
    vsixManifest.includes(`Publisher="${local.publisher}"`),
  `extension.vsixmanifest names ${local.publisher} ${local.version}`
);

const themes = manifest.contributes?.themes ?? [];

check(themes.length > 0, `contributes ${themes.length} themes`);

for (const { label, path: themePath, uiTheme } of themes) {
  const entry = `extension/${String(themePath).replace(/^\.\//, '')}`;
  const raw = entries.get(entry);

  check(Boolean(raw), `${label}: ${themePath} is in the package`);

  if (!raw) continue;

  let theme;

  try {
    theme = JSON.parse(raw.toString());
  } catch (error) {
    check(false, `${label}: ${themePath} parses as JSON (${error.message})`);
    continue;
  }

  const expectedType = Object.hasOwn(UI_THEME_TYPES, uiTheme)
    ? UI_THEME_TYPES[uiTheme]
    : undefined;

  check(
    expectedType !== undefined && theme.type === expectedType,
    `${label}: type "${theme.type}" matches uiTheme "${uiTheme}"`
  );
  check(
    Object.keys(theme.colors ?? {}).length > 0 &&
      (theme.tokenColors ?? []).length > 0,
    `${label}: has colors (${Object.keys(theme.colors ?? {}).length}) and tokenColors (${(theme.tokenColors ?? []).length})`
  );
}

// vsce rewrites relative image links to GitHub URLs; a relative one left over
// would show as a broken image on the Marketplace
const readme = entries.get('extension/readme.md')?.toString() ?? '';
const relativeImages = [...readme.matchAll(/!\[[^\]]*\]\(([^)\s]+)/g)]
  .map((match) => match[1])
  .filter((url) => !/^https:\/\//.test(url));

check(
  relativeImages.length === 0,
  `README images use absolute https URLs${relativeImages.length ? `, relative: ${relativeImages.join(', ')}` : ''}`
);

if (failures.length > 0) {
  console.error(`\n${failures.length} check(s) failed for ${file}`);
  process.exit(1);
}

console.log(`\nAll checks passed for ${file} (${names.length} files)`);
