export const THEME = {
  colors: {
    // Primary cyberpunk colors
    primary: "#B3005E", // Deep magenta
    primaryHover: "#FF1493", // Bright magenta (DeepPink)
    secondary: "#4D0040", // Dark purple

    // Neutrals
    black: "#000000",
    white: "#FFFFFF",
    gray: {
      50: "#F9F9FB",
      100: "#F3F3F7",
      200: "#E9E9EF",
      300: "#D9D9E3",
      400: "#9A9AAE",
      500: "#606070",
      600: "#404450",
      700: "#2A2A36",
      800: "#1A1A24",
      900: "#0B0B0F",
    },

    // Accents
    accent: "#FF1493",
    danger: "#FF0000",
  },

  spacing: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    "2xl": "2.5rem",
    "3xl": "3rem",
    "4xl": "4rem",
  },

  typography: {
    fontFamily: {
      sans: '"Geist", "Geist Fallback", sans-serif',
      mono: '"Geist Mono", "Geist Mono Fallback", monospace',
      pixel: '"Press Start 2P", cursive',
      orbitron: '"Orbitron", sans-serif',
    },
    fontSize: {
      xs: "0.75rem",
      sm: "0.875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem",
      "5xl": "3rem",
      "6xl": "3.75rem",
      "7xl": "4.5rem",
    },
  },

  animation: {
    duration: {
      fast: "150ms",
      base: "300ms",
      slow: "500ms",
    },
  },
} as const;

export type Theme = typeof THEME;