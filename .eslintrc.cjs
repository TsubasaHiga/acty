module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:tailwindcss/recommended',
    'prettier'
  ],
  plugins: ['simple-import-sort'],
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    // tailwindcss/no-custom-classnameを無効化
    'tailwindcss/no-custom-classname': 'off',

    // simple-import-sort/importsを有効化
    'simple-import-sort/imports': 'error',
    // simple-import-sort/exportsを有効化
    'simple-import-sort/exports': 'error'
  },
  overrides: [
    // .astroファイルに対する設定
    {
      files: ['**/*.astro'],
      extends: ['plugin:astro/recommended'],
      parser: 'astro-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
        extraFileExtensions: ['.astro']
      }
    },

    // .ts,.tsxファイルに対する設定
    {
      files: ['**/*.ts', '**/*.tsx'],
      extends: ['react-app'],
      parserOptions: {
        project: './tsconfig.json'
      },
      rules: {
        // react/jsx-sort-propsを有効化
        'react/jsx-sort-props': [2],

        // react/jsx-uses-reactとreact/react-in-jsx-scopeを無効化
        'react/jsx-uses-react': 'off',
        'react/react-in-jsx-scope': 'off',

        // @typescript-eslint/no-explicit-anyを無効化
        '@typescript-eslint/no-explicit-any': 'off'
      }
    }
  ]
}
