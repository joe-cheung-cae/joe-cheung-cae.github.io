/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        notion: {
          bg: '#ffffff',
          'bg-dark': '#191919',
          gray: '#f5f5f5',
          'gray-dark': '#2f2f2f',
          text: '#37352f',
          'text-dark': '#e3e2e0',
          border: '#e3e2e0',
          'border-dark': '#444444',
          blue: '#2eaadc',
          'blue-light': '#e7f3f8',
          yellow: '#fef3c7',
          orange: '#ffedd5',
          red: '#fee2e2',
          green: '#d1fae5',
          purple: '#ede9fe',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.notion.text'),
            a: {
              color: theme('colors.notion.blue'),
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline',
              },
            },
            code: {
              color: theme('colors.notion.text'),
              backgroundColor: theme('colors.notion.gray'),
              padding: '0.2em 0.4em',
              borderRadius: '0.25rem',
              fontWeight: '400',
            },
            'code::before': {
              content: 'none',
            },
            'code::after': {
              content: 'none',
            },
            pre: {
              backgroundColor: '#1e1e1e',
              color: '#d4d4d4',
            },
          },
        },
        dark: {
          css: {
            color: theme('colors.notion.text-dark'),
            a: {
              color: theme('colors.notion.blue'),
            },
            code: {
              color: theme('colors.notion.text-dark'),
              backgroundColor: theme('colors.notion.gray-dark'),
            },
            h1: {
              color: theme('colors.notion.text-dark'),
            },
            h2: {
              color: theme('colors.notion.text-dark'),
            },
            h3: {
              color: theme('colors.notion.text-dark'),
            },
            h4: {
              color: theme('colors.notion.text-dark'),
            },
            strong: {
              color: theme('colors.notion.text-dark'),
            },
          },
        },
      }),
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
