// WCAG 2.x contrast, as defined for relative luminance:
// https://www.w3.org/TR/WCAG22/#dfn-contrast-ratio

const HEX = /^#(?:[\da-f]{3,4}|[\da-f]{6}|[\da-f]{8})$/i;

/**
 * Parses #rgb, #rgba, #rrggbb or #rrggbbaa.
 * @param {string} colour
 * @returns {{ r: number, g: number, b: number, a: number }} channels 0 to 255, alpha 0 to 1
 */
export const parseHex = (colour) => {
  if (typeof colour !== 'string' || !HEX.test(colour)) {
    throw new TypeError(`Not a hex colour: ${JSON.stringify(colour)}`);
  }

  let hex = colour.slice(1);

  if (hex.length <= 4) hex = [...hex].map((c) => c + c).join('');

  const [r, g, b] = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16));
  const a = hex.length === 8 ? parseInt(hex.slice(6, 8), 16) / 255 : 1;

  return { r, g, b, a };
};

/**
 * Composites a colour with alpha over an opaque background, as the editor
 * draws it.
 * @param {string} colour
 * @param {string} background opaque
 * @returns {{ r: number, g: number, b: number }}
 */
export const blend = (colour, background) => {
  const fg = parseHex(colour);
  const bg = parseHex(background);

  if (bg.a !== 1) {
    throw new RangeError(`Background must be opaque: ${background}`);
  }

  const mix = (f, b) => f * fg.a + b * (1 - fg.a);

  return { r: mix(fg.r, bg.r), g: mix(fg.g, bg.g), b: mix(fg.b, bg.b) };
};

/**
 * @param {{ r: number, g: number, b: number }} rgb channels 0 to 255
 * @returns {number} relative luminance, 0 to 1
 */
export const luminance = ({ r, g, b }) => {
  const [lr, lg, lb] = [r, g, b]
    .map((c) => c / 255)
    .map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));

  return 0.2126 * lr + 0.7152 * lg + 0.0722 * lb;
};

/**
 * @param {string} foreground hex, alpha allowed
 * @param {string} background opaque hex
 * @returns {number} contrast ratio, 1 to 21
 */
export const contrast = (foreground, background) => {
  const a = luminance(blend(foreground, background));
  const b = luminance(blend(background, background));

  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
};
