/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f6f2',
          100: '#d9e8dd',
          200: '#b8d6ba',
          300: '#8cbf91',
          400: '#5a7d67',
          500: '#3d6e4e',
          600: '#2d5639',
          700: '#1f3a28',
          800: '#152818',
          900: '#0d1810',
        },
        secondary: '#5a7d67',
        accent: '#9fb8a8',
        destructive: '#c73e1d',
        'status': {
          'planted': '#8b7355',
          'growing': '#5a7d67',
          'ready': '#d4a574',
          'harvested': '#3d6e4e',
          'at-risk': '#c73e1d',
        }
      },
      fontFamily: {
        display: ['Crimson Pro', 'serif'],
        body: ['DM Sans', 'sans-serif'],
      },
      fontSize: {
        'display': ['2rem', { lineHeight: '1.2' }],
        'headline': ['1.5rem', { lineHeight: '1.3' }],
        'subtitle': ['1.125rem', { lineHeight: '1.4' }],
        'body': ['0.9375rem', { lineHeight: '1.5' }],
        'caption': ['0.8125rem', { lineHeight: '1.4' }],
      },
      borderRadius: {
        'xs': '0.375rem',
        'sm': '0.5rem',
        'md': '0.75rem',
        'lg': '1rem',
        'xl': '1.25rem',
      },
      boxShadow: {
        'xs': '0 1px 2px rgba(0, 0, 0, 0.05)',
        'sm': '0 2px 4px rgba(0, 0, 0, 0.07)',
        'md': '0 4px 8px rgba(61, 110, 78, 0.1)',
        'lg': '0 8px 16px rgba(45, 62, 58, 0.08)',
      }
    },
  },
  plugins: [],
}
