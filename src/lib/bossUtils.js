// Utilidades de dominio para Jefes y combate — CAPA 3.

// Umbral de victoria: un jefe se considera derrotado con >= 80% de progreso.
export const WIN_THRESHOLD = 80;

/**
 * Progreso de un jefe: suma de pesos de los hábitos completados.
 * @param {{habits: Array<{id:string, weight:number}>}} boss
 * @param {Object<string, boolean>} completedForBoss  Marcado { [habitId]: boolean }.
 * @returns {number} 0–100
 */
export function getBossProgress(boss, completedForBoss = {}) {
  return boss.habits.reduce(
    (sum, habit) => (completedForBoss[habit.id] ? sum + habit.weight : sum),
    0
  );
}

/** ¿El jefe está derrotado según su progreso? */
export function isDefeated(progress) {
  return progress >= WIN_THRESHOLD;
}

/**
 * Suma de pesos de los hábitos de un jefe (para validar que dé 100%).
 */
export function getWeightSum(habits = []) {
  return habits.reduce((sum, h) => sum + (Number(h.weight) || 0), 0);
}

/**
 * Construye un completedState vacío (todos los hábitos en false) para un
 * conjunto de jefes.
 * @returns {Object<string, Object<string, boolean>>}
 */
export function buildEmptyCompleted(bosses = []) {
  return Object.fromEntries(
    bosses.map((boss) => [
      boss.id,
      Object.fromEntries(boss.habits.map((habit) => [habit.id, false])),
    ])
  );
}

/**
 * Reconciliación del marcado de UN jefe tras editar su lista de hábitos (RF-8.7):
 * conserva el valor de los hábitos que siguen existiendo e inicializa en false
 * los nuevos; descarta entradas de hábitos eliminados.
 * @param {Object<string, boolean>} prevForBoss  Marcado previo del jefe.
 * @param {Array<{id:string}>} habits            Hábitos actuales del jefe.
 */
export function reconcileCompletedForBoss(prevForBoss = {}, habits = []) {
  return Object.fromEntries(
    habits.map((habit) => [habit.id, prevForBoss[habit.id] ?? false])
  );
}

/**
 * Formatea la etiqueta de una semana archivada, ej. "Semana de Noviembre".
 * @param {Date} date
 */
export function formatWeekLabel(date = new Date()) {
  try {
    const month = new Intl.DateTimeFormat("es", { month: "long" }).format(date);
    const capitalized = month.charAt(0).toUpperCase() + month.slice(1);
    return `Semana de ${capitalized}`;
  } catch {
    return "Semana archivada";
  }
}

/**
 * Genera un id único razonable para hábitos nuevos creados en Ajustes.
 */
export function makeHabitId() {
  return `h-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}
