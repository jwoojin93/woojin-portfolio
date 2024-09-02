import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        roboto: "var(--roboto-text)",
        rubick: "var(--rubick-text)",
        metallica: "var(--metallica-text)",
      },
      margin: {
        tomato: "120px",
      },
      borderRadius: {
        "sexy-name": "11.11px",
      },
      keyframes: {
        "mini-ping": {
          "75%, 100%": {
            transform: "scale(1.02)",
            opacity: "0",
          },
        },
      },
      animation: {
        "mini-ping": "mini-ping 1s cubic-bezier(0, 0, 0.2, 1) infinite",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
export default config;
