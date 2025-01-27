///** @type {import('tailwindcss').Config} */
/*export default {
  content: [
    "./index.html",
    "./src/**/ /*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
*/
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        pulse: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.05)" },
        },
      },

      animation: {
        pulse: "pulse 0.3s ease-in-out",
      },
    },
  },
  plugins: [],
};
