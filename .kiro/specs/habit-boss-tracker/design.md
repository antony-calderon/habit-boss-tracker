# Diseño — Habit Boss Tracker

## 1. Objetivo del diseño

- **CAPA 1 (completada):** Definir la estructura de componentes, el layout responsivo
  y el sistema visual de la interfaz, sin lógica de negocio. Esqueleto visual navegable
  con datos de ejemplo (mock).
- **CAPA 2 (completada):** Añadir interactividad y lógica de combate sobre esa
  estructura: estado de hábitos completados, progreso calculado en tiempo real y
  condición de victoria dinámica. Los componentes presentacionales se mantienen; se
  les inyecta estado y callbacks por props desde `App.jsx`.
- **CAPA 3 (actual, FINAL):** Convertir la app en un sistema autogestionable:
  `bossesState` editable por el usuario (vista Ajustes), persistencia completa en
  `localStorage` (bosses, marcado y historial), lógica real de "Finalizar Semana" +
  Historial, y preparación PWA (manifest + service worker) para instalación y uso
  offline. Se mantiene el patrón de estado elevado en `App.jsx` con persistencia
  reactiva vía un hook `usePersistentState`.

## 2. Arquitectura de carpetas propuesta

```
public/
├── manifest.webmanifest     # (CAPA 3) Manifiesto PWA (instalable)
├── sw.js                    # (CAPA 3) Service worker (cache del app shell)
├── icon-192.png             # (CAPA 3) Icono PWA
└── icon-512.png             # (CAPA 3) Icono PWA

src/
├── main.jsx                 # Punto de entrada React (+ registro del SW)
├── App.jsx                  # Dueño del estado: bosses, completed, history, vista
├── index.css                # Directivas de Tailwind + estilos base
├── data/
│   └── mockBosses.js        # SEMILLA del universo por defecto (Naruto)
├── hooks/
│   └── usePersistentState.js # (CAPA 3) Estado React sincronizado con localStorage
├── lib/
│   ├── storage.js           # (CAPA 3) Lectura/escritura tolerante a fallos + claves
│   └── bossUtils.js         # (CAPA 3) Progreso, derrota, reconciliación, semilla
├── components/
│   ├── layout/
│   │   ├── NavBar.jsx       # Navegación: Tablero / Historial / Ajustes
│   │   └── AppShell.jsx     # Contenedor general (header + contenido)
│   ├── board/
│   │   ├── WeeklyBoard.jsx  # Contenedor de los 6 Jefes (grid/carrusel)
│   │   ├── BossCard.jsx     # Tarjeta individual de Jefe
│   │   ├── BossAvatar.jsx   # Imagen del personaje (URL) o placeholder
│   │   ├── HabitList.jsx    # Lista de hábitos con peso %
│   │   ├── HabitItem.jsx    # Fila interactiva (checkbox + nombre + peso)
│   │   ├── ProgressBar.jsx  # Barra de progreso dinámica
│   │   ├── DefeatedOverlay.jsx # Indicador translúcido "Derrotado"
│   │   └── FinishWeekButton.jsx # Botón "Finalizar Semana" (funcional)
│   ├── history/
│   │   ├── HistoryView.jsx  # Lista de semanas archivadas
│   │   └── HistoryWeekCard.jsx # (CAPA 3) Tarjeta de una semana archivada
│   └── settings/
│       ├── SettingsView.jsx # (CAPA 3) Editor del universo de Jefes
│       ├── BossEditor.jsx   # (CAPA 3) Edición de un Jefe (nombre/avatar/color)
│       ├── AccentPicker.jsx # (CAPA 3) Selector de color de acento
│       └── HabitEditorRow.jsx # (CAPA 3) Edición de un hábito (texto + peso)
```

> Los componentes son presentacionales (stateless) salvo `App.jsx`. En CAPA 1 `App`
> solo guarda la vista activa; en CAPA 2 es dueño del estado de hábitos completados;
> en CAPA 3 es dueño de **tres estados persistidos** (`bossesState`,
> `completedState`, `historyState`) y los propaga junto con callbacks por props
> (patrón de estado elevado + persistencia reactiva).

## 3. Jerarquía de componentes

CAPA 3 (final) — flujo de datos (↓ props) y eventos (↑ callbacks):

