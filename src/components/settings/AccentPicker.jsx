import { Check } from "lucide-react";
import { ACCENT_COLORS } from "../../data/mockBosses.js";

/**
 * Selector de color de acento.
 *
 * Props:
 * - value: string               → acento actual
 * - onChange: (accent) => void
 */
export default function AccentPicker({ value, onChange }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400">
        Color de acento
      </label>
      <div className="flex flex-wrap gap-2">
        {ACCENT_COLORS.map((color) => {
          const selected = value === color;
          return (
            <button
              key={color}
              type="button"
              onClick={() => onChange(color)}
              aria-label={color}
              aria-pressed={selected}
              title={color}
              className={`flex h-8 w-8 items-center justify-center rounded-full bg-${color}-500 transition ${
                selected
                  ? "ring-2 ring-white ring-offset-2 ring-offset-slate-900"
                  : "opacity-80 hover:opacity-100"
              }`}
            >
              {selected && <Check className="h-4 w-4 text-white" strokeWidth={3} />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
