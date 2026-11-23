// Content of the release banners for 1.0. Copy this file for the next major
// (e.g. 2.0.mjs) and run: npm run banners -- 2.0
export default {
  slug: 'v1',
  pill: 'Release 1.0 · August 2025',
  title: ['Code you can read,', { accent: 'dark or light' }],
  body: 'Two VS Code themes, Accessible (AA) Dark and Light, with every syntax colour at WCAG AA contrast, 4.5:1 or more, on the editor background. npm test checks it.',
  // The code in each editor: lines of [TextMate scope, text], coloured by the
  // rule for that scope in each theme file, or editor.foreground without one
  file: 'wcag.mjs',
  code: [
    [['comment', '// WCAG 2.x contrast']],
    [
      ['storage.type', 'const'],
      ['', ' '],
      ['variable', 'ratio'],
      ['', ' '],
      ['keyword.operator', '='],
      ['', ' contrast('],
      ['variable', 'fg'],
      ['punctuation', ','],
      ['', ' '],
      ['variable', 'bg'],
      ['', ')'],
      ['punctuation', ';']
    ],
    [
      ['keyword.control', 'if'],
      ['', ' ('],
      ['variable', 'ratio'],
      ['', ' '],
      ['keyword.operator', '>='],
      ['', ' '],
      ['constant.numeric', '4.5'],
      ['', ') '],
      ['keyword.control', 'return'],
      ['', ' '],
      ['string', "'AA'"],
      ['punctuation', ';']
    ]
  ]
};
