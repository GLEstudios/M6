const { fontFamily } = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Montserrat", "var(--font-inter)", ...fontFamily.sans],
      },
      colors: {
        primary: '#33455d',
        "brand-purple": "#6851ff",
        "brand-purple-text": "#522FD4",
        "brand-purple-light": "#EDEBFF",
        "brand-ink": "#18171A",
        "custom-blue-light": "#33455d",
        "custom-blue": "#3a4559",
      },
      backgroundColor: {
        "custom-blue": '#3a4559',
        "custom-blue-light": "#33455d",
      },
      borderColor: {
        primary: '#3a4559',
      },
      textColor: {
        primary: '#3a4559',
      },
      boxShadow: {
        brand: "8 8px 48px rgba(24, 23, 26, .2)",
      },
      screens: {
        "custom-breakpoint-500": { max: "500px" }
      },
    },
  },
  variants: {},
  plugins: [],
};
