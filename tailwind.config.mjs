/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        notion: {
          bg: '#f6f3ec',
          'bg-dark': '#111314',
          gray: '#ebe6db',
          'gray-dark': '#1a1d1f',
          text: '#1c1915',
          'text-dark': '#e8e4dc',
          border: '#d8d2c6',
          'border-dark': '#2a2e32',
          blue: '#9a7048',
          'blue-light': '#f0e6d6',
          yellow: '#fef3c7',
          orange: '#ffedd5',
          red: '#fee2e2',
          green: '#d1fae5',
          purple: '#ede9fe',
        },
      },
      fontFamily: {
        sans: ['IBM Plex Sans', 'system-ui', 'sans-serif'],
        mono: ['IBM Plex Mono', 'ui-monospace', 'monospace'],
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
              backgroundColor: theme('colors.notion.gray'),
              color: theme('colors.notion.text'),
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
            pre: {
              backgroundColor: theme('colors.notion.gray-dark'),
              color: theme('colors.notion.text-dark'),
            },
          },
        },
      }),
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
