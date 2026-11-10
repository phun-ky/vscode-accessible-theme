// The colours a theme gives to text in the editor.

/**
 * Every foreground a theme gives to syntax: tokenColors and
 * semanticTokenColors.
 * @param {object} theme
 * @returns {{ where: string, colour: string }[]}
 */
export const syntaxColours = (theme) => {
  const fromTokens = (theme.tokenColors ?? [])
    .filter((rule) => rule.settings?.foreground)
    .map((rule) => ({
      where: rule.name ?? [].concat(rule.scope ?? []).join(', '),
      colour: rule.settings.foreground
    }));
  const fromSemantic = Object.entries(theme.semanticTokenColors ?? {})
    .map(([selector, value]) => ({
      where: `semantic ${selector}`,
      colour: typeof value === 'string' ? value : value?.foreground
    }))
    .filter(({ colour }) => colour);

  return [...fromTokens, ...fromSemantic];
};

/**
 * `editor.foreground` and every syntax colour.
 * @param {object} theme
 * @returns {{ where: string, colour: string }[]}
 */
export const textColours = (theme) => [
  { where: 'editor.foreground', colour: theme.colors['editor.foreground'] },
  ...syntaxColours(theme)
];
