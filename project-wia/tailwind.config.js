/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#2563EB',
          600: '#2563EB',
          700: '#1E3A8A',
          800: '#1E3A8A',
          900: '#1E3A8A',
          950: '#172554',
        },
        slate: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#1E3A8A',
          950: '#172554',
        },
        navy: {
          DEFAULT: '#1E3A8A',
          800: '#1E3A8A',
          900: '#1E3A8A',
          950: '#172554',
        },
        royal: {
          DEFAULT: '#2563EB',
          500: '#2563EB',
          600: '#2563EB',
          700: '#1E3A8A',
        },
        pink: {
          DEFAULT: '#EC4899',
          400: '#EC4899',
          500: '#EC4899',
          600: '#DB2777',
          700: '#DB2777',
        },
        civic: {
          bg: '#F8FAFC',
          card: '#FFFFFF',
          navy: '#1E3A8A',
          royal: '#2563EB',
          pink: '#EC4899',
          magenta: '#DB2777',
          slate: '#64748B',
          emerald: '#10B981',
        },
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#2563EB',
          600: '#1E3A8A',
          700: '#1E3A8A',
          800: '#1E3A8A',
          900: '#172554',
          950: '#0f172a',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      animation: {
        'pulse-fast': 'pulse 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
