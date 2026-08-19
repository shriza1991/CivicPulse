/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        card: "var(--card)",
        primary: {
          DEFAULT: "var(--color-primary-700)",
          500: "var(--color-primary-500)",
          700: "var(--color-primary-700)",
          hover: "var(--color-primary-500)",
          foreground: "#ffffff",
        },
        neutral: {
          50: "var(--color-neutral-50)",
          100: "var(--color-neutral-100)",
          200: "var(--color-neutral-200)",
          300: "var(--color-neutral-300)",
          700: "var(--color-neutral-700)",
          900: "var(--color-neutral-900)",
        },
        evidence: {
          DEFAULT: "var(--color-evidence-base)",
          base: "var(--color-evidence-base)",
        },
        government: {
          DEFAULT: "var(--color-government-base)",
          base: "var(--color-government-base)",
        },
        community: {
          DEFAULT: "var(--color-community-base)",
          base: "var(--color-community-base)",
        },
        ai: {
          DEFAULT: "var(--color-ai-assistance-base)",
          base: "var(--color-ai-assistance-base)",
        },
        success: {
          DEFAULT: "var(--color-success-base)",
          base: "var(--color-success-base)",
          foreground: "#ffffff",
        },
        warning: {
          DEFAULT: "var(--color-warning-base)",
          base: "var(--color-warning-base)",
          foreground: "#ffffff",
        },
        danger: {
          DEFAULT: "var(--color-danger-base)",
          base: "var(--color-danger-base)",
          foreground: "#ffffff",
        },
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        pill: "var(--radius-pill)",
        small: "var(--radius-sm)",
        medium: "var(--radius-md)",
        large: "var(--radius-lg)",
      },
      boxShadow: {
        subtle: "var(--elevation-1)",
        premium: "var(--elevation-2)",
        modal: "var(--elevation-3)",
      },
      fontFamily: {
        sans: ["Noto Sans", "Noto Sans Devanagari", "system-ui", "sans-serif"],
        mono: ["Noto Sans Mono", "monospace"],
      },
      spacing: {
        '1': 'var(--space-1)',
        '2': 'var(--space-2)',
        '3': 'var(--space-3)',
        '4': 'var(--space-4)',
        '5': 'var(--space-5)',
        '6': 'var(--space-6)',
        '7': 'var(--space-7)',
        '8': 'var(--space-8)',
      },
      transitionDuration: {
        fast: 'var(--motion-duration-fast)',
        base: 'var(--motion-duration-base)',
        slow: 'var(--motion-duration-slow)',
      },
    },
  },
  plugins: [],
}
