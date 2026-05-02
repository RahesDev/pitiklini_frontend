/** @type {import('tailwindcss').Config} */
module.exports = {
  important: true,
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    fontFamily: {
      sans: ["IBM Plex Sans", "sans-serif"],
    },
    extend: {
      colors: {
        // Custom color names based on your requirements
        primary: "#BD7F10",
        secondary: "#FCFCFD",
        black: "#18191D",
        gray: "#23262F",
        secondary10: "#B1B5C3",

        // Background with opacity (black at 50%)
        // You can use 'background' as a key name
        background: "rgba(0, 0, 0, 0.5)",

        // Custom semantic colors
        "green-custom": "#2FA766",
        "red-custom": "#E2464A",
      },
      fontFamily: {
        ibm: ["IBM Plex Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
};
