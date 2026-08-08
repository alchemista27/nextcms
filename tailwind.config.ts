import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#454545",
        secondary: "#06bfa2",
        tertiary: "#0f7f6d",
        neutral: "#F7F8F8",
        surface: "#FFFFFF",
        border: "#E3E8E7",
        schoolPrimary: "var(--primary-color)",
        schoolSecondary: "var(--secondary-color)",
        schoolAccent: "#D4E9E2",
        schoolGraylight: "#F8F9FA",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
  ],
};
export default config;
