module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0F172A",
        topbar: "#6B3E37",
        cyan: "#00D1D1",
        pink: "#FF2E80",
        card: "#1E293B",
        background: "var(--color-background)",
        surface: "var(--color-surface)",
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
        accent: "var(--color-accent)",
        border: "var(--color-border)",
        text: "var(--color-text)",
        muted: "var(--color-muted)",
        success: "var(--color-success)",
        warning: "var(--color-warning)",
        danger: "var(--color-danger)"
      },
      boxShadow: { glow: "0 10px 30px rgba(0,0,0,0.45)" },
      borderRadius: { xl: "12px" }
    }
  },
  plugins: []
};