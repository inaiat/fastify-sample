module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "functional"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "plugin:functional/no-mutations",
    "plugin:functional/stylistic",
    "plugin:functional/no-object-orientation",
    "plugin:functional/no-exceptions",
  ],
  rules: {
    "functional/no-method-signature": "off"
  }
};
