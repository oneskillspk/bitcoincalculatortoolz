import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

// Heading-size guardrail: forbid raw text-3xl…7xl on <h1|h2|h3|h4>.
// Authors must use semantic .text-display / .text-h1 / .text-h2 / .text-h3
// utilities defined in src/index.css.
const HEADING_SIZE_SELECTOR =
  "JSXOpeningElement[name.name=/^h[1-4]$/] JSXAttribute[name.name='className'] Literal[value=/\\btext-(3xl|4xl|5xl|6xl|7xl)\\b/]";
const HEADING_SIZE_TEMPLATE_SELECTOR =
  "JSXOpeningElement[name.name=/^h[1-4]$/] JSXAttribute[name.name='className'] TemplateElement[value.raw=/\\btext-(3xl|4xl|5xl|6xl|7xl)\\b/]";
const HEADING_SIZE_MESSAGE =
  "Use the semantic type ramp (.text-display, .text-h1, .text-h2, .text-h3) instead of raw text-3xl/4xl/5xl/6xl/7xl on heading elements. See src/index.css.";

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "@typescript-eslint/no-unused-vars": "off",
      "no-restricted-syntax": [
        "warn",
        { selector: HEADING_SIZE_SELECTOR, message: HEADING_SIZE_MESSAGE },
        { selector: HEADING_SIZE_TEMPLATE_SELECTOR, message: HEADING_SIZE_MESSAGE },
      ],
    },
  },
  {
    // Allow-list: primitives, brand H2, hero H1, PDF export reports.
    files: [
      "src/components/ui/typography.tsx",
      "src/pages/TypographyPreview.tsx",
      "src/components/Footer.tsx",
      "src/components/about/AboutHeroSection.tsx",
      "src/components/retirement/RetirementExportReport.tsx",
      "src/components/tax-calculator/TaxExportShare.tsx",
    ],
    rules: { "no-restricted-syntax": "off" },
  },
);

