const path = require('path');
const { version: reactVersion } = require('react/package.json');

module.exports = {
  root: true,
  // Ignore files which are also in .prettierignore
  ignorePatterns: [
    'app/vendor/**',
    'dist/**/*',
    'development/chromereload.js',
    'node_modules/**/*',
  ],
  overrides: [
    /**
     * == Modules ==
     *
     * The first two sections here, which cover module syntax, are mutually
     * exclusive: the set of files covered between them may NOT overlap. This is
     * because we do not allow a file to use two different styles for specifying
     * imports and exports (however theoretically possible it may be).
     */

    {
      /**
       * Modules (CommonJS module syntax)
       *
       * This is code that uses `require()` and `module.exports` to import and
       * export other modules.
       */
      files: [
        '.eslintrc.js',
        '.eslintrc.*.js',
        '.mocharc.js',
        '*.config.js',
        'development/**/*.js',
        'test/e2e/**/*.js',
        'test/helpers/*.js',
        'test/lib/wait-until-called.js',
      ],
      extends: [
        path.resolve(__dirname, '.eslintrc.base.js'),
        path.resolve(__dirname, '.eslintrc.node.js'),
        path.resolve(__dirname, '.eslintrc.babel.js'),
        path.resolve(__dirname, '.eslintrc.typescript-compat.js'),
      ],
      parserOptions: {
        sourceType: 'module',
      },
      rules: {
        // This rule does not work with CommonJS modules. We will just have to
        // trust that all of the files specified above are indeed modules.
        'import/unambiguous': 'off',
      },
      settings: {
        'import/resolver': {
          // When mapping a require path to a file, try a CommonJS module first,
          // and if that doesn't exist, try a TypeScript module. This allows
          // TypeScript files to be imported from JavaScript files, while also
          // preventing issues when using packages like "No default export found
          // in imported module 'prop-types'."
          node: {},
          typescript: {},
        },
      },
    },
    /**
     * Modules (ES module syntax)
     *
     * This is code that explicitly uses `import`/`export` instead of
     * `require`/`module.exports`.
     */
    {
      files: [
        'app/**/*.js',
        'shared/**/*.js',
        'ui/**/*.js',
        '**/*.test.js',
        'test/lib/**/*.js',
        'test/mocks/**/*.js',
        'test/jest/**/*.js',
        'test/stub/**/*.js',
        'test/unit-global/**/*.js',
      ],
      // TODO: Convert these files to modern JS
      excludedFiles: ['test/lib/wait-until-called.js'],
      extends: [
        path.resolve(__dirname, '.eslintrc.base.js'),
        path.resolve(__dirname, '.eslintrc.node.js'),
        path.resolve(__dirname, '.eslintrc.babel.js'),
        path.resolve(__dirname, '.eslintrc.typescript-compat.js'),
      ],
      parserOptions: {
        sourceType: 'module',
      },
      settings: {
        'import/resolver': {
          // When mapping a require path to a file, try a CommonJS module first,
          // and if that doesn't exist, try a TypeScript module. This allows
          // TypeScript files to be imported from JavaScript files, while also
          // preventing issues when using packages like "No default export found
          // in imported module 'prop-types'."
          node: {},
          typescript: {},
        },
      },
    },
    /**
     * TypeScript files
     */
    {
      files: ['*.{ts,tsx}'],
      extends: [
        path.resolve(__dirname, '.eslintrc.base.js'),
        '@metamask/eslint-config-typescript',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        path.resolve(__dirname, '.eslintrc.typescript-compat.js'),
      ],
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: ['./tsconfig.json'],
      },
      rules: {
        // Turn this back on as per
        // <https://github.com/alexgorbatchev/eslint-import-resolver-typescript>
        'import/no-unresolved': 'error',

        // disabled due to incompatibility with Record<string, unknown>
        // See https://github.com/Microsoft/TypeScript/issues/15300#issuecomment-702872440
        '@typescript-eslint/consistent-type-definitions': 'off',

        // Modified to include the 'ignoreRestSiblings' option
        // TODO: Migrate this rule change back into `@metamask/eslint-config`
        '@typescript-eslint/no-unused-vars': [
          'error',
          {
            vars: 'all',
            args: 'all',
            argsIgnorePattern: '[_]+',
            ignoreRestSiblings: true,
          },
        ],
      },
      settings: {
        'import/resolver': {
          // When mapping a require path to a file, try a TypeScript module
          // first, and if that doesn't exist, try a CommonJS module.
          typescript: {},
          node: {},
        },
      },
    },
    {
      files: ['*.d.ts'],
      parserOptions: {
        sourceType: 'script',
      },
    },

    /**
     * == Everything else ==
     *
     * The sections from here on out may overlap with each other in various
     * ways depending on their function.
     */

    /**
     * React-specific code
     *
     * Code in this category contains JSX and hence needs to be run through the
     * React plugin.
     */
    {
      files: [
        'test/lib/render-helpers.js',
        'test/jest/rendering.js',
        'ui/**/*.js',
      ],
      extends: ['plugin:react/recommended', 'plugin:react-hooks/recommended'],
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      plugins: ['react'],
      rules: {
        'react/no-unused-prop-types': 'error',
        'react/no-unused-state': 'error',
        'react/jsx-boolean-value': 'error',
        'react/jsx-curly-brace-presence': [
          'error',
          { props: 'never', children: 'never' },
        ],
        'react/no-deprecated': 'error',
        'react/default-props-match-prop-types': 'error',
        'react/jsx-no-duplicate-props': 'error',
      },
      settings: {
        react: {
          // If this is set to 'detect', ESLint will import React in order to
          // find its version. Because we run ESLint in the build system under
          // LavaMoat, this means that detecting the React version requires a
          // LavaMoat policy for all of React, in the build system. That's a
          // no-go, so we grab it from React's package.json.
          version: reactVersion,
        },
      },
    },
    /**
     * Mocha tests
     *
     * These are files that make use of globals and syntax introduced by the
     * Mocha library.
     */
    {
      files: [
        '**/*.test.js',
        'test/lib/wait-until-called.js',
        'test/e2e/**/*.spec.js',
      ],
      excludedFiles: [
        'app/scripts/controllers/network/**/*.test.js',
        'app/scripts/controllers/permissions/*.test.js',
        'app/scripts/lib/**/*.test.js',
        'app/scripts/migrations/*.test.js',
        'app/scripts/platforms/*.test.js',
        'development/**/*.test.js',
        'shared/**/*.test.js',
        'ui/**/*.test.js',
        'ui/__mocks__/*.js',
      ],
      extends: ['@metamask/eslint-config-mocha'],
      rules: {
        // In Mocha tests, it is common to use `this` to store values or do
        // things like force the test to fail.
        '@babel/no-invalid-this': 'off',
        'mocha/no-setup-in-describe': 'off',
      },
    },
    /**
     * Jest tests
     *
     * These are files that make use of globals and syntax introduced by the
     * Jest library.
     */
    {
      files: [
        '**/__snapshots__/*.snap',
        'app/scripts/controllers/network/**/*.test.js',
        'app/scripts/controllers/permissions/*.test.js',
        'app/scripts/lib/**/*.test.js',
        'app/scripts/migrations/*.test.js',
        'app/scripts/platforms/*.test.js',
        'development/**/*.test.js',
        'shared/**/*.test.js',
        'test/jest/*.js',
        'test/helpers/*.js',
        'ui/**/*.test.js',
        'ui/__mocks__/*.js',
      ],
      extends: ['@metamask/eslint-config-jest'],
      parserOptions: {
        sourceType: 'module',
      },
      rules: {
        'import/unambiguous': 'off',
        'import/named': 'off',
        'jest/no-large-snapshots': [
          'error',
          { maxSize: 50, inlineMaxSize: 50 },
        ],
        'jest/no-restricted-matchers': 'off',
      },
    },
    /**
     * Migrations
     */
    {
      files: ['app/scripts/migrations/*.js', '**/*.stories.js'],
      rules: {
        'import/no-anonymous-default-export': ['error', { allowObject: true }],
      },
    },
    /**
     * Executables and related files
     *
     * These are files that run in a Node context. They are either designed to
     * run as executables (in which case they will have a shebang at the top) or
     * are dependencies of executables (in which case they may use
     * `process.exit` to exit).
     */
    {
      files: [
        'development/**/*.js',
        'test/e2e/benchmark.js',
        'test/helpers/setup-helper.js',
      ],
      rules: {
        'node/no-process-exit': 'off',
        'node/shebang': 'off',
      },
    },
    /**
     * Lockdown files
     */
    {
      files: [
        'app/scripts/lockdown-run.js',
        'app/scripts/lockdown-more.js',
        'test/helpers/protect-intrinsics-helpers.js',
        'test/unit-global/protect-intrinsics.test.js',
      ],
      globals: {
        harden: 'readonly',
        Compartment: 'readonly',
      },
    },
    {
      files: ['app/scripts/lockdown-run.js', 'app/scripts/lockdown-more.js'],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
};
