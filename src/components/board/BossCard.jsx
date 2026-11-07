import BossAvatar from "./BossAvatar.jsx";
import HabitList from "./HabitList.jsx";
import ProgressBar from "./ProgressBar.jsx";
import DefeatedOverlay from "./DefeatedOverlay.jsx";
import { getBossProgress, isDefeated } from "../../lib/bossUtils.js";

/**
 * Tarjeta individual de Jefe.
 *
 * Props:
 * - boss: { id, name, accent, avatar, habits[] }
 * - index: number                   → posición (para el badge "Jefe N")
 * - completedHabits: { [habitId]: boolean }
 * - onToggleHabit: (bossId, habitId) => void
 */
export default function BossCard({
  boss,
  index = 0,
  completedHabits = {},
  onToggleHabit,
}) {
  const { id, name, accent, avatar, habits } = boss;

  // Progreso y derrota derivados.
  const progress = getBossProgress(boss, completedHabits);
  const defeated = isDefeated(progress);

  return (
    <article
      className={`relative flex h-full flex-col rounded-2xl border border-${accent}-500/30 bg-slate-900/60 p-4 shadow-lg ring-1 ring-white/5 transition ${
        defeated ? "saturate-50" : ""
      }`}
    >
      <DefeatedOverlay visible={defeated} />

      {/* Avatar */}
      <BossAvatar src={avatar} name={name} accent={accent} />

      {/* Nombre + badge de acento (índice del jefe) */}
      <div className="mt-3">
        <h3 className="text-base font-bold text-white">{name}</h3>
        <span
          className={`mt-1 inline-flex items-center gap-1.5 rounded-full bg-${accent}-500/15 px-2.5 py-0.5 text-xs font-semibold text-${accent}-300 ring-1 ring-${accent}-500/30`}
        >
          <span className={`h-2 w-2 rounded-full bg-${accent}-500`} />
          Jefe {index + 1}
        </span>
      </div>

      {/* Lista de hábitos interactiva */}
      <div className="mt-3 flex flex-1 flex-col">
        <HabitList
          habits={habits}
          completedHabits={completedHabits}
          accent={accent}
          onToggleHabit={(habitId) => onToggleHabit(id, habitId)}
        />
      </div>

      {/* Barra de progreso dinámica */}
      <ProgressBar value={progress} accent={accent} />
    </article>
  );
}
