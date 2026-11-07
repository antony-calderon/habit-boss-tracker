import { LayoutGrid, History, Settings, Swords } from "lucide-react";

/**
 * Barra de navegación. Alterna entre Tablero / Historial / Ajustes.
 *
 * Props:
 * - activeView: "board" | "history" | "settings"
 * - onChangeView: (view) => void
 */
const TABS = [
  { key: "board", label: "Tablero Actual", icon: LayoutGrid },
  { key: "history", label: "Historial de Semanas", icon: History },
  { key: "settings", label: "Ajustes", icon: Settings },
];

export default function NavBar({ activeView, onChangeView }) {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        {/* Marca */}
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600/20 ring-1 ring-indigo-500/40">
            <Swords className="h-5 w-5 text-indigo-400" />
          </span>
          <span className="hidden text-sm font-bold text-white sm:block">
            Habit Boss Tracker
          </span>
        </div>

        {/* Pestañas */}
        <nav className="flex items-center gap-1 rounded-xl bg-white/5 p-1">
          {TABS.map(({ key, label, icon: Icon }) => {
            const active = activeView === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => onChangeView(key)}
                aria-current={active ? "page" : undefined}
                aria-label={label}
                title={label}
                className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-indigo-600 text-white shadow"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden md:inline">{label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
