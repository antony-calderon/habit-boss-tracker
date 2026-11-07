# Requisitos — Habit Boss Tracker

## Visión general

Aplicación web responsiva (móvil + escritorio) que funciona 100% offline como PWA.
Es un sistema de gamificación de hábitos: cada semana el usuario enfrenta 6 "Jefes"
ordenados por dificultad según el estado de ánimo/exigencia. Cumplir los hábitos de
cada Jefe lo "derrota".

El proyecto se construye por capas:

- **CAPA 1 — Interfaz Visual (completada):** Estructura visual de la interfaz, sin
  lógica. Barras de progreso estáticas en 0% y porcentajes como texto estético.
- **CAPA 2 — Lógica de Combate e Interactividad (completada):** Estado de hábitos
  completados, progreso calculado en tiempo real y condición de victoria dinámica.
- **CAPA 3 — Personalización, Persistencia y PWA (actual, FINAL):** Jefes totalmente
  editables por el usuario (universo y hábitos), persistencia completa en
  `localStorage`, lógica real de "Finalizar Semana" con historial activo, y
  preparación PWA para instalación y uso offline.

## Stack tecnológico

- **Build:** Vite
- **UI:** React
- **Estilos:** Tailwind CSS
- **Iconos:** Lucide React
- **Persistencia:** `localStorage` del navegador (sin backend)
- **Distribución:** PWA offline instalable (manifest + service worker; CAPA 3)

## Glosario

- **Jefe (Boss):** Reto semanal representado como una tarjeta/columna. Agrupa un
  conjunto de hábitos.
- **Nivel de dificultad:** Clasificación del Jefe (Ligero, Medio, Extremo, etc.),
  del más suave al más extremo.
- **Hábito:** Acción concreta asociada a un Jefe, con un peso porcentual.
- **Peso porcentual:** Importancia relativa del hábito dentro del Jefe (suma esperada
  100% por Jefe).
- **Derrotado:** Estado en que un Jefe alcanza el umbral de victoria (progreso ≥ 80%).
- **Color de acento:** Color Tailwind que identifica visualmente a un Jefe (ej.
  `emerald`, `amber`, `rose`, `purple`, `indigo`). Reemplaza al antiguo "nivel de
  dificultad" como atributo editable por el usuario.
- **Universo de Jefes (`bossesState`):** Configuración editable de los 6 Jefes
  (nombre, avatar, color de acento y lista de hábitos). Persistida en `localStorage`.
- **Semana archivada:** Registro histórico de una semana finalizada: fecha, jefes
  derrotados y porcentaje final por jefe.

## Requisitos funcionales

### RF-1: Vista Principal — Tablero Semanal

- **RF-1.1** La vista principal debe mostrar **6 Jefes**, ordenados del más ligero al
  más extremo.
- **RF-1.2 (Escritorio)** Los 6 Jefes se muestran como **6 columnas** en paralelo
  dentro de un contenedor principal.
- **RF-1.3 (Móvil)** Las columnas deben **apilarse verticalmente** o presentarse como
  un **slider/carrusel horizontal** cómodo para el pulgar (scroll-snap).
- **RF-1.4** El layout debe ser responsivo y adaptarse con fluidez entre móvil, tablet
  y escritorio.

### RF-2: Tarjeta de Jefe

Cada columna/tarjeta de Jefe debe incluir, de arriba hacia abajo:

- **RF-2.1** Un espacio superior para **imagen/avatar** del personaje (placeholder en
  esta capa).
- **RF-2.2** El **nombre del Jefe** y su **nivel de dificultad** (ej. "Jefe Ligero",
  "Jefe Medio", "Jefe Extremo"), visualmente diferenciado por nivel.
- **RF-2.3** Una **lista de hábitos** específicos del Jefe, cada uno con su **peso
  porcentual** mostrado como texto (ej. "Ejercicio 60%", "Meditación 20%").
  _(CAPA 2: cada hábito pasa a ser una fila interactiva con checkbox, ver RF-5.)_
- **RF-2.4** Una **barra de progreso** en la parte inferior.
  _(CAPA 1: estática en 0%. CAPA 2: calculada en tiempo real, ver RF-6.)_
- **RF-2.5** Un **indicador de estado "Derrotado"** translúcido superpuesto a la
  tarjeta. _(CAPA 1: solo visual. CAPA 2: condicionado al progreso real, ver RF-7.)_

### RF-3: Barra de Navegación / Menú

- **RF-3.1** Navegación limpia que permita **alternar** entre:
  - **Tablero Actual** (vista principal con los 6 Jefes).
  - **Historial de Semanas** (lista de semanas archivadas).
  - **(CAPA 3) Ajustes** (edición del universo de Jefes), con icono Lucide `Settings`.
