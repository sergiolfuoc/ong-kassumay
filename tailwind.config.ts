import type { Config } from "tailwindcss"

export default <Config>{
    content: [],
    theme: {
        extend: {
            colors: {
                primary: {
                    300: "#7cd9a8",
                    400: "#2fc472",
                },
                earth: {
                    300: "#94adc7",
                    400: "#6b8aad",
                    500: "#4f6f94",
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
        },
    },
}
