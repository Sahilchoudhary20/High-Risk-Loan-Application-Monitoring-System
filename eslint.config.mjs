// import eslint from "@eslint/js";
// import tseslint from "typescript-eslint";
// import tsParser from "@typescript-eslint/parser";

// export default tseslint.config(
//     {
//         ignores: [
//             "**/dist/*",
//             "**coverage/*",
//             "**.github/*",
//             "eslint.config.mjs",
//             "jest.config.ts",
//         ],
//     },
//     eslint.configs.recommended,
//     ...tseslint.configs.recommended,
//     {
//         languageOptions: {
//             parser: tsParser,
//             parserOptions: {
//                 project: "./tsconfig.json",
//                 tsconfigRootDir: import.meta.dirname,
//             },
//         },
//     },
//     {
//         files: ["./**/*.ts", "./**/*.tsx"],
//     },
//     {
//         rules: {
//             // Core focus: enforce types on variables, function return types, and parameters
//             "@typescript-eslint/explicit-function-return-type": "error", // Require return types on functions
//             "@typescript-eslint/no-unused-vars": "error", // Disallow unused variables
//             "@typescript-eslint/no-unused-vars": [
//                 "error",
//                 { argsIgnorePattern: "^_" }, // allow unused variables prefixed with underscore
//             ],
//             "@typescript-eslint/typedef": [
//                 "error",
//                 {
//                     parameter: true, // Require types for function parameters
//                     propertyDeclaration: true, // Require types for class properties
//                     variableDeclaration: true, // Require types for variables
//                     memberVariableDeclaration: true, // Require types for member variables
//                     variableDeclarationIgnoreFunction: true, // Ignore types for function variables
//                 },
//             ],
//             // Allow ES6 imports with CommonJS output
//             "@typescript-eslint/no-require-imports": "off",
//             "@typescript-eslint/no-var-requires": "off",
//         },
//     }
// );

// eslint.config.mjs
import js from "@eslint/js";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import path from "path";

const tsconfigRootDir = path.resolve(process.cwd());

export default [
  // base JS recommended rules
  js.configs.recommended,

  // TypeScript specific config & customizations
  {
    ignores: [
      "**/dist/*",
      "**/coverage/*",
      "**/.github/*",
      "eslint.config.mjs",
      "jest.config.ts",
      "node_modules/**"
    ],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: path.join(tsconfigRootDir, "tsconfig.json"),
        tsconfigRootDir,
        ecmaVersion: 2020,
        sourceType: "module"
      }
    },
    plugins: {
      "@typescript-eslint": tsPlugin
    },
    // recommended TS rules + your stricter choices
    extends: [
      "plugin:@typescript-eslint/recommended"
    ],
    rules: {
      // require explicit return types on exported functions and methods
      "@typescript-eslint/explicit-function-return-type": "error",

      // no unused vars (allow unused args that start with _)
      "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],

      // typedef to require typing in key places (this is strict)
      "@typescript-eslint/typedef": [
        "error",
        {
          "arrayDestructuring": false,
          "arrowParameter": false,
          "memberVariableDeclaration": true,
          "objectDestructuring": false,
          "parameter": true,
          "propertyDeclaration": true,
          "variableDeclaration": true,
          "variableDeclarationIgnoreFunction": true
        }
      ],

      // allow CommonJS style require if necessary
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/no-var-requires": "off",

      // small niceties
      "no-console": "off"
    },
    files: ["./**/*.ts", "./**/*.tsx"]
  }
];
