/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary-background": "#f1f1f1",
        "primary-foreground": "#424242",

        // Normal
        "normal-black": "#212121",
        "normal-red": "#c30771",
        "normal-green": "#10a778",
        "normal-yellow": "#a89c14",
        "normal-blue": "#008ec4",
        "normal-magenta": "#523c79",
        "normal-cyan": "#20a5ba",
        "normal-white": "#e0e0e0",

        // Bright
        "bright-black": "#212121",
        "bright-red": "#fb007a",
        "bright-green": "#5fd7af",
        "bright-yellow": "#f3e430",
        "bright-blue": "#20bbfc",
        "bright-magenta": "#6855de",
        "bright-cyan": "#4fb8cc",
        "bright-white": "#f1f1f1",
      },
    },
  },
  plugins: [],
};
