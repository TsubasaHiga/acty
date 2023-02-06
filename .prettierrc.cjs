module.exports = {
  semi: false,
  singleQuote: true,
  useTabs: false,
  tabWidth: 2,
  printWidth: 120,
  trailingComma: 'none',
  endOfLine: 'lf',
  plugins: [require('prettier-plugin-md-nocjsp')],
  overrides: [
    {
      files: ['*.md', 'README'],
      options: {
        parser: 'markdown-nocjsp'
      }
    },
    {
      files: '*.mdx',
      options: {
        parser: 'mdx-nocjsp'
      }
    }
  ]
}
