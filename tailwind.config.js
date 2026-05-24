/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/ui/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#e0e5ec",
        panel: "#f0f2f5",
        muted: "#d1d9e6",
        text: "#2d3436",
        "text-muted": "#4a5568",
        accent: "#ff4757",
      },
      boxShadow: {
        card: "8px 8px 16px #babecc, -8px -8px 16px #ffffff",
        floating: "12px 12px 24px #babecc, -12px -12px 24px #ffffff",
        pressed: "inset 6px 6px 12px #babecc, inset -6px -6px 12px #ffffff",
        recessed: "inset 4px 4px 8px #babecc, inset -4px -4px 8px #ffffff",
      },
      borderRadius: {
        sm: "4px",
        md: "8px",
        lg: "16px",
        xl: "24px",
      },
    },
  },
  plugins: [],
};
