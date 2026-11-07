import { useEffect, useRef, useState } from "react";
import { loadState, saveState } from "../lib/storage.js";

/**
 * Estado de React sincronizado reactivamente con localStorage.
 *
 * - Inicializa leyendo la clave (con fallback tolerante a fallos).
 * - Persiste automáticamente ante cada cambio de referencia del estado.
 *
 * @param {string} key          Clave de localStorage.
 * @param {*|Function} initializer  Valor inicial o función que lo produce.
 * @returns {[any, Function]} Tupla [state, setState] como useState.
 */
export function usePersistentState(key, initializer) {
  const [state, setState] = useState(() => {
    const fallback =
      typeof initializer === "function" ? initializer() : initializer;
    return loadState(key, fallback);
  });

  // Evita escribir en el primer render (el valor ya proviene de storage).
  const isFirst = useRef(true);
  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    saveState(key, state);
  }, [key, state]);

  return [state, setState];
}

export default usePersistentState;
