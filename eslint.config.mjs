import globals from "globals";
import { defineConfig, globalIgnores } from "eslint/config";
import pluguinJs from "@eslint/js";
import stylistic from "@stylistic/eslint-plugin";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      parserOptions: {
        sourceType: "module",
        ecmaVersion: "latest",
      },
      globals: {
        ...globals.node,
        console: "readonly", // Explicitly define console as a global variable
      },
    },
    rules: {
      "no-console": "warn", // Warn about console statements
      "eqeqeq": "error", // Enforce strict equality
      "curly": "error", // Require following curly brace conventions
      "no-var": "warn", // Disallow using var
      "no-unused-vars": "warn", // Warn about unused variables
      "arrow-body-style": ["error", "always"], // Disable arrow body style
    },
    // ignores: ["node_modules/*", ".vscode/*", ".git/*", ".env", ".env_sample", "LISCENSE", "README.md", "package.json", "package-lock.json", ".github/*", ".gitignore", ".husky/*"],
  },
  pluguinJs.configs.recommended,
  stylistic.configs.customize({
    // the following options are the default values
    indent: 2,
    quotes: "double",
    semi: true,
    // ...
  }),
  globalIgnores(["node_modules/", ".vscode/", ".git/", ".env", ".env_sample", "LISCENSE", "README.md", "package.json", "package-lock.json", ".github/", ".gitignore", ".husky/"]),
]);
