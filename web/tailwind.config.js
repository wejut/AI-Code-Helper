import typography from '@tailwindcss/typography'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#14120f',
          900: '#1c1915',
          700: '#3f3832',
          500: '#6b6258',
        },
        paper: {
          50: '#f7f4ee',
          100: '#f3efe6',
          200: '#e7e0d4',
        },
        clay: {
          500: '#c4552a',
          600: '#a8431e',
        },
      },
      fontFamily: {
        sans: ['"Segoe UI"', '"PingFang SC"', '"Microsoft YaHei"', 'sans-serif'],
        serif: ['Georgia', '"Palatino Linotype"', 'Palatino', 'serif'],
        mono: ['"Cascadia Code"', 'Consolas', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        dock: '0 12px 40px rgba(28, 25, 21, 0.08)',
      },
    },
  },
  plugins: [typography],
}
