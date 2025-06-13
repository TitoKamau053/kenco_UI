/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        primary: {
          50: 'var(--color-primary-50)',
          100: 'var(--color-primary-100)',
          200: 'var(--color-primary-200)',
          300: 'var(--color-primary-300)',
          400: 'var(--color-primary-400)',
          500: 'var(--color-primary-500)',
          600: 'var(--color-primary-600)',
          700: 'var(--color-primary-700)',
          800: 'var(--color-primary-800)',
          900: 'var(--color-primary-900)',
          950: 'var(--color-primary-950)',
        },
        secondary: {
          50: 'var(--color-secondary-50)',
          100: 'var(--color-secondary-100)',
          200: 'var(--color-secondary-200)',
          300: 'var(--color-secondary-300)',
          400: 'var(--color-secondary-400)', 
          500: 'var(--color-secondary-500)',
          600: 'var(--color-secondary-600)',
          700: 'var(--color-secondary-700)',
          800: 'var(--color-secondary-800)',
          900: 'var(--color-secondary-900)',
          950: 'var(--color-secondary-950)',
        },
        // Add specific dark mode text color utility
        darkText: {
          DEFAULT: '#ffffff',
          muted: '#e2e8f0',
        },
        darkBg: {
          card: 'var(--card)',
          page: 'var(--background)',
          accent: 'var(--accent)',
          // Add more purple-toned dark backgrounds
          deep: '#1a103b',
          DEFAULT: '#2d1b47',
          light: '#3d2a5a',
          lighter: '#4a3365',
        },
      },
      textColor: {
        skin: {
          base: 'var(--foreground)',
          muted: 'var(--muted-foreground)',
        }
      },
      backgroundColor: {
        dark: {
          DEFAULT: '#2d1b47', // Main dark background (dark purple)
          lighter: '#3d2a5a', // Lighter dark purple for contrast elements
          card: '#261a36', // Card backgrounds
          hover: '#4a3365', // Hover state
          active: '#5a3d78', // Active state
        }
      },
    },
  },
  plugins: [],
};
