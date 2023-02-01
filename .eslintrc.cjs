module.exports = {
  extends: [
    'plugin:astro/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:tailwindcss/recommended',
    'eslint:recommended',
    'react-app',
    'prettier'
  ],
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    project: './tsconfig.json',
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  overrides: [
    {
      // Define the configuration for `.astro` file.
      files: ['*.astro'],
      // Allows Astro components to be parsed.
      parser: 'astro-eslint-parser',
      // Parse the script in `.astro` as TypeScript by adding the following configuration.
      // It's the setting you need when using TypeScript.
      parserOptions: {
        parser: '@typescript-eslint/parser',
        extraFileExtensions: ['.astro']
      },
      plugins: ['simple-import-sort'],
      rules: {
        // tailwindcss/no-custom-classnameを無効化
        'tailwindcss/no-custom-classname': 'off',

        // simple-import-sort/importsを有効化
        'simple-import-sort/imports': 'error'
      }
    },
    {
      files: ['**/*.ts', '**/*.tsx'],
      plugins: ['simple-import-sort'],
      rules: {
        // tailwindcss/no-custom-classnameを無効化
        'tailwindcss/no-custom-classname': 'off',

        // simple-import-sort/importsを有効化
        'simple-import-sort/imports': 'error',

        // react/jsx-sort-propsを有効化
        'react/jsx-sort-props': [2],

        // react/jsx-uses-reactとreact/react-in-jsx-scopeを無効化
        'react/jsx-uses-react': 'off',
        'react/react-in-jsx-scope': 'off'
      }
    }
  ]
}
