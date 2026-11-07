import { Trophy, Calendar } from "lucide-react";

/**
 * Tarjeta de una semana archivada.
 *
 * Props:
 * - week: {
 *     id, label, archivedAt,
 *     defeatedCount, totalBosses,
 *     results: [{ bossId, name, accent, progress, defeated }]
 *   }
 */
export default function HistoryWeekCard({ week }) {
  const { label, defeatedCount, totalBosses, results = [] } = week;

  return (
    <article className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 shadow-lg ring-1 ring-white/5">
      {/* Encabezado de la semana */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10">
            <Calendar className="h-4 w-4 text-slate-300" />
          </span>
          <h3 className="text-base font-bold text-white">{label}</h3>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-3 py-1 text-xs font-semibold text-amber-300 ring-1 ring-amber-500/30">
          <Trophy className="h-3.5 w-3.5" />
          {defeatedCount} / {totalBosses} derrotados
        </span>
      </div>

      {/* Desglose por jefe */}
      <ul className="mt-4 space-y-2">
        {results.map((r) => (
          <li key={r.bossId} className="flex items-center gap-3">
            <span
              className={`h-2.5 w-2.5 shrink-0 rounded-full bg-${r.accent}-500`}
            />
            <span
              className={`min-w-0 flex-1 truncate text-sm ${
                r.defeated ? "font-semibold text-white" : "text-slate-300"
              }`}
            >
              {r.name}
            </span>

            {/* Mini barra de progreso */}
            <span className="hidden h-1.5 w-24 overflow-hidden rounded-full bg-white/10 sm:block">
              <span
                className={`block h-full rounded-full bg-${r.accent}-500`}
                style={{ width: `${Math.max(0, Math.min(100, r.progress))}%` }}
              />
            </span>

            <span
              className={`w-12 shrink-0 text-right text-sm tabular-nums ${
                r.defeated ? `text-${r.accent}-300` : "text-slate-400"
              }`}
            >
              {r.progress}%
            </span>
          </li>
        ))}
      </ul>
    </article>
  );
}
