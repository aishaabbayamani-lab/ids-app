/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        base: "#0A0E1A",
        surface: "#111827",
        elevated: "#1A2236",
        border: "#1E293B",
        primary: "#3B82F6",
        cyan: "#06B6D4",
        green: "#10B981",
        amber: "#F59E0B",
        red: "#EF4444",
        purple: "#8B5CF6",
        "text-primary": "#F1F5F9",
        "text-muted": "#64748B",
      },
      fontFamily: {
        display: ['"Space Grotesk"', "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ['"JetBrains Mono"', "monospace"],
      },
    },
  },
  plugins: [],
};
