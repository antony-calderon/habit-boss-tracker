// Persistencia tolerante a fallos sobre localStorage — CAPA 3.

export const STORAGE_KEYS = {
  bosses: "hbt.bossesState.v1",
  completed: "hbt.completedState.v1",
  history: "hbt.historyState.v1",
};

/**
 * Lee y parsea un valor de localStorage.
 * Si la clave no existe, el JSON es inválido o localStorage no está disponible,
 * devuelve `fallback` sin lanzar.
 */
export function loadState(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw == null) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

/**
 * Serializa y guarda un valor en localStorage.
 * Ignora errores (almacenamiento lleno, modo privado, etc.).
 */
export function saveState(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* no-op: almacenamiento no disponible o lleno */
  }
}
