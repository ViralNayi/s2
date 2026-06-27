/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Nimbus Sans TW01"', '"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
      },
      colors: {
        bgApp: "var(--bg-app)",
        fgApp: "var(--fg-app)",
        primaryApp: {
          DEFAULT: "var(--primary-app)",
          hover: "var(--primary-hover)",
          rgb: "var(--primary-rgb)",
        },
        cardBg: "var(--card-bg)",
        cardBorder: "var(--card-border)",
        mutedApp: {
          DEFAULT: "var(--muted-text)",
          bg: "var(--muted-bg)",
        },
        accentApp: "var(--accent-app)",
        accentApp2: "var(--accent-app2)",
      },
      boxShadow: {
        glass: "0 8px 32px 0 var(--shadow-color)",
        glow: "0 0 20px 2px var(--glow-color)",
        glowSoft: "0 0 10px var(--glow-color)",
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'spin-slow': 'spin 12s linear infinite',
        'wave': 'wave 8s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        wave: {
          '0%': { transform: 'translateX(0) translateY(0) scale(1)' },
          '50%': { transform: 'translateX(-25%) translateY(5%) scale(1.05)' },
          '100%': { transform: 'translateX(0) translateY(0) scale(1)' },
        }
      }
    },
  },
  plugins: [],
}
