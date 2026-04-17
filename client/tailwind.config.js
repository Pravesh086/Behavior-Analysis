/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#020617",
        },
        accent: {
          400: "#22d3ee",
          500: "#06b6d4",
        },
      },
      boxShadow: {
        soft: "0 10px 30px rgba(2, 6, 23, 0.25)",
        panel: "0 24px 60px rgba(2, 6, 23, 0.32)",
      },
      backgroundImage: {
        grid: "radial-gradient(circle at 1px 1px, rgba(148, 163, 184, 0.14) 1px, transparent 0)",
      },
    },
  },
  plugins: [],
};
