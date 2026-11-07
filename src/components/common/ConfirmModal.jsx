import { useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";

/**
 * Modal de confirmación estilizado (modo oscuro).
 *
 * Props:
 * - open: boolean
 * - title: string
 * - message: string
 * - confirmLabel?: string
 * - cancelLabel?: string
 * - onConfirm: () => void
 * - onCancel: () => void
 */
export default function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  onConfirm,
  onCancel,
}) {
  // Cerrar con Escape mientras está abierto.
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onCancel?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Panel */}
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 p-5 shadow-2xl ring-1 ring-white/5">
        <button
          type="button"
          onClick={onCancel}
          aria-label="Cerrar"
          className="absolute right-3 top-3 rounded-lg p-1.5 text-slate-400 transition hover:bg-white/5 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 ring-1 ring-amber-500/30">
            <AlertTriangle className="h-5 w-5 text-amber-400" />
          </span>
          <div className="min-w-0">
            <h2 id="confirm-title" className="text-base font-bold text-white">
              {title}
            </h2>
            <p className="mt-1 text-sm text-slate-300">{message}</p>
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500 active:scale-[0.98]"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
