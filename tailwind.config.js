/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
       colors: {
         primaryText: '#1a1a1a', // couleur personnalisée
       },
    },
  },
  plugins: [],
};
