module.exports = {
  extends: [
    'stylelint-config-standard-scss',
    'stylelint-config-recess-order',
    'stylelint-config-prettier-scss',
    'stylelint-config-html'
  ],
  rules: {
    'scss/at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'apply',
          'each',
          'else',
          'extend',
          'for',
          'forward',
          'function',
          'if',
          'include',
          'layer',
          'mixin',
          'responsive',
          'return',
          'screen',
          'tailwind',
          'use',
          'else'
        ]
      }
    ],
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['global']
      }
    ],
    'no-descending-specificity': null,
    'declaration-block-no-redundant-longhand-properties': [true, { ignoreShorthands: ['grid-template'] }],
    'at-rule-empty-line-before': [
      'always',
      {
        except: ['blockless-after-same-name-blockless', 'first-nested'],
        ignore: ['after-comment'],
        ignoreAtRules: ['else']
      }
    ]
  }
}
