/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {},
    fontFamily: {
      openSans: ["Open Sans", "sans-serif"],
    },
    screens: {
      md: "760px",
      lg: "1070px"
    },
  },
  plugins: [],
};
