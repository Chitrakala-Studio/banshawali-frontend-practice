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
      colors: {
        book: {
          primary: "#2E4568",
          surface: "#A6C8A5", // card & popup backgrounds
          accent: "#E9D4B0", // CTA buttons, highlights, alerts
          neutral: "#B9BAC3", // table & form backgrounds
          muted: "#AAABAC", // borders, disabled elements, secondary text
        },
      },

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
