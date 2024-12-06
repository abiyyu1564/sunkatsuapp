/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#F0F3F7",
        secondary: "#8E0808",
        tertiary: "#B70000"
      },
    },
  },
  plugins: [require("flowbite/plugin")],
};
