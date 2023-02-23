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
          'use'
        ]
      }
    ],
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['global']
      }
    ]
  }
}