```
App  (bossesState, completedState, historyState, activeView
      toggleHabit, finishWeek, updateBoss)
└── AppShell
    ├── NavBar  (activeView, onChangeView)   # Tablero / Historial / Ajustes
    └── main
        ├── [vista: "board"] WeeklyBoard  (bosses, completedState, onToggleHabit, onFinishWeek)
        │   ├── FinishWeekButton  (onClick = finishWeek, confirmación)
        │   └── BossCard  x6  (boss, completedHabits, onToggleHabit)
        │       ├── BossAvatar  (src = boss.avatar, accent)
        │       ├── (nombre + badge de color de acento)
        │       ├── HabitList  (habits, completedHabits, accent, onToggleHabit)
        │       │   └── HabitItem  xN  (name, weight, checked, accent, onToggle)
        │       ├── ProgressBar  (value = progreso calculado, accent)
        │       └── DefeatedOverlay  (visible = progress ≥ 80%)
        ├── [vista: "history"] HistoryView  (history)
        │   └── HistoryWeekCard  xN  (week: { id, label, defeatedCount, results[] })
        └── [vista: "settings"] SettingsView  (bosses, onUpdateBoss, onResetDefaults)
            └── BossEditor  x6  (boss, onChange)
                ├── (campo nombre + campo URL avatar)
                ├── AccentPicker  (value = accent, onChange)
                └── HabitEditorRow  xN  (habit, onChange, onRemove) + "añadir hábito"
                    (muestra suma de pesos y aviso si ≠ 100%)
```

Flujos principales:
- **Marcado:** `HabitItem.onToggle` → `App.toggleHabit` → `completedState` → progreso
  por jefe → `ProgressBar.value` y `DefeatedOverlay.visible`.
- **Edición:** `BossEditor`/`HabitEditorRow` → `App.updateBoss` → `bossesState`
  (persistido) → se reconcilia `completedState` (RF-8.7) → el Tablero refleja cambios.
- **Finalizar semana:** `FinishWeekButton` → `App.finishWeek` → agrega entrada a
  `historyState` (persistido) y reinicia `completedState` a `false`.
- **Persistencia:** los tres estados se guardan en `localStorage` de forma reactiva
  (hook `usePersistentState`).

## 4. Modelo de datos

### 4.1 Semilla del universo por defecto — `src/data/mockBosses.js`

En CAPA 3 este archivo deja de ser la fuente de verdad en runtime y pasa a ser la
**semilla** (`DEFAULT_BOSSES`) que inicializa `bossesState` la primera vez.

```js
// Lista de colores de acento válidos (editables por el usuario).
// Debe coincidir con el safelist de Tailwind.
export const ACCENT_COLORS = ["emerald", "amber", "rose", "purple", "indigo", "lime", "orange", "red"];

// Semilla: 6 jefes (universo Naruto).
// Boss: { id, name, accent, avatar: string|null, habits: [{ id, name, weight }] }
// La suma de weight por jefe debe ser 100.
```

> Nota de migración desde CAPA 2: se sustituye el objeto `difficulty` (label + accent)
> por un campo plano `accent`. El "nivel de dificultad" ya no es un atributo fijo; el
> orden de los jefes (ligero→extremo) se mantiene por su posición en el array. El
> `label` de dificultad deja de mostrarse como badge; en su lugar el badge usa solo el
> color de acento (o el nombre), para que el universo sea 100% editable.

Ejemplo de un Jefe (forma CAPA 3):

```js
{
  id: "boss-1",
  name: "Zabuza",
  accent: "emerald",
  avatar: null,                 // null → placeholder con icono Lucide; o URL de imagen
  habits: [
    { id: "b1-h1", name: "Dahilia", weight: 40 },
    { id: "b1-h2", name: "Lectura", weight: 35 },
    { id: "b1-h3", name: "Meditación", weight: 25 },
  ],
}
```

### 4.2 `completedState`

```js
// { [bossId]: { [habitId]: boolean } }  — marcado de la semana actual.
```

### 4.3 `historyState`

Array de semanas archivadas (más reciente primero tras `unshift`, o se ordena al
mostrar):

```js
[
  {
    id: "week-1730800000000",          // ID único (timestamp)
    label: "Semana de Noviembre",       // fecha formateada legible
    archivedAt: "2026-11-05T22:00:00Z", // ISO para ordenar
    defeatedCount: 3,                    // jefes con progreso >= 80%
    totalBosses: 6,
    results: [                           // porcentaje final por jefe
      { bossId: "boss-1", name: "Zabuza", accent: "emerald", progress: 100, defeated: true },
      { bossId: "boss-2", name: "Orochimaru", accent: "lime", progress: 55, defeated: false },
      // ...6 entradas
    ],
  },
  // ...más semanas
]
```

