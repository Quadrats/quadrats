module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-recommended-scss'
  ],
  plugins: [
    'stylelint-order',
    'stylelint-scss'
  ],
  rules: {
    'at-rule-empty-line-before': [
      'always',
      {
        ignore: [
          'after-comment',
          'first-nested'
        ],
        ignoreAtRules: [
          'use',
          'forward',
          'import',
          'include',
          'if',
          'else'
        ]
      }
    ],
    'selector-class-pattern': null,
    'at-rule-no-vendor-prefix': true,
    'media-feature-name-no-vendor-prefix': true,
    'property-no-vendor-prefix': true,
    'selector-no-vendor-prefix': true,
    'value-no-vendor-prefix': true,
    'selector-pseudo-class-no-unknown': true,
    'order/order': [
      'custom-properties',
      'declarations'
    ],
    'scss/selector-no-redundant-nesting-selector': true
  }
};
