import { Trash2 } from "lucide-react";

/**
 * Fila de edición de un hábito: texto + peso porcentual + eliminar.
 *
 * Props:
 * - habit: { id, name, weight }
 * - accent: string
 * - onChange: (updatedHabit) => void
 * - onRemove: () => void
 */
export default function HabitEditorRow({ habit, accent = "indigo", onChange, onRemove }) {
  const handleName = (e) => onChange({ ...habit, name: e.target.value });

  const handleWeight = (e) => {
    const raw = e.target.value;
    // Permite vacío temporal; clamp 0–100 cuando hay número.
    const num = raw === "" ? 0 : Math.max(0, Math.min(100, Number(raw) || 0));
    onChange({ ...habit, weight: num });
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="text"
        value={habit.name}
        onChange={handleName}
        placeholder="Nombre del hábito"
        className={`min-w-0 flex-1 rounded-lg border border-white/10 bg-slate-800/60 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-${accent}-500 focus:outline-none focus:ring-1 focus:ring-${accent}-500`}
      />

      <div className="relative w-20 shrink-0">
        <input
          type="number"
          min={0}
          max={100}
          value={habit.weight}
          onChange={handleWeight}
          className={`w-full rounded-lg border border-white/10 bg-slate-800/60 py-2 pl-3 pr-6 text-sm tabular-nums text-slate-100 focus:border-${accent}-500 focus:outline-none focus:ring-1 focus:ring-${accent}-500`}
        />
        <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-xs text-slate-400">
          %
        </span>
      </div>

      <button
        type="button"
        onClick={onRemove}
        aria-label="Eliminar hábito"
        title="Eliminar hábito"
        className="shrink-0 rounded-lg p-2 text-slate-400 transition hover:bg-rose-500/10 hover:text-rose-400"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