## 5. Especificación de componentes

### App.jsx
- Estado (CAPA 3), todos persistidos vía `usePersistentState`:
  - `activeView: "board" | "history" | "settings"` (no persistido; UI).
  - `bossesState`: universo editable de 6 Jefes. Inicial: `DEFAULT_BOSSES` (semilla).
  - `completedState`: `{ [bossId]: { [habitId]: boolean } }`. Inicial: todos `false`,
    derivado de `bossesState`.
  - `historyState`: array de semanas archivadas. Inicial: `[]`.
- Callbacks expuestos:
  - `toggleHabit(bossId, habitId)` — invierte el booleano de forma inmutable (CAPA 2).
  - `updateBoss(bossId, updatedBoss)` — reemplaza inmutablemente un jefe en
    `bossesState` y **reconcilia** `completedState` (RF-8.7): conserva el marcado de
    hábitos que persisten, agrega `false` para hábitos nuevos, descarta huérfanos.
  - `finishWeek()` — construye la entrada de historial (ver sección 11), la agrega a
    `historyState` y reinicia `completedState` a `false` sin tocar `bossesState`.
  - `resetDefaults()` — opcional: restablece `bossesState` a la semilla.
- Renderiza `AppShell`; conmuta el contenido según `activeView` (Tablero / Historial
  / Ajustes) y propaga estado + callbacks.

### AppShell.jsx
- Contenedor de página: fondo, ancho máximo en escritorio, padding responsivo.
- Slots: `header` (NavBar) y `children` (contenido de la vista).

### NavBar.jsx
- Props: `activeView`, `onChangeView`.
- **(CAPA 3)** Tres accesos: **Tablero Actual**, **Historial de Semanas** y
  **Ajustes**.
- Resalta la vista activa (estado seleccionado).
- Iconos Lucide: `LayoutGrid` (tablero), `History` (historial), `Settings` (ajustes).
- Objetivos táctiles cómodos en móvil; en pantallas pequeñas se muestran solo los
  iconos para que quepan los tres accesos.

### WeeklyBoard.jsx
- Props: `bosses` (array de 6), **(CAPA 2)** `completedState`, `onToggleHabit`,
  `onFinishWeek`.
- Por cada jefe pasa a `BossCard` su `completedHabits` (`completedState[boss.id]`) y
  `onToggleHabit`. El cálculo de progreso puede hacerse aquí o dentro de `BossCard`
  (ver sección 10); el diseño lo ubica en `BossCard` para mantener el board simple.
- Encabezado del tablero con `FinishWeekButton` alineado.
- **Escritorio:** `grid` de 6 columnas (`lg:grid-cols-6`), gap uniforme.
- **Móvil:** carrusel horizontal con `overflow-x-auto` + `snap-x snap-mandatory`;
  cada `BossCard` con `snap-center` y ancho ~80–85vw para "espiar" la siguiente.
- Alternativa móvil aceptable: apilado vertical (`grid-cols-1`). Se elige carrusel
  como opción principal por comodidad del pulgar.

### BossCard.jsx
- Props: `boss`, **(CAPA 2)** `completedHabits` (`{ [habitId]: boolean }`),
  `onToggleHabit(bossId, habitId)`.
- **(CAPA 2)** Deriva el progreso: suma `habit.weight` de los hábitos cuyo
  `completedHabits[habit.id] === true`. El resultado (`progress`, 0–100) alimenta a
  `ProgressBar`.
- **(CAPA 2)** Deriva la derrota: `defeated = progress >= 80` (constante
  `WIN_THRESHOLD = 80`). Este valor va a `DefeatedOverlay.visible`. No hay flag
  `defeated` externo.
- Estructura vertical (flex-col, altura completa de la columna):
  1. `BossAvatar` (zona superior).
  2. Nombre del Jefe + badge con el **color de acento** (CAPA 3: ya no hay label de
     dificultad; el badge usa el acento o se omite).
  3. `HabitList` (recibe `completedHabits` y un handler de toggle por hábito).
  4. `ProgressBar` (value = `progress`) anclada abajo.
  5. `DefeatedOverlay` (visible = `defeated`) posicionado absoluto sobre la tarjeta.