- **RF-3.2** La vista activa debe indicarse visualmente (estado seleccionado).

### RF-4: Acción de Semana

- **RF-4.1** Un **botón estético "Finalizar Semana"** visible en el Tablero.
- **RF-4.2 (CAPA 3)** El botón es **funcional**: archiva la semana actual en el
  historial y reinicia el marcado (ver RF-10).

## Requisitos funcionales — CAPA 2 (Lógica de Combate e Interactividad)

### RF-5: Estado y marcado de hábitos

- **RF-5.1** La aplicación debe mantener un **estado de hábitos completados**
  (`true`/`false`) para cada hábito de cada uno de los 6 jefes de la semana actual.
- **RF-5.2** El estado se gestiona de forma **compartida** (en `App.jsx` o estado
  equivalente) y se propaga por props a los componentes del tablero.
- **RF-5.3** Cada fila de hábito (`HabitItem`) debe convertirse en un **control
  interactivo** con un **checkbox táctil estilizado con Tailwind**, con un objetivo
  de toque cómodo (≥ 44px).
- **RF-5.4** Al activar/desactivar el checkbox de un hábito, el estado del hábito
  correspondiente debe alternar y la interfaz debe reflejar el cambio de inmediato.
- **RF-5.5** El peso porcentual del hábito sigue mostrándose junto al control.

### RF-6: Progreso dinámico

- **RF-6.1** El progreso de cada jefe se calcula **sumando el peso porcentual** de
  los hábitos marcados como completados para ese jefe.
- **RF-6.2** El rango del progreso es 0–100% (los pesos por jefe suman 100).
- **RF-6.3** La `ProgressBar` recibe el valor calculado y se actualiza **en tiempo
  real** al marcar/desmarcar hábitos, con una transición visual suave.

### RF-7: Condición de victoria dinámica

- **RF-7.1** El umbral de victoria es **80%**: un jefe se considera **derrotado**
  cuando su progreso es **≥ 80%**.
- **RF-7.2** Cuando un jefe alcanza el umbral, el `DefeatedOverlay` debe **mostrarse
  automáticamente** sobre su tarjeta con una **transición suave**.
- **RF-7.3** Si el progreso **baja por debajo del 80%** (al desmarcar hábitos), el
  overlay debe **ocultarse** automáticamente.
- **RF-7.4** La condición de derrota es **puramente derivada** del progreso; no se
  almacena un flag `defeated` independiente ni valores de prueba fijos.

## Requisitos funcionales — CAPA 3 (Personalización, Persistencia y PWA)

### RF-8: Universo de Jefes editable (`bossesState`)

- **RF-8.1** La configuración de los 6 Jefes deja de ser un dato fijo en el código y
  pasa a vivir en un estado dinámico `bossesState` en `App.jsx`.
- **RF-8.2** En el **primer arranque** (sin datos en `localStorage`), `bossesState` se
  **inicializa** con el universo Naruto por defecto (los datos actuales de
  `mockBosses.js`, que pasan a ser una **semilla**).
- **RF-8.3** En arranques posteriores, `bossesState` se **lee desde `localStorage`**.
- **RF-8.4** La vista **Ajustes** permite editar visualmente cada uno de los 6 Jefes:
  - **RF-8.4.1** Cambiar el **nombre** del personaje.
  - **RF-8.4.2** Ingresar una **URL de imagen** para el avatar.
  - **RF-8.4.3** Seleccionar su **color de acento** de una lista de colores Tailwind
    (al menos: `emerald`, `amber`, `rose`, `purple`, `indigo`; ampliable).
  - **RF-8.4.4** Editar la **lista de hábitos**: modificar el **texto** y el **peso
    porcentual** de cada hábito; añadir y eliminar hábitos.
- **RF-8.5** La UI de Ajustes debe mostrar la **suma de pesos por Jefe** y advertir de
  forma visible cuando **no sea 100%**, ayudando al usuario a corregirla.
- **RF-8.6** Los cambios en Ajustes se reflejan inmediatamente en el Tablero y se
  persisten (ver RF-9).
- **RF-8.7** Al editar la lista de hábitos de un Jefe, el `completedState` debe
  **reconciliarse**: conservar el marcado de los hábitos que siguen existiendo e
  inicializar en `false` los hábitos nuevos, sin dejar entradas huérfanas.

### RF-9: Persistencia total en `localStorage`

- **RF-9.1** Se persisten en `localStorage` de forma **inmutable** tres estados:
  - `bossesState` — diseño/universo de Jefes.
  - `completedState` — marcado de la semana actual.
  - `historyState` — registro de semanas pasadas.
