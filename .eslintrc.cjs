module.exports = {
  extends: ['eslint:recommended', 'prettier'],
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
    // simple-import-sort
    'simple-import-sort/imports': 'error',
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
        // react
        'react/jsx-sort-props': [2],
        'react/jsx-uses-react': 'off',
        'react/react-in-jsx-scope': 'off',

        // @typescript-eslint
        '@typescript-eslint/no-explicit-any': 'off'
      }
    }
  ]
}
