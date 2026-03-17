/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ch-lightest': '#b8d1e7', // Azul muy claro
        'ch-lighter': '#8fbfec',  // Azul claro
        'ch-light': '#64a6e3',    // Azul medio
        'ch-primary': '#3e8fd8',  // Azul principal
        'ch-dark': '#0960ae',     // Azul oscuro
        'ch-text': '#1B1C1E',     // Texto (no black)
        'ch-bg': '#f8fafc'        // Fondo general
      }
    },
  },
  plugins: [],
}
