/**
 * Barra de progreso del Jefe. Recibe el progreso calculado en tiempo real
 * y desliza el relleno con una transición suave.
 *
 * Props:
 * - value: number    → porcentaje de progreso (0–100). Default 0.
 * - accent: string   → color Tailwind del relleno según dificultad.
 */
export default function ProgressBar({ value = 0, accent = "emerald" }) {
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <div className="mt-3">
      <div className="mb-1 flex items-center justify-between text-xs text-slate-400">
        <span>Progreso</span>
        <span className="tabular-nums">{clamped}%</span>
      </div>
      <div
        className="h-2 w-full overflow-hidden rounded-full bg-white/10"
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={`h-full rounded-full bg-${accent}-500 transition-all duration-300`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
