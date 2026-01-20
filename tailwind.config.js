/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-pink': '#E88BAD',
        'primary-cyan': '#6DD3E3',
        'accent-yellow': '#F7D65A',
        'accent-coral': '#F5A3B7',
        'background-cream': '#FFF8F0',
        'background-light-blue': '#E8F6FA',
        'background-light-pink': '#FFF0F5',
        'text-dark': '#333333',
        'text-pink': '#D97B9C',
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
