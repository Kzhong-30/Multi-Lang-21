/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        accent: {
          DEFAULT: "#e8723a",
        },
        mint: {
          DEFAULT: "#4a9e7d",
        },
        canvas: "#f8f5f0",
      },
      fontFamily: {
        ui: ['Sora', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 1px 0 rgba(15,17,21,0.04), 0 20px 40px -24px rgba(15,17,21,0.35)',
      },
    },
  },
  plugins: [],
};
