module.exports = {
  rules: {
    // With this extension, ESLint will look for TypeScript files when it
    // encounters an import. For some reason, this is now introducing
    // `import/no-named-as-default-member` errors. Turn this off as this doesn't
    // tend to cause issues for us.
    'import/no-named-as-default-member': 'off',
  },
  settings: {
    'import/extensions': ['.js', '.ts', '.tsx'],
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
  },
};
