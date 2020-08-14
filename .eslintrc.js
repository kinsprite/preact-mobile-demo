module.exports = {
  extends: [
    'react-micro-frontend-scripts/lints/eslintReactTS',
  ].map(require.resolve),
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/no-unknown-property': 'off',
  },
};
