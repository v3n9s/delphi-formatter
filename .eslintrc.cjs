/**
 * @type {import('eslint').Linter.Config}
 */
module.exports = {
  root: true,
  env: {
    node: true,
  },
  ignorePatterns: ["/dist"],
  overrides: [
    {
      files: ["*.ts"],
      extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-type-checked",
        "plugin:prettier/recommended",
      ],
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: __dirname,
      },
      rules: {
        "no-extra-boolean-cast": ["off"],
        "@typescript-eslint/no-misused-promises": [
          "error",
          {
            checksConditionals: true,
            checksVoidReturn: false,
            checksSpreads: true,
          },
        ],
        "@typescript-eslint/explicit-function-return-type": [
          "error",
          {
            allowExpressions: true,
          },
        ],
        "@typescript-eslint/strict-boolean-expressions": ["error"],
      },
    },
  ],
};
