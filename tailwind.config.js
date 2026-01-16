/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Grounded Landscaping Brand Colors - Earthy greens and natural tones
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        earth: {
          50: '#faf5f0',
          100: '#f0e6d8',
          200: '#e0ccb0',
          300: '#cca97d',
          400: '#b8864e',
          500: '#a67038',
          600: '#8a5a2e',
          700: '#6e4726',
          800: '#5a3b22',
          900: '#4a3120',
        },
        bark: {
          50: '#f6f5f4',
          100: '#e7e5e2',
          200: '#d0ccc6',
          300: '#b3aca2',
          400: '#96897d',
          500: '#7b6e62',
          600: '#625850',
          700: '#504841',
          800: '#433d39',
          900: '#3b3532',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Montserrat', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
