module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
    'plugin:react-hooks/recommended', // Enforces the rules of Hooks
  ],
  globals: {
    // ESLint does not know about I18n object stored at window level
    // https://eslint.org/docs/latest/use/configure/language-options#specifying-globals
    I18n: 'readonly',
    ga: 'readonly',
  },
  overrides: [
    {
      files: ['./cypress/**/*.js'],
      rules: { 'no-undef': 'off' },
    },
    // Targeting files ending with styles.js, assuming css-in-js files would be made to end in styles.js
    {
      files: ['*styles.js'],
      rules: { 'object-curly-newline': 'off' },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    'import',
    'react',
  ],
  settings: { react: { version: 'detect' } },
  rules: {
    // Single quotes are favored for their readability, style consistency,
    // JSON compatibility, and lesser visual noise in JavaScript
    quotes: ['error', 'single'],
    'jsx-quotes': ['error', 'prefer-single'],
    'react/jsx-tag-spacing': ['error', {
      closingSlash: 'never',
      beforeSelfClosing: 'never',
      afterOpening: 'never',
      beforeClosing: 'never',
    }],
    // 'after-props' option enforces the closing bracket to be on the same line as the last part of the last attribute.
    'react/jsx-closing-bracket-location': ['error', 'after-props'],
    // Enforces function style consistency by requiring function expressions.
    // Enforces arrow function expressions for React Function Components.
    'func-style': ['error'],
    'react/function-component-definition': ['error', {
      namedComponents: 'arrow-function',
      unnamedComponents: 'arrow-function',
    }],
    // Enforces an import order from Node.js built-in modules to local ones
    // (in ascending alphabetical order), separated by newlines between each group.
    // Enforces alphabetical ordering of import statements based on the module/source paths,
    // not the specific named or default imports.
    // ref: https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/order.md
    'import/order': ['error', {
      'newlines-between': 'always',
      groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
      alphabetize: {
        order: 'asc',
        caseInsensitive: true,
      },
    }],
    'import/no-extraneous-dependencies': [
      'error', { devDependencies: true },
    ],
    'max-len': ['error', { code: 150 }],
    /*
        * Setting 'variables' to false in the configuration below allows for referencing variables
        * before their declarations, but only if they are referenced in an inner scope relative to
        * their declarations.
        *
        * For example, the code:
        *    const bar = () => foo();
        *    const foo = () => {};
        * will not be flagged by the linter with respect to 'foo' when 'variables' is set to false.
        *
        * However, the following code:
        *    foo();
        *    const foo = () => {};
        * will still be flagged by the linter with respect to 'foo', even when 'variables' is set to
        * false, as 'foo' is used before and at the same scope level where it is declared.
      */
    // Allowing function calls before their definitions as they are hoisted so no runtime issues
    // Disallowing classes references before their definitions as they are not hoisted
    // Rule set to warn; in this case, warn indicates take decision on fixing vs not fixing on a case by case basis
    'no-use-before-define': ['warn', { functions: false, classes: true, variables: true }],
    'react/jsx-filename-extension': ['error', { extensions: ['.jsx', '.js'] }],
    'react/jsx-props-no-spreading': 'off',
    'react/static-property-placement': ['error', 'static public field'],
    'react-hooks/rules-of-hooks': 'error', // Checks rules of Hooks
    'react-hooks/exhaustive-deps': 'warn', // Checks effect dependencies
    /*
        This ESLint rule configuration enforces line breaks inside curly braces of object literals,
        destructuring assignments, import/export specifiers based on the number of properties.
        The 'error' level means that any violations of this rule will cause ESLint to raise an error.

        For each type of expression (ObjectExpression, ObjectPattern, ImportDeclaration,
        and ExportDeclaration), if the object has at least 5 properties, it must have line breaks
        after opening and before closing curly braces. In other words, each property must be on its
        own line if there are 5 or more properties.

        - ObjectExpression: These are objects defined in the code such as `let obj = { ... }`.
        - ObjectPattern: These are objects in destructuring assignments
          such as in `let { a, b, c } = obj`.
        - ImportDeclaration: These are import statements from ES6,
          such as `import { a, b, c } from 'module'`.
        - ExportDeclaration: These are export statements from ES6, such as `export { a, b, c }`.
      */
    'object-curly-newline': ['error', {
      ObjectExpression: { multiline: true, minProperties: 5 },
      ObjectPattern: { multiline: true, minProperties: 5 },
      ImportDeclaration: { multiline: true, minProperties: 5 },
      ExportDeclaration: { multiline: true, minProperties: 5 },
    }],
    // The MUI Link component automatically converts a Link component
    // without href to a button element with Link styling.
    // But the jsx-a11y/anchor-is-valid rule doesn't know that.
    // Thus, we only check for invalid href attributes on Link components.
    'jsx-a11y/anchor-is-valid': [
      'error',
      {
        components: ['Link'],
        aspects: ['invalidHref'],
      },
    ],
    'jsx-a11y/click-events-have-key-events': 'off', // not doing accessibility comaptibility in the app for the present
    // commenting out the following rules for time-being as inline styles would be tackled in next phase of linting
    // Prohibit the use of inline styles via the 'style' prop
    // 'react/forbid-dom-props': ['error', { forbid: ['style'] }],
    // Prohibit the use of inline styles via the 'sx' and 'style' prop
    // 'react/forbid-component-props': ['error', { forbid: ['sx', 'style'] }],
  },
};
