/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        perspective: {
          '1500': '1500px',
        },
      },
    },
    plugins: [],
  }