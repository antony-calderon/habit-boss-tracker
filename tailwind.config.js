/** @type {import('tailwindcss').Config} */

// Paleta de acentos editable por el usuario. Debe coincidir con ACCENT_COLORS
// en src/data/mockBosses.js.
const ACCENTS = "emerald|lime|amber|orange|rose|red|purple|indigo";

export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {},
  },
  // Los colores de acento se construyen dinámicamente (ej. `bg-${accent}-500`),
  // por lo que Tailwind no puede verlos en el código. Se declaran aquí para que
  // no se purguen en build, junto con las variantes usadas por los componentes.
  safelist: [
    // Fondos sólidos y con opacidad (avatar, badges, checkbox, puntos de color).
    { pattern: new RegExp(`^bg-(${ACCENTS})-500$`) },
    { pattern: new RegExp(`^bg-(${ACCENTS})-500/(10|15|30)$`) },
    // Texto de acento (badges, porcentajes de historial).
    { pattern: new RegExp(`^text-(${ACCENTS})-(300|400)$`) },
    // Bordes (tarjetas, inputs).
    { pattern: new RegExp(`^border-(${ACCENTS})-500$`) },
    { pattern: new RegExp(`^border-(${ACCENTS})-500/30$`) },
    // Rings (badges, foco de inputs y selector).
    { pattern: new RegExp(`^ring-(${ACCENTS})-(400|500)$`) },
    { pattern: new RegExp(`^ring-(${ACCENTS})-500/30$`) },
    // Variantes de foco en inputs (BossEditor / HabitEditorRow).
    {
      pattern: new RegExp(`^(border|ring)-(${ACCENTS})-500$`),
      variants: ["focus"],
    },
    // Checkbox interactivo (HabitItem).
    {
      pattern: new RegExp(`^(bg|border)-(${ACCENTS})-500$`),
      variants: ["peer-checked"],
    },
    {
      pattern: new RegExp(`^ring-(${ACCENTS})-400$`),
      variants: ["peer-focus-visible"],
    },
  ],
  plugins: [],
};
