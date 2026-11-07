import { Check } from "lucide-react";

/**
 * Fila interactiva de un hábito con checkbox táctil estilizado.
 * Toda la fila es un <label> clicable con área de toque cómoda (≥ 44px).
 *
 * El <input> nativo se oculta con `sr-only` + `peer`, y el recuadro visual
 * reacciona a su estado mediante clases `peer-checked:*`.
 *
 * Props:
 * - name: string
 * - weight: number          → porcentaje (0–100)
 * - checked: boolean         → si el hábito está completado
 * - accent: string           → color de acento del jefe
 * - onToggle: () => void      → alterna el estado
 */
export default function HabitItem({
  name,
  weight,
  checked = false,
  accent = "emerald",
  onToggle,
}) {
  return (
    <li>
      <label className="group flex min-h-[44px] cursor-pointer items-center gap-3 py-1.5 text-sm">
        {/* Checkbox accesible oculto; controla al recuadro visual vía peer */}
        <input
          type="checkbox"
          className="peer sr-only"
          checked={checked}
          onChange={onToggle}
        />

        {/* Recuadro personalizado */}
        <span
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 border-white/20 bg-white/5 text-white transition-colors duration-200 peer-checked:border-${accent}-500 peer-checked:bg-${accent}-500 peer-focus-visible:ring-2 peer-focus-visible:ring-${accent}-400 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-slate-900`}
        >
          <Check
            className="h-4 w-4 opacity-0 transition-opacity duration-200 peer-checked:opacity-100"
            strokeWidth={3}
          />
        </span>

        {/* Nombre del hábito: se atenúa y tacha al completarse */}
        <span
          className={`flex-1 truncate transition-all duration-200 ${
            checked ? "text-slate-500 line-through" : "text-slate-200"
          }`}
        >
          {name}
        </span>

        {/* Peso porcentual */}
        <span className="shrink-0 font-semibold tabular-nums text-slate-400">
          {weight}%
        </span>
      </label>
    </li>
  );
}
