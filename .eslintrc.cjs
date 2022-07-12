module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2022,
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
    "plugin:functional/no-exceptions",
    "plugin:functional/external-recommended",
  ],
  rules: {
    "@typescript-eslint/no-floating-promises": "error",
    'neverthrow/must-use-result': 'error',
    "functional/no-method-signature": "off",
    "@typescript-eslint/prefer-readonly-parameter-types": "off",
    "functional/prefer-readonly-type": "off"
  },
  overrides: [
    {
      files: "./test/**/*.ts",
      parserOptions: {
        "project": "./tsconfig.test.json"
      },
      rules: {
        "@typescript-eslint/no-floating-promises": "error",
        'neverthrow/must-use-result': 'off',
        "functional/no-method-signature": "off",
        "@typescript-eslint/prefer-readonly-parameter-types": "off",
        "functional/prefer-readonly-type": "off",
        "functional/immutable-data": "off"
      }
    }

  ]
};
