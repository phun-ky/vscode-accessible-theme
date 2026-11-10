import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import { contrast, parseHex } from './wcag.mjs';

describe('contrast', () => {
  test('black on white is 21:1 and a colour on itself is 1:1', () => {
    assert.equal(contrast('#000000', '#ffffff'), 21);
    assert.equal(contrast('#ffffff', '#000000'), 21);
    assert.equal(contrast('#566D71', '#566D71'), 1);
  });

  test('matches known WCAG values', () => {
    // #767676 is the lightest grey that passes AA on white
    assert.equal(contrast('#767676', '#ffffff').toFixed(2), '4.54');
    assert.ok(contrast('#777777', '#ffffff') < 4.5);
    // The light theme's foreground and background, as listed in the README
    assert.equal(contrast('#566D71', '#F5F6F7').toFixed(2), '5.08');
  });

  test('blends alpha over the background', () => {
    assert.equal(contrast('#00000000', '#ffffff'), 1);
    assert.equal(contrast('#000000ff', '#ffffff'), 21);
    assert.ok(contrast('#00000080', '#ffffff') > 3);
    assert.ok(contrast('#00000080', '#ffffff') < 21);
  });

  test('expands short hex', () => {
    assert.deepEqual(parseHex('#fff'), { r: 255, g: 255, b: 255, a: 1 });
    assert.deepEqual(parseHex('#0008'), { r: 0, g: 0, b: 0, a: 136 / 255 });
  });

  test('rejects what is not a hex colour, and a transparent background', () => {
    assert.throws(() => contrast('red', '#ffffff'), TypeError);
    assert.throws(() => contrast('#12345', '#ffffff'), TypeError);
    assert.throws(() => contrast('#000000', '#ffffff80'), RangeError);
  });
});
