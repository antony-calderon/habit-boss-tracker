import { Plus, AlertTriangle, CheckCircle2 } from "lucide-react";
import BossAvatar from "../board/BossAvatar.jsx";
import AccentPicker from "./AccentPicker.jsx";
import HabitEditorRow from "./HabitEditorRow.jsx";
import { getWeightSum, makeHabitId } from "../../lib/bossUtils.js";

/**
 * Editor de un Jefe: nombre, URL de avatar, color de acento y lista de hábitos.
 * Emite el jefe actualizado (inmutable) por `onChange`.
 *
 * Props:
 * - boss: { id, name, accent, avatar, habits[] }
 * - index: number
 * - onChange: (updatedBoss) => void
 */
export default function BossEditor({ boss, index = 0, onChange }) {
  const { name, accent, avatar, habits } = boss;

  const weightSum = getWeightSum(habits);
  const isValidSum = weightSum === 100;

  const setField = (patch) => onChange({ ...boss, ...patch });

  const updateHabit = (habitId, updatedHabit) =>
    setField({
      habits: habits.map((h) => (h.id === habitId ? updatedHabit : h)),
    });

  const removeHabit = (habitId) =>
    setField({ habits: habits.filter((h) => h.id !== habitId) });

  const addHabit = () =>
    setField({
      habits: [...habits, { id: makeHabitId(), name: "Nuevo hábito", weight: 0 }],
    });

  return (
    <article className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 shadow-lg ring-1 ring-white/5">
      <div className="flex items-start gap-4">
        {/* Preview del avatar */}
        <div className="w-24 shrink-0">
          <BossAvatar
            src={avatar}
            name={name}
            accent={accent}
            className="h-24"
          />
          <p className="mt-1 text-center text-xs text-slate-500">Jefe {index + 1}</p>
        </div>

        {/* Campos */}
        <div className="min-w-0 flex-1 space-y-3">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400">
              Nombre
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setField({ name: e.target.value })}
              placeholder="Nombre del jefe"
              className={`w-full rounded-lg border border-white/10 bg-slate-800/60 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-${accent}-500 focus:outline-none focus:ring-1 focus:ring-${accent}-500`}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400">
              URL del avatar
            </label>
            <input
              type="url"
              value={avatar ?? ""}
              onChange={(e) => setField({ avatar: e.target.value || null })}
              placeholder="https://ejemplo.com/imagen.png"
              className={`w-full rounded-lg border border-white/10 bg-slate-800/60 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-${accent}-500 focus:outline-none focus:ring-1 focus:ring-${accent}-500`}
            />
          </div>

          <AccentPicker
            value={accent}
            onChange={(newAccent) => setField({ accent: newAccent })}
          />
        </div>
      </div>

      {/* Lista de hábitos */}
      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Hábitos
          </span>

          {/* Indicador de suma de pesos */}
          {isValidSum ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-semibold text-emerald-300 ring-1 ring-emerald-500/30">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Suma 100%
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-2.5 py-0.5 text-xs font-semibold text-amber-300 ring-1 ring-amber-500/30">
              <AlertTriangle className="h-3.5 w-3.5" />
              Suma {weightSum}% (debe ser 100%)
            </span>
          )}
        </div>

        <div className="space-y-2">
          {habits.map((habit) => (
            <HabitEditorRow
              key={habit.id}
              habit={habit}
              accent={accent}
              onChange={(updated) => updateHabit(habit.id, updated)}
              onRemove={() => removeHabit(habit.id)}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={addHabit}
          className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
        >
          <Plus className="h-4 w-4" />
          Añadir hábito
        </button>
      </div>
    </article>
  );
}
