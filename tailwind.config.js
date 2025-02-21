/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}","./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily:{
        rubik:['Rubik-Regular','sans-serif'],
        "rubik-bold":["Rubik-Bold",'sans-serif'],
        "rubik-extrabold":["Rubik-ExtraBold",'sans-serif'],
        "rubik-meduim":["Rubik-medium",'sans-serif'],
        "rubik-semibold":["Rubik-SemiBold",'sans-serif'],
        "rubik-light":["Rubik-Light",'sans-serif'],
      }
    },
  },
  plugins: [],
}