/** @type {import('tailwindcss').Config} */
export default {
  // Tell Tailwind which files to scan for class names
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      // Custom font — Inter from Google Fonts (added in index.html)
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      // Custom colors for our dark purple/blue theme
      colors: {
        brand: {
          50:  "#f0f0ff",
          100: "#e0e0ff",
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
          900: "#1e1b4b",
        },
        dark: {
          100: "#1e1e2e",
          200: "#181825",
          300: "#11111b",
        },
      },
      // Custom animations
      animation: {
        "spin-slow": "spin 3s linear infinite",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.4s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
