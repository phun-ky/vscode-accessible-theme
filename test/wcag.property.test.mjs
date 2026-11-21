/* eslint-disable import-x/no-named-as-default-member -- fast-check documents its API as fc.* */
import fc from 'fast-check';

import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import { contrast, parseHex } from './wcag.mjs';

const channel = fc.integer({ min: 0, max: 255 });
const pair = (n) => n.toString(16).padStart(2, '0');
const opaque = fc
  .tuple(channel, channel, channel)
  .map(([r, g, b]) => `#${pair(r)}${pair(g)}${pair(b)}`);
const withAlpha = fc
  .tuple(opaque, channel)
  .map(([colour, a]) => `${colour}${pair(a)}`);

describe('wcag properties', () => {
  test('contrast is from 1 to 21, with or without alpha', () => {
    fc.assert(
      fc.property(fc.oneof(opaque, withAlpha), opaque, (fg, bg) => {
        const ratio = contrast(fg, bg);

        assert.ok(ratio >= 1 && ratio <= 21, `got ${ratio}`);
      })
    );
  });

  test('contrast between opaque colours does not depend on the order', () => {
    fc.assert(
      fc.property(opaque, opaque, (a, b) => {
        assert.equal(contrast(a, b), contrast(b, a));
      })
    );
  });

  test('a fully transparent colour has 1:1, a fully opaque one as without alpha', () => {
    fc.assert(
      fc.property(opaque, opaque, (fg, bg) => {
        assert.equal(contrast(`${fg}00`, bg), 1);
        assert.equal(contrast(`${fg}ff`, bg), contrast(fg, bg));
      })
    );
  });

  test('parseHex reads back the channels of #rrggbb and #rrggbbaa, in any case', () => {
    fc.assert(
      fc.property(
        channel,
        channel,
        channel,
        fc.option(channel),
        fc.boolean(),
        (r, g, b, a, upper) => {
          const hex = `#${[r, g, b, ...(a === null ? [] : [a])].map(pair).join('')}`;

          assert.deepEqual(parseHex(upper ? hex.toUpperCase() : hex), {
            r,
            g,
            b,
            a: a === null ? 1 : a / 255
          });
        }
      )
    );
  });
});
