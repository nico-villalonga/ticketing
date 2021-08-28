const path = require("path");

module.exports = {
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "prettier", "import"],
  rules: {
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        args: "after-used",
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
      },
    ],
    "no-empty": ["error", { allowEmptyCatch: true }],
    "no-var": "error",
    "no-console": ["warn", { allow: ["warn", "error"] }],
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "prettier/prettier": "error",
    "@typescript-eslint/no-use-before-define": "off",
    "@typescript-eslint/no-var-requires": "off",
    "@typescript-eslint/ban-ts-ignore": "off",
    "@typescript-eslint/camelcase": "off",
    "import/order": [
      "error",
      {
        "newlines-between": "always",
        pathGroupsExcludedImportTypes: ["react"],
        groups: ["builtin", "external", "internal"],
        alphabetize: {
          order: "asc",
          caseInsensitive: true,
        },
      },
    ],
  },
  settings: {
    "import/resolver": {
      node: {
        paths: [path.resolve(__dirname, "src")],
      },
    },
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier/@typescript-eslint",
    "plugin:import/errors",
    "plugin:import/typescript",
    "prettier",
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  env: {
    es6: true,
    node: true,
  },
  globals: {
    module: "writable",
    process: "readonly",
    exports: "readonly",
  },
};
