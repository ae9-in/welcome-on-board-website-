const { FlatCompat } = require('@eslint/eslintrc');

module.exports = [
  { ignores: ['dist', '.next', 'node_modules'] },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
];
