import type { Config } from "tailwindcss"

export default <Config>{
    content: [],
    theme: {
        extend: {
            colors: {
                // Green
                primary: {
                    50: "#eefbf3",
                    300: "#7cd9a8",
                    400: "#2fc472",
                    500: "#1fad60",
                    600: "#138c4d",
                    700: "#0f7040",
                    950: "#0a4f2b",
                },
                emerald: {
                    950: "#022c22",
                },
                // Colores de kassumay
                kassumay: {
                    400: "#c2b84a",
                    500: "#bdb449",
                    800: "#a6983f",
                    900: "#7c6e2b",
                    950: "#6b5e1a",
                },
                // Blue
                earth: {
                    50: "#f0f4f8",
                    100: "#dce4ed",
                    200: "#bfcede",
                    300: "#94adc7",
                    400: "#6b8aad",
                    500: "#4f6f94",
                    600: "#3f5a7d",
                    700: "#374b66",
                    800: "#314056",
                    900: "#2c3849",
                    950: "#1a2332",
                },
                warm: {
                    100: "#fef2e8",
                    200: "#cbddeb",
                },
            },
            fontFamily: {
                sans: ["Inter", "system-ui", "sans-serif"],
                display: ["Satoshi", "system-ui", "sans-serif"],
            },
            borderRadius: {
                "4xl": "2rem",
            },
        },
    },
}
