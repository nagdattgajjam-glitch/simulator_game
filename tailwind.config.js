/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        coffee: {
          50: "#f9f5f1",
          100: "#f3ebe2",
          200: "#e4d3c2",
          300: "#d4b49b",
          400: "#c49674",
          500: "#a67755",
          600: "#80593f",
          700: "#5b3d2a",
          800: "#3c281b",
          900: "#24170e"
        }
      }
    }
  },
  plugins: []
};
