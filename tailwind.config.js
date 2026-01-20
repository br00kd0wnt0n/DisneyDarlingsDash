/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-pink': '#E91E8C',
        'primary-cyan': '#00C0E8',
        'accent-yellow': '#FFD700',
        'background-cream': '#FFF8E7',
        'background-light-blue': '#E8F6FA',
        'text-dark': '#333333',
        'text-pink': '#D81B7A',
        'source-client': '#22c55e',
        'source-industry': '#3b82f6',
        'source-ralph': '#a855f7',
      },
      fontFamily: {
        'rounded': ['system-ui', '-apple-system', 'SF Pro Rounded', 'Nunito', 'sans-serif'],
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
}
