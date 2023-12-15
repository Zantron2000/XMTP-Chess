/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'checker1': '#B0D459',
        'checker2': '#A8CE52',
        'foreground': '#5E8839',
        'header': '#507330',
        'primary-button': '#88B452',
        'primary-button-hover': '#7eaa48',
        'input': '#507330',
      }
    },
  },
  plugins: [],
}
