module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        border: 'var(--border)',
        'gutter-bg': 'var(--gutter-background)',
        'gutter-fg': 'var(--gutter-foreground)',
      },
    },
  },
  plugins: [],
}