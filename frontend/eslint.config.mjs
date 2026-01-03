import js from "@eslint/js";
import nextPlugin from "@next/eslint-plugin-next";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import tseslint from "typescript-eslint";

const sharedLanguage = {
  ecmaVersion: 2023,
  sourceType: "module",
  globals: {
    ...globals.browser,
    ...globals.node,
  },
};

const sharedRules = {
  ...nextPlugin.configs["core-web-vitals"].rules,
  "react-hooks/rules-of-hooks": "off",
  "react-hooks/exhaustive-deps": "off",
  "@typescript-eslint/prefer-nullish-coalescing": "off",
  "@typescript-eslint/consistent-type-definitions": "off",
  "@typescript-eslint/no-unused-vars": "off",
  "@typescript-eslint/no-explicit-any": "off",
  "@typescript-eslint/array-type": "off",
  "@typescript-eslint/no-empty-function": "off",
  "@typescript-eslint/no-unused-expressions": "off",
  "no-unused-expressions": "off",
  "no-useless-escape": "off",
  "prefer-const": "off",
};

export default tseslint.config(
  {
    ignores: ["node_modules/**", ".next/**", "out/**", "build/**", "next-env.d.ts"],
  },
  {
    files: ["**/*.{ts,tsx}"],
    extends: [js.configs.recommended, ...tseslint.configs.recommended, ...tseslint.configs.stylistic],
    languageOptions: sharedLanguage,
    plugins: {
      "@next/next": nextPlugin,
      "react-hooks": reactHooks,
    },
    rules: sharedRules,
  },
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: sharedLanguage,
    plugins: {
      "@next/next": nextPlugin,
      "react-hooks": reactHooks,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...sharedRules,
    },
  }
);
