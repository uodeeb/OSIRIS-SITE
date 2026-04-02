/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'osiris-gold': '#c9a96e',
        'osiris-blue': '#1e3a8a',
        'osiris-green': '#22c55e',
        'osiris-purple': '#6b21a8',
        'osiris-red': '#dc2626',
        'osiris-dark': '#0a0a0a',
        'osiris-darker': '#050505',
        'osiris-surface': '#111111',
        'osiris-border': '#1a1a1a',
        'osiris-text': '#e5e5e5',
        'osiris-text-dim': '#888888',
        'osiris-accent': '#c9a96e',
      },
      fontFamily: {
        'arabic': ['Segoe UI', 'Tahoma', 'Arial', 'Noto Sans Arabic', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
