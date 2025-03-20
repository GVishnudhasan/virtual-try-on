/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'custom-blue': '#8590ff',
      },
      screens: {
        'xl': '1280px',
        '2xl': '1536px',
        'qhd': '2000px',
        '2k': '2560px',
        '4k': '3840px',
      },
    },
  },
  plugins: [],
};
