module.exports = {
  extends: ['plugin:astro/recommended', 'plugin:tailwindcss/recommended', 'eslint:recommended', 'prettier'],
  plugins: ['simple-import-sort'],
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    project: './tsconfig.json',
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    // tailwindcss/no-custom-classnameを無効化
    'tailwindcss/no-custom-classname': 'off',

    // simple-import-sort/importsを有効化
    'simple-import-sort/imports': 'error'
  },
  overrides: [
    {
      files: ['**/*.astro'],
      parser: 'astro-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
        extraFileExtensions: ['.astro']
      }
    },
    {
      files: ['**/*.ts', '**/*.tsx'],
      extends: ['plugin:@typescript-eslint/recommended', 'react-app'],
      rules: {
        // react/jsx-sort-propsを有効化
        'react/jsx-sort-props': [2],

        // react/jsx-uses-reactとreact/react-in-jsx-scopeを無効化
        'react/jsx-uses-react': 'off',
        'react/react-in-jsx-scope': 'off'
      }
    }
  ]
}