- **RF-9.2** Cada estado usa una **clave versionada** propia (ej.
  `hbt.bossesState.v1`).
- **RF-9.3** La lectura inicial debe ser **tolerante a fallos**: si falta la clave o
  el JSON es inválido, se usan los valores por defecto sin romper la app.
- **RF-9.4** Toda escritura se hace sobre **copias nuevas** del estado (sin mutar), y
  la persistencia ocurre de forma reactiva ante cada cambio.

### RF-10: "Finalizar Semana" e Historial activo

- **RF-10.1** Al pulsar **Finalizar Semana**, la app **archiva** la semana actual en
  `historyState` con una estructura que captura:
  - **ID único** de la semana.
  - **Fecha formateada** legible (ej. "Semana de Noviembre").
  - **Conteo de jefes derrotados** (progreso ≥ 80%) con la configuración actual.
  - **Porcentaje final por jefe** (nombre + progreso) de los 6 jefes.
- **RF-10.2** Tras archivar, el `completedState` se **reinicia** poniendo todos los
  hábitos en `false`, iniciando una semana nueva.
- **RF-10.3** El reinicio **no** altera `bossesState`: nombres, avatares, colores y
  hábitos personalizados **se conservan**.
- **RF-10.4** La vista **Historial de Semanas** lista las semanas archivadas (más
  reciente primero), mostrando fecha, conteo de derrotados y el desglose por jefe.
- **RF-10.5** Conviene una **confirmación** antes de finalizar (evitar archivar por
  accidente), dado que reinicia el marcado.

### RF-11: PWA instalable y offline

- **RF-11.1** La app debe incluir un **`manifest.webmanifest`** con nombre, nombre
  corto, `display: standalone`, colores de tema/fondo e iconos, para ser
  **instalable** en móvil y escritorio.
- **RF-11.2** Un **service worker** debe cachear el shell de la app (HTML, CSS, JS y
  assets) para que **cargue sin conexión** tras la primera visita.
- **RF-11.3** Como los datos viven en `localStorage`, la app debe ser **plenamente
  funcional offline** (crear/editar jefes, marcar hábitos, finalizar semana, ver
  historial).
- **RF-11.4** El service worker debe permitir **actualizar** la caché cuando se
  despliega una versión nueva (estrategia de versionado de caché).

## Requisitos no funcionales

- **RNF-1 Responsividad:** Mobile-first, con breakpoints de Tailwind para escritorio.
- **RNF-2 Accesibilidad táctil:** Objetivos táctiles cómodos (mín. ~44px) y carrusel
  manejable con el pulgar en móvil.
- **RNF-3 Offline/PWA:** La arquitectura debe preparar el terreno para PWA offline
  (sin dependencias de red para render). Service worker/manifest en capa posterior.
- **RNF-4 Rendimiento:** Carga rápida y animaciones suaves (volteo de tarjeta).
- **RNF-5 Mantenibilidad:** Interfaz dividida por componentes reutilizables y datos de
  ejemplo (mock) separados de la presentación.

## Entregado por capa

### CAPA 2

- Estado de hábitos completados por jefe.
- Marcado interactivo de hábitos mediante checkbox táctil.
- Cálculo de progreso en tiempo real por jefe.
- Condición de victoria dinámica (umbral 80%) que controla el overlay "Derrotado".

### CAPA 3 (final)

- `bossesState` editable con persistencia; semilla Naruto al primer arranque.
- Vista **Ajustes** para editar nombre, avatar, color de acento y hábitos (texto +
  peso), con validación de suma 100%.
- Persistencia total en `localStorage`: `bossesState`, `completedState`,
  `historyState`.
- "Finalizar Semana" funcional: archiva la semana y reinicia el marcado conservando
  la personalización.
- Vista **Historial** activa alimentada por `historyState`.
- Manifest + service worker para PWA instalable y offline.

## Fuera de alcance (incluso tras CAPA 3)

- Backend/sincronización en la nube o multi-dispositivo (los datos son locales al
  navegador).
- Cuentas de usuario / autenticación.
- Notificaciones push.
- Exportar/importar datos (posible mejora futura).

## Riesgos y consideraciones

- **Límite de `localStorage`** (~5 MB): suficiente para este volumen de datos; el
  historial crece de forma acotada.
- **Datos locales al navegador:** limpiar el almacenamiento del navegador borra la
  configuración y el historial. Documentarlo para el usuario.
- **Clases Tailwind dinámicas por color:** los acentos editables (incluidos `purple`
  e `indigo`) deben estar en el `safelist` para no purgarse en build.
