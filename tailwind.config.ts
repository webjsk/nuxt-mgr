// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
  ],

  // 暗黑模式配置
  darkMode: "class",

  theme: {
    extend: {
      // 自定义颜色
      colors: {
        primary: {
          DEFAULT: "#409eff",
          50: "#ecf5ff",
          100: "#d9ecff",
          200: "#b3d8ff",
          300: "#8cc5ff",
          400: "#66b1ff",
          500: "#409eff",
          600: "#337ecc",
          700: "#2a5fad",
          800: "#1d4589",
          900: "#102f6d",
        },
      },
    },
  },
  plugins: [],
};
