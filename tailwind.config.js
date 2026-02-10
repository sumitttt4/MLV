/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./store/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))"
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))"
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))"
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))"
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))"
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))"
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))"
        },
        brand: {
          tamarind: "#4A1F1A", // Primary Brand Color (Header, Footer, Hero)
          cocoa: "#5C2621",    // Surface / Card Color
          gold: "#E3B25C",     // Accent / CTA Color
          cream: "#F3E5D8",    // Text Color
          dark: "#3A1411",     // Background Gradient Start
          black: "#2A0D0B",    // Background Gradient End
          buttonText: "#3A1411", // Text on primary buttons
          maroon: "#4A1F1A",   // Alias — same as tamarind (admin/checkout text)
          chrome: "#F3E5D8",   // Alias — same as cream (inactive nav text)
        },
        veg: "#15803D",
        nonveg: "#B91C1C",
      },
      fontFamily: {
        sans: ["var(--font-body)", "sans-serif"],
        serif: ["var(--font-heading)", "serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        "card": "14px", // Radius: 14px for Menu Cards
      },
    },
  },
  plugins: [],
};
