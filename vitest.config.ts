import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: {
            "~": resolve(__dirname, "."),
            "#imports": resolve(__dirname, ".vitest/autoImports.ts"),
        },
    },
    test: {
        environment: "happy-dom",
        setupFiles: [".vitest/setup.ts"],
        exclude: ["node_modules/**"],
    },
});
