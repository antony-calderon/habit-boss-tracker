import { Trophy } from "lucide-react";

/**
 * Indicador translúcido "DERROTADO" que se superpone a la tarjeta de Jefe.
 * Su visibilidad la controla la condición de victoria (progreso >= 80%).
 * La aparición/ocultación se anima con transition-opacity para un cambio suave.
 *
 * Props:
 * - visible: boolean  → muestra/oculta el overlay. Default false.
 */
export default function DefeatedOverlay({ visible = false }) {
  return (
    <div
      aria-hidden={!visible}
      className={`pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 rounded-2xl bg-slate-950/70 backdrop-blur-[2px] transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <Trophy className="h-10 w-10 text-amber-400" />
      <span className="rotate-[-8deg] rounded-md border-2 border-amber-400 px-3 py-1 text-lg font-black uppercase tracking-widest text-amber-400">
        Derrotado
      </span>
    </div>
  );
}
