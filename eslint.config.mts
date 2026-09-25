import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores([
    "node_modules",
    "dist",
    "coverage",
    "build",
    "out",
    "public",
    "docs",
  ]),
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.browser }
  },
  ...tseslint.configs.recommended,

  // Custom Rules Override
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    rules: {
      "preserve-caught-error": "off",
      "@typescript-eslint/no-explicit-any": "off", // Turned off the 'any' checks
      "no-empty": "off",                            // Turned off empty catch/block checks
      "@typescript-eslint/no-unused-vars": "off",   // Turned off unused variable errors
    },
  },
]);
