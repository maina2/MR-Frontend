/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        'modern-orange': '#F97316',
        'modern-green': '#22C55E',
        'modern-dark': '#1F2937',
        'modern-light': '#F3F4F6',
        'modern-blue': '#3B82F6',
      },
    },
  },
  plugins: [],
}