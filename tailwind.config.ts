import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#13211f",
        moss: "#355e4d",
        sand: "#f3ead7",
        clay: "#c96f42",
        lagoon: "#276f77",
      },
      boxShadow: {
        soft: "0 18px 60px rgba(19, 33, 31, 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
