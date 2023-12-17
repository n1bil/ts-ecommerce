module.exports = {
    env: {
        es2016: true,
        node: true,
    },
    extends: ["eslint:recommend", "plugin:@typescript-eslint/recommended"],
    parcer: "@typescript-esling/parcer",
    parcerOption: {
        ecmaVersion: "es2016",
        sourceType: "module",
    },
    plugins: ["@typescript-eslint"],
};
