module.exports = {
  content: [
    "./src/**/*.{html,js,ts,jsx,tsx}",
    "app/**/*.{ts,tsx}",
    "components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#146EF5",
          secondary: "#553FFE",
        },
        accentPrimary1: "#020202",
        accentPrimary2: "#191921",
        neutral: {
          100: "#FFFFFF",
          200: "#ECECEE",
          300: "#BCBCBC",
          400: "#9B9BA6",
          500: "#676774",
          600: "#4F4F59",
          700: "#151518",
          800: "#020202",
        },
        action: {
          interactiveBlue: "#3898EC",
        },
        status: {
          blue: { 700: "#086CD9", 600: "#1D88FE", 300: "#8FC3FF", 100: "#EAF4FF" },
          green: { 700: "#11845B", 600: "#05C168", 300: "#7FDCA4", 100: "#DEF2E6" },
          red: { 700: "#DC2B2B", 600: "#FF5A65", 300: "#FFBEC2", 100: "#FFEFF0" },
          orange: { 700: "#D5691B", 600: "#FF9E2C", 300: "#FFD19B", 100: "#FFF3E4" },
        },
      },
      fontFamily: {
        sans: ["IBM Plex Sans", "Inter", "system-ui", "Segoe UI", "Arial", "sans-serif"],
        display: ["Inter", "IBM Plex Sans", "system-ui", "Segoe UI", "Arial", "sans-serif"],
      },
      borderRadius: {
        none: "0px",
        sm: "4px",
        DEFAULT: "6px",
        lg: "6px",
      },
    },
    container: { center: true, padding: "2rem", screens: { "2xl": "1400px" } },
  },
  plugins: [],
  darkMode: ["class"],
};
