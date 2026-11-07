// Genera iconos PNG mínimos (fondo oscuro con cuadro de acento) sin dependencias.
// Escribe PNGs válidos construyendo los chunks a mano con zlib.
import { writeFileSync, mkdirSync } from "node:fs";
import { deflateSync } from "node:zlib";
import { crc32 } from "node:zlib";

function makePng(size, rgba) {
  // rgba(x,y) => [r,g,b,a]
  const bytesPerPixel = 4;
  const rowLen = size * bytesPerPixel;
  // Filtro 0 por fila.
  const raw = Buffer.alloc((rowLen + 1) * size);
  for (let y = 0; y < size; y++) {
    raw[y * (rowLen + 1)] = 0; // filtro none
    for (let x = 0; x < size; x++) {
      const [r, g, b, a] = rgba(x, y, size);
      const off = y * (rowLen + 1) + 1 + x * bytesPerPixel;
      raw[off] = r;
      raw[off + 1] = g;
      raw[off + 2] = b;
      raw[off + 3] = a;
    }
  }
  const idat = deflateSync(raw);

  const chunks = [];
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  function chunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type, "ascii");
    const body = Buffer.concat([typeBuf, data]);
    const crcBuf = Buffer.alloc(4);
    crcBuf.writeUInt32BE(crc32(body) >>> 0, 0);
    return Buffer.concat([len, body, crcBuf]);
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  chunks.push(sig);
  chunks.push(chunk("IHDR", ihdr));
  chunks.push(chunk("IDAT", idat));
  chunks.push(chunk("IEND", Buffer.alloc(0)));
  return Buffer.concat(chunks);
}

// Diseño: fondo slate-950 (#020617) con un cuadrado redondeado indigo (#6366f1)
// centrado ocupando ~55% del lienzo.
function design(x, y, size) {
  const bg = [2, 6, 23, 255];
  const fg = [99, 102, 241, 255];
  const m = size * 0.225; // margen
  const inside = x >= m && x <= size - m && y >= m && y <= size - m;
  return inside ? fg : bg;
}

mkdirSync("public", { recursive: true });
writeFileSync("public/icon-192.png", makePng(192, design));
writeFileSync("public/icon-512.png", makePng(512, design));
console.log("Iconos generados: public/icon-192.png, public/icon-512.png");
