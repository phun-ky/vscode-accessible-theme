// Pairs each UI text colour a theme sets with the background it is drawn on.

// Keys whose background isn't named after them
const EXPLICIT = Object.freeze({
  'sideBarTitle.foreground': 'sideBar.background',
  'panelTitle.activeForeground': 'panel.background',
  'panelTitle.inactiveForeground': 'panel.background'
});

// Foreground keys that are not checked, with the reason
export const SKIPPED = Object.freeze({
  // Drawn on checkbox.background, which the themes leave to VS Code
  'checkbox.foreground': 'checkbox.background is unset'
});

/**
 * A text colour: a foreground key (`tab.activeForeground`,
 * `statusBar.foreground`, `editorBracketHighlight.foreground3`) or a terminal
 * ANSI colour.
 * @param {string} key
 * @returns {boolean}
 */
export const isTextColour = (key) =>
  /foreground\d*$/i.test(key) || key.startsWith('terminal.ansi');

/**
 * @param {Record<string, string>} colors a theme's `colors`
 * @param {string} key a foreground key
 * @returns {string | undefined} the key of the background it is drawn on
 */
export const backgroundFor = (colors, key) => {
  if (Object.hasOwn(EXPLICIT, key)) return EXPLICIT[key];

  if (key.startsWith('gitDecoration.')) return 'sideBar.background';

  if (key.startsWith('editorBracketHighlight.')) return 'editor.background';

  if (key.startsWith('terminal.ansi')) {
    return ['terminal.background', 'panel.background'].find((k) =>
      Object.hasOwn(colors, k)
    );
  }

  const own = key
    .replace(/Foreground$/, 'Background')
    .replace(/\.foreground$/, '.background');

  return [own, `${key.split('.')[0]}.background`].find(
    (k) => k !== key && Object.hasOwn(colors, k)
  );
};

/**
 * Every text colour the theme sets, with its background. A background with
 * alpha is composited over the editor background first.
 * @param {Record<string, string>} colors
 * @returns {{ fgKey: string, fg: string, bgKey: string, bg: string }[]}
 */
export const uiPairs = (colors) =>
  Object.keys(colors)
    .filter((key) => isTextColour(key) && !Object.hasOwn(SKIPPED, key))
    .map((fgKey) => ({ fgKey, bgKey: backgroundFor(colors, fgKey) }))
    .map(({ fgKey, bgKey }) => ({
      fgKey,
      fg: colors[fgKey],
      bgKey,
      bg: bgKey === undefined ? undefined : colors[bgKey]
    }));
