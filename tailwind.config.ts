import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#05050a",
        foreground: "#f5f5f7",
        accent: "#7c5cff",
      },
    },
  },
  plugins: [],
};
export default config;