// SEMILLA del universo por defecto (Naruto) — CAPA 3.
// Ya no es la fuente de verdad en runtime: inicializa `bossesState` la primera vez.
// El usuario puede editar todo desde la vista Ajustes y se persiste en localStorage.

// Colores de acento válidos (editables por el usuario).
// Debe coincidir con el safelist de Tailwind (tailwind.config.js).
export const ACCENT_COLORS = [
  "emerald",
  "lime",
  "amber",
  "orange",
  "rose",
  "red",
  "purple",
  "indigo",
];

// Boss: { id, name, accent, avatar: string|null, habits: [{ id, name, weight }] }
// La suma de weight por jefe debe ser 100.
export const DEFAULT_BOSSES = [
  {
    id: "boss-1",
    name: "Zabuza",
    accent: "emerald",
    avatar: null,
    habits: [
      { id: "b1-h1", name: "Dahilia", weight: 40 },
      { id: "b1-h2", name: "Lectura", weight: 35 },
      { id: "b1-h3", name: "Meditación", weight: 25 },
    ],
  },
  {
    id: "boss-2",
    name: "Orochimaru",
    accent: "lime",
    avatar: null,
    habits: [
      { id: "b2-h1", name: "Dahilia", weight: 30 },
      { id: "b2-h2", name: "Dark", weight: 25 },
      { id: "b2-h3", name: "Lectura", weight: 25 },
      { id: "b2-h4", name: "Visualización", weight: 20 },
    ],
  },
  {
    id: "boss-3",
    name: "Itachi",
    accent: "amber",
    avatar: null,
    habits: [
      { id: "b3-h1", name: "Dark", weight: 30 },
      { id: "b3-h2", name: "Meditación", weight: 25 },
      { id: "b3-h3", name: "Lectura", weight: 25 },
      { id: "b3-h4", name: "Visualización", weight: 20 },
    ],
  },
  {
    id: "boss-4",
    name: "Pain",
    accent: "orange",
    avatar: null,
    habits: [
      { id: "b4-h1", name: "Dahilia", weight: 25 },
      { id: "b4-h2", name: "Dark", weight: 25 },
      { id: "b4-h3", name: "Meditación", weight: 20 },
      { id: "b4-h4", name: "Lectura", weight: 15 },
      { id: "b4-h5", name: "Visualización", weight: 15 },
    ],
  },
  {
    id: "boss-5",
    name: "Madara",
    accent: "rose",
    avatar: null,
    habits: [
      { id: "b5-h1", name: "Dark", weight: 30 },
      { id: "b5-h2", name: "Dahilia", weight: 25 },
      { id: "b5-h3", name: "Visualización", weight: 20 },
      { id: "b5-h4", name: "Meditación", weight: 15 },
      { id: "b5-h5", name: "Lectura", weight: 10 },
    ],
  },
  {
    id: "boss-6",
    name: "Kaguya",
    accent: "red",
    avatar: null,
    habits: [
      { id: "b6-h1", name: "Dark", weight: 25 },
      { id: "b6-h2", name: "Dahilia", weight: 25 },
      { id: "b6-h3", name: "Meditación", weight: 20 },
      { id: "b6-h4", name: "Visualización", weight: 20 },
      { id: "b6-h5", name: "Lectura", weight: 10 },
    ],
  },
];

export default DEFAULT_BOSSES;
