const { defineConfig, globalIgnores } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expoConfig,
  globalIgnores(["dist/*", ".expo/*", "node_modules/*", ".claude/*"]),
  {
    rules: {
      // Architecture: screens compose features; features must not reach into each other's internals.
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/features/*/*", "!@/features/*/components/*"],
              message: "Import a feature through its index (e.g. @/features/cart), not its internals.",
            },
          ],
        },
      ],
    },
  },
]);
