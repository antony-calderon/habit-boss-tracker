import BossCard from "./BossCard.jsx";
import FinishWeekButton from "./FinishWeekButton.jsx";

/**
 * Tablero Semanal: contenedor de los 6 Jefes.
 *
 * Responsivo:
 * - Móvil: carrusel horizontal con scroll-snap (overflow-x-auto snap-x snap-mandatory).
 * - Escritorio (lg): grid de 6 columnas en paralelo.
 *
 * Props:
 * - bosses: Array<Boss>
 * - completedState: { [bossId]: { [habitId]: boolean } }
 * - onToggleHabit: (bossId, habitId) => void
 * - onFinishWeek?: () => void
 */
export default function WeeklyBoard({
  bosses = [],
  completedState = {},
  onToggleHabit,
  onFinishWeek,
}) {
  return (
    <section>
      {/* Encabezado del tablero */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-white sm:text-xl">
            Tablero de la Semana
          </h2>
          <p className="text-sm text-slate-400">
            Derrota a los jefes cumpliendo sus hábitos.
          </p>
        </div>
        <FinishWeekButton onClick={onFinishWeek} />
      </div>

      {/* Móvil: carrusel con snap | Escritorio: grid de 6 columnas */}
      <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 lg:mx-0 lg:grid lg:grid-cols-6 lg:gap-4 lg:overflow-visible lg:px-0 lg:pb-0">
        {bosses.map((boss, index) => (
          <div
            key={boss.id}
            className="w-[82vw] shrink-0 snap-center sm:w-[60vw] md:w-[42vw] lg:w-auto lg:shrink"
          >
            <BossCard
              boss={boss}
              index={index}
              completedHabits={completedState[boss.id] || {}}
              onToggleHabit={onToggleHabit}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