- Borde/acento de color según `boss.accent`.
- La transición suave del overlay se mantiene vía clases de opacidad (ver componente).

### BossAvatar.jsx
- Props: `src` (URL de imagen editable por el usuario) | `name` | `accent`.
- **(CAPA 3)** Si `src` es una URL, se muestra la imagen (`object-cover`). Si está
  vacía o falla la carga (`onError`), cae al placeholder con icono Lucide (`Skull`) y
  fondo tenue con el color de acento.

### HabitList.jsx / HabitItem.jsx
- `HabitList` recibe `habits`, **(CAPA 2)** `completedHabits` y `onToggleHabit`, y
  renderiza un `HabitItem` por hábito pasándole su estado `checked` y el handler.
- `HabitItem` **(CAPA 2)** deja de ser texto plano y pasa a ser una **fila
  interactiva**:
  - Props: `name`, `weight`, `checked`, `onToggle`.
  - Renderiza un `<label>` que envuelve un `<input type="checkbox">` accesible (clase
    `sr-only` o `peer`) + un checkbox **estilizado con Tailwind** (caja redondeada,
    estado marcado con color de acento e icono `Check` de Lucide).
  - La fila completa es clicable, con área de toque ≥ 44px (`min-h`, `py`), cursor
    pointer y estados `hover`/`focus-visible`.
  - El peso `"NN%"` se mantiene a la derecha; el nombre tacha o atenúa opcionalmente
    al marcarse para feedback visual.

### ProgressBar.jsx
- Props: `value` (default `0`), `accent`.
- Pista de fondo + relleno; el ancho del relleno es `value%`.
- **(CAPA 2)** `value` es dinámico (progreso calculado) y el relleno anima con
  `transition-all` al cambiar.
- Etiqueta con el porcentaje actual.

### DefeatedOverlay.jsx
- Props: `visible` (default `false`).
- Capa absoluta translúcida sobre la tarjeta con sello "DERROTADO" e icono Lucide
  (`Trophy`/`Swords`).
- **(CAPA 2)** `visible` se controla por la condición `progress ≥ 80%`. La aparición
  y ocultación usan `transition-opacity` para un cambio suave. `pointer-events-none`
  para no bloquear los checkboxes cuando está oculto.

### FinishWeekButton.jsx
- Botón estético prominente, texto "Finalizar Semana", icono Lucide (`Flag`).
- **(CAPA 3)** `onClick` **funcional**: pide **confirmación** (RF-10.5) y, si se
  confirma, invoca `onFinishWeek` (→ `App.finishWeek`).

### HistoryView.jsx
- Props: `history` (array de semanas archivadas).
- **(CAPA 3)** Si `history` está vacío: estado vacío con icono Lucide (`History`),
  título "Historial de Semanas" y texto "Aún no hay semanas registradas".
- Si hay semanas: las lista (más reciente primero) renderizando un `HistoryWeekCard`
  por semana.

### HistoryWeekCard.jsx (CAPA 3)
- Props: `week` (`{ id, label, defeatedCount, totalBosses, results[] }`).
- Muestra: fecha/label, un resumen "X / N jefes derrotados" y el desglose por jefe
  (nombre + porcentaje final, marcando visualmente los derrotados con su acento).

### SettingsView.jsx (CAPA 3)
- Props: `bosses`, `onUpdateBoss(bossId, updatedBoss)`, `onResetDefaults?`.
- Lista los 6 Jefes, cada uno en un `BossEditor`.
- Encabezado con título "Ajustes" y, opcionalmente, botón "Restablecer valores".

### BossEditor.jsx (CAPA 3)
- Props: `boss`, `onChange(updatedBoss)`.
- Campos: **nombre** (input texto), **URL de avatar** (input texto con preview que usa
  `BossAvatar`), **color de acento** (`AccentPicker`).
- Lista de hábitos editable: un `HabitEditorRow` por hábito + botón "Añadir hábito".
- Muestra la **suma de pesos** del jefe y un **aviso visible** cuando ≠ 100%
  (RF-8.5). No bloquea la edición, pero advierte.
- Todas las ediciones producen un `updatedBoss` inmutable que sube por `onChange`.

### AccentPicker.jsx (CAPA 3)
- Props: `value` (accent actual), `onChange(accent)`.
- Muestra `ACCENT_COLORS` como botones circulares con `bg-{color}-500`; el
  seleccionado se resalta con anillo. Accesible (botones con `aria-label`).

