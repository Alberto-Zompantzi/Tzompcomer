/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        shopifyGray: '#F6F6F6',
        shopifyText: '#121212',
        tzompAzul: '#0033A0',
        tzompDorado: '#D4AF37',
        tzompAzulOscuro: '#001A54',
      },
    },
  },
  plugins: [],
}
