// tailwind.config.js
module.exports = {
  darkMode: 'class',
  content: [
    './components/**/*.{vue,js}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './app.vue'
  ],
  theme: {
    extend: {}
  },
  plugins: [require('@tailwindcss/typography')]
}
