import { History } from "lucide-react";
import HistoryWeekCard from "./HistoryWeekCard.jsx";

/**
 * Vista "Historial de Semanas".
 * Lista las semanas archivadas en orden cronológico inverso (más reciente primero).
 *
 * Props:
 * - history: Array<Week>  (ya se almacena con la más reciente al frente)
 */
export default function HistoryView({ history = [] }) {
  if (history.length === 0) {
    return (
      <section className="flex min-h-[50vh] flex-col items-center justify-center text-center">
        <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 ring-1 ring-white/10">
          <History className="h-8 w-8 text-slate-400" />
        </span>
        <h2 className="text-lg font-bold text-white">Historial de Semanas</h2>
        <p className="mt-1 max-w-sm text-sm text-slate-400">
          Aún no hay semanas registradas. Cuando finalices una semana, aparecerá
          aquí tu historial de jefes derrotados.
        </p>
      </section>
    );
  }

  return (
    <section>
      <div className="mb-4">
        <h2 className="text-lg font-bold text-white sm:text-xl">
          Historial de Semanas
        </h2>
        <p className="text-sm text-slate-400">
          {history.length} semana{history.length === 1 ? "" : "s"} archivada
          {history.length === 1 ? "" : "s"} (más reciente primero).
        </p>
      </div>

      <div className="space-y-4">
        {history.map((week) => (
          <HistoryWeekCard key={week.id} week={week} />
        ))}
      </div>
    </section>
  );
}
