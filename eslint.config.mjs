import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";


/** @type {import('eslint').Linter.Config[]} */
export default [
  { 
    ignores: [
      "node_modules",
      "dist",
      "statics",
      "coverage",
      "logs"
    ],
    files: ["src/**/*.ts"],
  },
  { 
    languageOptions: { 
      globals: globals.browser 
    },
    rules: {
      "semi": ["error", "always"],
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "no-undef": "off"
    }
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
];