module.exports = {
  // Tell ESLint to use the Typescript parser instead of it’s default.
  parser: '@typescript-eslint/parser',
  parserOptions: {
  // ECMA version to 2018, would be using the latest ES features
    ecmaVersion: 2018,
    // sourceType to module, would be using ES modules
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  env: {
    // Apply browser: tell ESLint that window as global
    browser: true,
     // Apply server
    node: true,
  },
  // Wherein set the rules that the basic ESLint recommended and the typescript plugin recommends
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
    rules: {
    // note you must disable the base rule as it can report incorrect errors
    "indent": "off",
    "@typescript-eslint/indent": ["error", 2],
    "@typescript-eslint/no-explicit-any": "off",
    "comma-dangle": [2, "always-multiline"],
    "arrow-parens": 0,
    "generator-star-spacing": 0,
    "space-before-function-paren": ["error", "never"],
    "@typescript-eslint/no-unused-vars": 0,
    "@typescript-eslint/no-non-null-assertion": 0,
    "@typescript-eslint/no-object-literal-type-assertion": 0,
    "@typescript-eslint/prefer-interface": 0,
    "no-debugger": process.env.NODE_ENV === "production" ? 2 : 0,
    "no-console": 0,
  }
}