### HabitEditorRow.jsx (CAPA 3)
- Props: `habit` (`{ id, name, weight }`), `onChange(updatedHabit)`, `onRemove()`.
- Campos: **texto** del hábito (input) y **peso** (input numérico 0–100).
- Botón de eliminar (icono Lucide `Trash2`). Validación ligera del peso (clamp 0–100).

## 6. Sistema visual (Tailwind)

- **Enfoque:** mobile-first. Breakpoints: base (móvil) → `md` (tablet) → `lg`
  (escritorio, 6 columnas).
- **Color de acento (CAPA 3, editable por el usuario):** cada jefe tiene un `accent`
  de `ACCENT_COLORS` (`emerald`, `amber`, `rose`, `purple`, `indigo`, `lime`,
  `orange`, `red`). La semilla Naruto mantiene un degradado ligero→extremo
  (emerald → lime → amber → orange → rose → red), pero el usuario puede cambiarlo.
- **Safelist:** todas las clases dinámicas `bg/text/border/ring-{accent}-{shade}` y
  sus variantes `peer-checked:` / `peer-focus-visible:` deben estar en el safelist de
  Tailwind, incluidos `purple` e `indigo`.
- **Tarjetas:** `rounded-2xl`, sombra suave, borde con color de acento, `p-4`.
- **Tipografía:** título de Jefe destacado; hábitos en tamaño cómodo; pesos con
  color atenuado.
- **Espaciado:** `gap-4` en el grid; padding responsivo en el shell.
- **Modo oscuro:** opcional, previsto vía clases `dark:` (no obligatorio en capa 1).

## 7. Comportamiento responsivo (resumen)

| Breakpoint | Layout del tablero                    | Navegación           |
|-----------|----------------------------------------|----------------------|
| Móvil     | Carrusel horizontal (snap) o apilado   | Barra compacta       |
| Tablet    | Grid 2–3 columnas                      | Barra superior       |
| Escritorio| Grid de 6 columnas                     | Barra superior       |

## 8. Accesibilidad

- Botones y accesos de navegación con texto o `aria-label`.
- Contraste suficiente entre texto y fondo.
- Objetivos táctiles ≥ 44px en móvil.
- Carrusel navegable por teclado (focus + scroll).

## 9. Arquitectura de estado e interactividad (CAPA 2)

### 9.1 Forma del estado

`App.jsx` mantiene `completedState` con la estructura:

```js
// { [bossId]: { [habitId]: boolean } }
{
  "boss-1": { "b1-h1": false, "b1-h2": true, "b1-h3": false },
  "boss-2": { ... },
  // ...6 jefes
}
```

Inicialización (todos en `false`), derivada de `mockBosses`:

```js
const initialCompleted = Object.fromEntries(
  mockBosses.map((boss) => [
    boss.id,
    Object.fromEntries(boss.habits.map((h) => [h.id, false])),
  ])
);
```

### 9.2 Actualización inmutable

```js
function toggleHabit(bossId, habitId) {
  setCompletedState((prev) => ({
    ...prev,
    [bossId]: { ...prev[bossId], [habitId]: !prev[bossId][habitId] },
  }));
}
```

### 9.3 Cálculo de progreso (derivado, sin estado extra)

En `BossCard`, a partir de `boss.habits` y `completedHabits`:

```js
const progress = boss.habits.reduce(
  (sum, h) => (completedHabits[h.id] ? sum + h.weight : sum),
  0
);
```

### 9.4 Condición de victoria

```js
const WIN_THRESHOLD = 80;              // porcentaje
const defeated = progress >= WIN_THRESHOLD;
// → <DefeatedOverlay visible={defeated} />
```

