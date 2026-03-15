import type { Config } from "tailwindcss"

export default <Config>{
    content: [],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: "#eefbf3",
                    300: "#7cd9a8",
                    400: "#2fc472",
                    500: "#1fad60",
                    600: "#138c4d",
                    700: "#0f7040",
                },
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
                    200: "#cbddeb",
                },
            },
            fontFamily: {
                sans: ["Inter", "system-ui", "sans-serif"],
                display: ["Georgia", "serif"],
            },
            borderRadius: {
                "4xl": "2rem",
            },
        },
    },
}
