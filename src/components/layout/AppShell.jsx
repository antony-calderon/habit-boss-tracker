/**
 * Contenedor general de la aplicación: fondo, header y área de contenido.
 *
 * Props:
 * - header: ReactNode   → normalmente la NavBar.
 * - children: ReactNode → contenido de la vista activa.
 */
export default function AppShell({ header, children }) {
  return (
    <div className="min-h-full bg-slate-950 text-slate-100">
      {header}
      <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
    </div>
  );
}
