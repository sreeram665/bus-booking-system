/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#14213d",
        brand: {
          50: "#fff7ed",
          100: "#ffedd5",
          500: "#d97706",
          700: "#9a3412"
        },
        ocean: {
          50: "#eff6ff",
          100: "#dbeafe",
          600: "#2563eb",
          700: "#1d4ed8",
          900: "#0f4c81"
        }
      },
      boxShadow: {
        travel: "0 18px 45px rgba(20, 33, 61, 0.14)",
        ticket: "0 24px 60px rgba(15, 76, 129, 0.18)"
      },
      backgroundImage: {
        'hero-grid': "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)"
      }
    }
  },
  plugins: []
};
