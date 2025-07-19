import defaultTheme from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.{ts,tsx,js,jsx}"], // adjust paths
  theme: {
    extend: {
      colors: {
        background: "oklch(0.1 0 0)",
        foreground: "oklch(0.145 0 0)",
        // add other CSS vars if needed
      },
    },
  },
  plugins: [],
};