`progress` y `defeated` son valores **derivados** en cada render; no se almacenan.
Al no persistir, el estado vive en memoria y se reinicia al recargar (ver "fuera de
alcance" en requirements).

## 10. Persistencia en localStorage (CAPA 3)

### 10.1 Claves versionadas — `src/lib/storage.js`

```js
export const STORAGE_KEYS = {
  bosses: "hbt.bossesState.v1",
  completed: "hbt.completedState.v1",
  history: "hbt.historyState.v1",
};

// Lectura tolerante a fallos: si no existe o el JSON es inválido, devuelve fallback.
export function loadState(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw == null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function saveState(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* almacenamiento lleno o no disponible: se ignora silenciosamente */
  }
}
```

### 10.2 Hook — `src/hooks/usePersistentState.js`

Estado de React sincronizado con `localStorage` de forma reactiva e inmutable:

```js
import { useState, useEffect } from "react";
import { loadState, saveState } from "../lib/storage";

export function usePersistentState(key, initializer) {
  const [state, setState] = useState(() =>
    loadState(key, typeof initializer === "function" ? initializer() : initializer)
  );
  useEffect(() => {
    saveState(key, state);
  }, [key, state]);
  return [state, setState];
}
```

`App.jsx` usa este hook para `bossesState`, `completedState` e `historyState`. Todas
las actualizaciones siguen el patrón inmutable (spread), de modo que al cambiar la
referencia el `useEffect` persiste automáticamente.

### 10.3 Inicialización / semilla

- `bossesState` → `loadState(keys.bosses, DEFAULT_BOSSES)`.
- `completedState` → `loadState(keys.completed, buildEmptyCompleted(bossesState))`.
- `historyState` → `loadState(keys.history, [])`.

## 11. "Finalizar Semana" e Historial (CAPA 3)

Helpers en `src/lib/bossUtils.js`:

```js
export const WIN_THRESHOLD = 80;

export function getBossProgress(boss, completedForBoss = {}) {
  return boss.habits.reduce(
    (sum, h) => (completedForBoss[h.id] ? sum + h.weight : sum),
    0
  );
}

export function buildEmptyCompleted(bosses) {
  return Object.fromEntries(
    bosses.map((b) => [b.id, Object.fromEntries(b.habits.map((h) => [h.id, false]))])
  );
}

// Reconciliación tras editar un jefe (RF-8.7).
export function reconcileCompleted(prevForBoss = {}, habits) {
  return Object.fromEntries(
    habits.map((h) => [h.id, prevForBoss[h.id] ?? false])
  );
}
```

`App.finishWeek()`:

```js
function finishWeek() {
  const results = bossesState.map((boss) => {
    const progress = getBossProgress(boss, completedState[boss.id]);
    return {
      bossId: boss.id,
      name: boss.name,
      accent: boss.accent,
      progress,
      defeated: progress >= WIN_THRESHOLD,
    };
  });
  const entry = {
    id: `week-${Date.now()}`,
    label: formatWeekLabel(new Date()),         // ej. "Semana de Noviembre"
    archivedAt: new Date().toISOString(),
    defeatedCount: results.filter((r) => r.defeated).length,
    totalBosses: results.length,
    results,
  };
  setHistoryState((prev) => [entry, ...prev]);   // inmutable, más reciente primero
  setCompletedState(buildEmptyCompleted(bossesState)); // reinicia marcado
}
```

`formatWeekLabel` usa `Intl.DateTimeFormat('es', { month: 'long' })` para producir
"Semana de \<Mes\>".

## 12. PWA (CAPA 3)

### 12.1 `public/manifest.webmanifest`

```json
{
  "name": "Habit Boss Tracker",
  "short_name": "HabitBoss",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "background_color": "#020617",
  "theme_color": "#020617",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

Enlazado desde `index.html` con `<link rel="manifest" href="/manifest.webmanifest">`.

### 12.2 Service worker — `public/sw.js`

- Estrategia simple de **app shell**: en `install` precachea el shell; en `fetch`
  responde desde caché con fallback a red (cache-first para assets).
- Caché versionada (`CACHE = "hbt-v1"`); en `activate` elimina cachés antiguas para
  permitir actualizaciones (RF-11.4).
- Nota: en build de Vite los assets llevan hash, por lo que el SW puede optar por
  cache-first dinámico (cachear al vuelo las respuestas `ok`) además del precache del
  HTML, garantizando funcionamiento offline tras la primera visita.

### 12.3 Registro — `src/main.jsx`

```js
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  });
}
```

Los datos (bosses, marcado, historial) viven en `localStorage`, así que la app es
plenamente funcional sin conexión una vez cargado el shell.

## 13. Notas / mejoras futuras (fuera de alcance)

- Exportar/importar configuración e historial (JSON).
- Sincronización multi-dispositivo (requiere backend).
- Animación de volteo 3D de la tarjeta al derrotar al jefe.
- Reordenar jefes mediante drag & drop en Ajustes.
