import { useState } from "react";
import AppShell from "./components/layout/AppShell.jsx";
import NavBar from "./components/layout/NavBar.jsx";
import WeeklyBoard from "./components/board/WeeklyBoard.jsx";
import HistoryView from "./components/history/HistoryView.jsx";
import SettingsView from "./components/settings/SettingsView.jsx";
import ConfirmModal from "./components/common/ConfirmModal.jsx";
import { usePersistentState } from "./hooks/usePersistentState.js";
import { STORAGE_KEYS } from "./lib/storage.js";
import { DEFAULT_BOSSES } from "./data/mockBosses.js";
import {
  getBossProgress,
  isDefeated,
  buildEmptyCompleted,
  reconcileCompletedForBoss,
  formatWeekLabel,
} from "./lib/bossUtils.js";

export default function App() {
  // Vista activa (UI, no persistida).
  const [activeView, setActiveView] = useState("board");

  // Modal de confirmación para "Finalizar Semana".
  const [confirmOpen, setConfirmOpen] = useState(false);

  // --- Estados persistidos ---
  const [bossesState, setBossesState] = usePersistentState(
    STORAGE_KEYS.bosses,
    () => DEFAULT_BOSSES
  );

  const [completedState, setCompletedState] = usePersistentState(
    STORAGE_KEYS.completed,
    () => buildEmptyCompleted(DEFAULT_BOSSES)
  );

  const [historyState, setHistoryState] = usePersistentState(
    STORAGE_KEYS.history,
    () => []
  );

  // --- Callbacks ---

  // Alterna de forma inmutable el estado de un hábito concreto.
  const toggleHabit = (bossId, habitId) => {
    setCompletedState((prev) => ({
      ...prev,
      [bossId]: {
        ...prev[bossId],
        [habitId]: !prev[bossId]?.[habitId],
      },
    }));
  };

  // Reemplaza un jefe en bossesState y reconcilia su marcado (RF-8.7).
  const updateBoss = (bossId, updatedBoss) => {
    setBossesState((prev) =>
      prev.map((boss) => (boss.id === bossId ? updatedBoss : boss))
    );
    setCompletedState((prev) => ({
      ...prev,
      [bossId]: reconcileCompletedForBoss(prev[bossId], updatedBoss.habits),
    }));
  };

  // Restablece el universo a la semilla por defecto y reinicia el marcado.
  const resetDefaults = () => {
    setBossesState(DEFAULT_BOSSES);
    setCompletedState(buildEmptyCompleted(DEFAULT_BOSSES));
  };

  // Archiva la semana actual en el historial y reinicia el marcado.
  const finishWeek = () => {
    const results = bossesState.map((boss) => {
      const progress = getBossProgress(boss, completedState[boss.id]);
      return {
        bossId: boss.id,
        name: boss.name,
        accent: boss.accent,
        progress,
        defeated: isDefeated(progress),
      };
    });

    const entry = {
      id: `week-${Date.now()}`,
      label: formatWeekLabel(new Date()),
      archivedAt: new Date().toISOString(),
      defeatedCount: results.filter((r) => r.defeated).length,
      totalBosses: results.length,
      results,
    };

    setHistoryState((prev) => [entry, ...prev]);
    setCompletedState(buildEmptyCompleted(bossesState));
    setConfirmOpen(false);
  };

  return (
    <AppShell
      header={<NavBar activeView={activeView} onChangeView={setActiveView} />}
    >
      {activeView === "board" && (
        <WeeklyBoard
          bosses={bossesState}
          completedState={completedState}
          onToggleHabit={toggleHabit}
          onFinishWeek={() => setConfirmOpen(true)}
        />
      )}

      {activeView === "history" && <HistoryView history={historyState} />}

      {activeView === "settings" && (
        <SettingsView
          bosses={bossesState}
          onUpdateBoss={updateBoss}
          onResetDefaults={resetDefaults}
        />
      )}

      <ConfirmModal
        open={confirmOpen}
        title="Finalizar la semana"
        message="Se archivará esta semana en el historial y se reiniciarán todos los hábitos marcados. Tu configuración de jefes se conserva. ¿Continuar?"
        confirmLabel="Finalizar semana"
        cancelLabel="Cancelar"
        onConfirm={finishWeek}
        onCancel={() => setConfirmOpen(false)}
      />
    </AppShell>
  );
}
