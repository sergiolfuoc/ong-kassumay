import { defineConfig } from "vitest/config";
import { resolve } from "path";

export default defineConfig({
    resolve: {
        alias: {
            "~": resolve(__dirname, "."),
            "#imports": resolve(__dirname, ".vitest/autoImports.ts"),
        },
    },
    test: {
        environment: "happy-dom",
        setupFiles: [".vitest/setup.ts"],
    },
});
