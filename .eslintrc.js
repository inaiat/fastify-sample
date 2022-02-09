module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    "project": "./tsconfig.json"
  },
  plugins: ["@typescript-eslint", "functional"],
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
    "functional/no-method-signature": "off",
    "@typescript-eslint/prefer-readonly-parameter-types": "off"
  }
};
