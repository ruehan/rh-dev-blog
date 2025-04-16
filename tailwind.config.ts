import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
        },
        pastel: {
          pink: "#f9dce7",
          blue: "#d9f0fc",
          green: "#e0f5e9",
          yellow: "#fdf3d8",
          purple: "#ede4fb",
          coral: "#ffe6e0",
        },
        gray: {
          50: "#f9fafb",
          100: "#f3f4f6",
          200: "#e5e7eb",
          300: "#d1d5db",
          400: "#9ca3af",
          500: "#6b7280",
          600: "#4b5563",
          700: "#374151",
          800: "#1f2937",
          900: "#111827",
        }
      },
      typography: (theme: any) => ({
        DEFAULT: {
          css: {
            color: theme('colors.gray.700'),
            a: {
              color: theme('colors.primary.500'),
              '&:hover': {
                color: theme('colors.primary.600'),
              },
            },
            h1: {
              color: theme('colors.gray.800'),
              fontWeight: '700',
            },
            h2: {
              color: theme('colors.gray.800'),
              fontWeight: '600',
            },
            h3: {
              color: theme('colors.gray.800'),
              fontWeight: '600',
            },
            h4: {
              color: theme('colors.gray.800'),
              fontWeight: '600',
            },
            code: {
              color: theme('colors.primary.600'),
              backgroundColor: theme('colors.pastel.blue'),
              padding: '0.25rem',
              borderRadius: '0.25rem',
              fontWeight: '400',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
            pre: {
              backgroundColor: theme('colors.gray.800'),
              color: theme('colors.gray.100'),
              borderRadius: '0.5rem',
            },
            blockquote: {
              borderLeftColor: theme('colors.pastel.blue'),
              color: theme('colors.gray.600'),
            },
          },
        },
        dark: {
          css: {
            color: theme('colors.gray.300'),
            a: {
              color: theme('colors.primary.400'),
              '&:hover': {
                color: theme('colors.primary.300'),
              },
            },
            h1: {
              color: theme('colors.gray.100'),
            },
            h2: {
              color: theme('colors.gray.100'),
            },
            h3: {
              color: theme('colors.gray.100'),
            },
            h4: {
              color: theme('colors.gray.100'),
            },
            code: {
              color: theme('colors.primary.400'),
              backgroundColor: theme('colors.gray.800'),
            },
            pre: {
              backgroundColor: theme('colors.gray.900'),
              color: theme('colors.gray.100'),
            },
            blockquote: {
              borderLeftColor: theme('colors.primary.500'),
              color: theme('colors.gray.400'),
            },
          },
        },
      }),
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
          "Noto Color Emoji",
        ],
      },
      spacing: {
        '128': '32rem',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '2rem',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography')
  ],
} satisfies Config;
