import { useState, useEffect } from "react";
import { Skull } from "lucide-react";

/**
 * Zona superior de la tarjeta de Jefe.
 * Muestra la imagen (URL editable) o un placeholder con icono Lucide si la URL
 * está vacía o la carga falla.
 *
 * Props:
 * - src: string | null  → URL de la imagen/avatar
 * - name: string        → nombre del jefe (alt / aria)
 * - accent: string      → color Tailwind del acento del jefe
 * - className?: string  → clases extra para el contenedor (altura, etc.)
 */
export default function BossAvatar({
  src,
  name,
  accent = "slate",
  className = "h-28",
}) {
  const [errored, setErrored] = useState(false);

  // Si cambia la URL, reintentamos mostrarla.
  useEffect(() => {
    setErrored(false);
  }, [src]);

  const showImage = src && !errored;

  return (
    <div
      className={`relative flex w-full items-center justify-center overflow-hidden rounded-xl bg-${accent}-500/10 ring-1 ring-${accent}-500/30 ${className}`}
    >
      {showImage ? (
        <img
          src={src}
          alt={name}
          className="h-full w-full object-cover"
          loading="lazy"
          onError={() => setErrored(true)}
        />
      ) : (
        <Skull
          className={`h-12 w-12 text-${accent}-400`}
          aria-label={`Avatar de ${name}`}
        />
      )}
    </div>
  );
}
