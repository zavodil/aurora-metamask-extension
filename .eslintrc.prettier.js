module.exports = {
  plugins: ['prettier'],
  extends: ['plugin:prettier/recommended'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        // All of these are defaults except singleQuote, but we specify them
        // for explicitness
        quoteProps: 'as-needed',
        singleQuote: true,
        tabWidth: 2,
        trailingComma: 'all',
      },
      {
        // Allow consumers to override this prettier config.
        // This is the default, but we specify it for the sake of clarity.
        usePrettierrc: true,
      },
    ],
  },
};
