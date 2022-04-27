module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    "project": "./tsconfig.json"
  },
  plugins: ["@typescript-eslint", "functional", "neverthrow"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "plugin:functional/no-mutations",
    "plugin:functional/stylistic",
    "plugin:functional/no-object-orientation",
    "plugin:functional/no-exceptions",
    "plugin:functional/external-recommended",
  ],
  rules: {
    "neverthrow/must-use-result": "error",
    "functional/no-method-signature": "off",
    "@typescript-eslint/prefer-readonly-parameter-types": "off"
  }
};
