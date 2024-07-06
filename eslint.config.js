// @ts-check
import path from "node:path";
import url from "node:url";
import tseslint from "typescript-eslint";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

export default tseslint.config({
  files: ["src/**/*.ts", "eslint.config.js"],
  languageOptions: {
    parserOptions: {
      project: "./tsconfig.json",
      tsconfigRootDir: path.dirname(url.fileURLToPath(import.meta.url)),
    },
  },
  extends: [
    ...tseslint.configs.recommendedTypeChecked,
    eslintPluginPrettierRecommended,
  ],
  rules: {
    "@typescript-eslint/no-misused-promises": [
      "error",
      { checksVoidReturn: false },
    ],
    "@typescript-eslint/explicit-function-return-type": [
      "error",
      { allowExpressions: true },
    ],
    "@typescript-eslint/strict-boolean-expressions": ["error"],
  },
});
