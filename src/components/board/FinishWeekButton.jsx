import { Flag } from "lucide-react";

/**
 * Botón estético "Finalizar Semana".
 * En la CAPA 1 es solo visual (sin acción funcional).
 *
 * Props:
 * - onClick?: () => void  → opcional; no-op en esta capa.
 */
export default function FinishWeekButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500 active:scale-[0.98]"
    >
      <Flag className="h-4 w-4" />
      Finalizar Semana
    </button>
  );
}
