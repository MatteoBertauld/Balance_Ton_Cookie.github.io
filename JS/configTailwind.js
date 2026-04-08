tailwind.config = {
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                // On lie les classes Tailwind aux variables CSS de ton :root
                "primary": "var(--primary)",
                "on-primary": "var(--on-primary)",
                "surface": "var(--surface)",
                "surface-container-high": "var(--surface-container-high)",
                "on-surface": "var(--on-surface)",
                "on-surface-variant": "var(--on-surface-variant)",
                "outline-variant": "var(--outline-variant)",
            },
            fontFamily: {
                // On définit les polices pour pouvoir utiliser 'font-sans' ou 'font-mono-tech'
                sans: ["Inter", "sans-serif"],
                "mono-tech": ["Space Grotesk", "monospace"],
            },
        },
    },
};