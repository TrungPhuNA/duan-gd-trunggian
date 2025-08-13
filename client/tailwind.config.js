/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': {
          DEFAULT: '#3b82f6',
          '50': '#eff6ff',
          '100': '#dbeafe',
          '200': '#bfdbfe',
          '300': '#93c5fd',
          '400': '#60a5fa',
          '500': '#3b82f6',
          '600': '#2563eb',
          '700': '#1d4ed8',
          '800': '#1e40af',
          '900': '#1e3a8a',
        },
        'success': {
          '600': '#16a34a',
          '700': '#15803d',
          '500': '#22c55e',
        },
        'warning': {
          '600': '#ea580c',
          '700': '#c2410c',
          '500': '#f97316',
        },
        'danger': {
          '600': '#dc2626',
          '700': '#b91c1c',
          '500': '#ef4444',
        },
      },
    },
  },
  plugins: [],
}
