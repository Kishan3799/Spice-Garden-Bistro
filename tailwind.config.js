/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      "colors": {
              "on-surface": "#1e1b16",
              "inverse-on-surface": "#f7f0e6",
              "on-primary-fixed": "#390c00",
              "primary": "#942e02",
              "secondary-fixed": "#ffddae",
              "error": "#ba1a1a",
              "secondary-fixed-dim": "#f5bd64",
              "surface-dim": "#e0d9d0",
              "on-error-container": "#93000a",
              "tertiary": "#005685",
              "on-primary": "#ffffff",
              "primary-fixed": "#ffdbd0",
              "on-secondary-container": "#775000",
              "surface-container-low": "#faf3e9",
              "secondary": "#7f5600",
              "tertiary-container": "#006faa",
              "surface-container": "#f4ede3",
              "outline": "#8b7169",
              "background": "#fff8f0",
              "on-surface-variant": "#58423b",
              "on-background": "#1e1b16",
              "on-primary-fixed-variant": "#832600",
              "on-error": "#ffffff",
              "primary-container": "#b5451b",
              "tertiary-fixed": "#cde5ff",
              "on-secondary": "#ffffff",
              "surface-variant": "#e8e2d8",
              "outline-variant": "#dfc0b6",
              "surface-container-high": "#eee7dd",
              "on-tertiary": "#ffffff",
              "surface-bright": "#fff8f0",
              "on-tertiary-fixed-variant": "#004b74",
              "inverse-surface": "#33302a",
              "surface-tint": "#a63b10",
              "surface-container-highest": "#e8e2d8",
              "inverse-primary": "#ffb59d",
              "surface": "#fff8f0",
              "surface-container-lowest": "#ffffff",
              "error-container": "#ffdad6",
              "secondary-container": "#fec56b",
              "on-secondary-fixed": "#281800",
              "on-primary-container": "#ffe4dc",
              "primary-fixed-dim": "#ffb59d",
              "tertiary-fixed-dim": "#94ccff",
              "on-tertiary-container": "#dcecff",
              "on-secondary-fixed-variant": "#604100",
              "on-tertiary-fixed": "#001d32"
      },
      "borderRadius": {
              "DEFAULT": "0.125rem",
              "lg": "0.25rem",
              "xl": "0.5rem",
              "full": "0.75rem"
      },
      "fontFamily": {
              "headline": [
                      "Noto Serif", "serif"
              ],
              "body": [
                      "Be Vietnam Pro", "sans-serif"
              ],
              "label": [
                      "Be Vietnam Pro", "sans-serif"
              ]
      }
    },
  },
  plugins: [],
}
