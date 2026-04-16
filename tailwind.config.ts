import type { Config } from 'tailwindcss';

// Tailwind is kept in the build pipeline but not used directly in JSX.
// All visual styles are in app/globals.css as custom CSS.
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: { extend: {} },
  plugins: [],
};

export default config;
