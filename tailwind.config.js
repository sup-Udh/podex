/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#000000",
        card: "#121212",
        primary: "#8B5CF6",
        secondary: "#A855F7",
        text: "#FFFFFF",
        muted: "#8A8A8A",
      },
      fontFamily: {
        raleway: ["Raleway_400Regular"],
        "raleway-semibold": ["Raleway_600SemiBold"],
        "raleway-bold": ["Raleway_700Bold"],
      },
      boxShadow: {
        glass: "0 0 30px rgba(139,92,246,0.15)",
      },
    },
  },
  plugins: [],
};