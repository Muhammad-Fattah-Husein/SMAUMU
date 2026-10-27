/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Indonesian Civic-Tech Strict Theme
        primary: {
          DEFAULT: '#CE1126',
          hover: '#b20e1f',
          dark: '#8a0a18',
          light: '#fdf2f2',
        },
        accent: {
          DEFAULT: '#FFC000',
          hover: '#e5ac00',
          dark: '#b38600',
          light: '#fffbeb',
        },
        surface: '#FFFFFF',
        base: '#F8F9FA',

        // Explicit brand tokens
        'smaumu-primary': '#CE1126',
        'smaumu-accent': '#FFC000',
        'smaumu-surface': '#FFFFFF',
        'smaumu-base': '#F8F9FA',
      },
      fontFamily: {
        heading: ['"Plus Jakarta Sans"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 10px -2px rgba(0, 0, 0, 0.05), 0 1px 4px -1px rgba(0, 0, 0, 0.03)',
        'card-hover': '0 12px 24px -6px rgba(206, 17, 38, 0.12), 0 4px 8px -2px rgba(0, 0, 0, 0.04)',
      },
    },
  },
  plugins: [],
};
