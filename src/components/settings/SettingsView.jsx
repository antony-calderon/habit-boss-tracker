import { RotateCcw } from "lucide-react";
import BossEditor from "./BossEditor.jsx";

/**
 * Vista de Ajustes: edición del universo de Jefes.
 *
 * Props:
 * - bosses: Array<Boss>
 * - onUpdateBoss: (bossId, updatedBoss) => void
 * - onResetDefaults?: () => void
 */
export default function SettingsView({ bosses = [], onUpdateBoss, onResetDefaults }) {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-white sm:text-xl">Ajustes</h2>
          <p className="text-sm text-slate-400">
            Personaliza tus jefes: nombre, avatar, color y hábitos.
          </p>
        </div>

        {onResetDefaults && (
          <button
            type="button"
            onClick={onResetDefaults}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
          >
            <RotateCcw className="h-4 w-4" />
            <span className="hidden sm:inline">Restablecer valores</span>
          </button>
        )}
      </div>

      <div className="space-y-4">
        {bosses.map((boss, index) => (
          <BossEditor
            key={boss.id}
            boss={boss}
            index={index}
            onChange={(updated) => onUpdateBoss(boss.id, updated)}
          />
        ))}
      </div>
    </section>
  );
}
