/** @type {import('tailwindcss').Config} */
module.exports = {
  // 1. Crucial for the .dark class in your CSS to work
  darkMode: 'selector', 
  
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Mapping Tailwind names to your CSS Design Tokens
        brand: {
          primary: "var(--brand-primary)",
          accent: "var(--brand-accent)",
        },
        // Using your v and w aliases if you prefer short names
        v: "var(--brand-accent)", 
        w: "var(--brand-primary)",
        
        // Backgrounds and Text (allows using bg-surface or text-muted)
        surface: "var(--bg-surface)",
        main: "var(--bg-main)",
        muted: "var(--text-muted)",
      },

      borderRadius: {
        'brand': 'var(--radius)',
      },

      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
      animation: {
        marquee: "marquee 18s linear infinite",
        float: "float 6s ease-in-out infinite",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        heading: ["var(--font-heading)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        accent: ["var(--font-accent)", "serif"],
      },
    },
  },
  plugins: [],
};