import HabitItem from "./HabitItem.jsx";

/**
 * Lista de hábitos de un Jefe.
 *
 * Props:
 * - habits: Array<{ id, name, weight }>
 * - completedHabits: { [habitId]: boolean }
 * - accent: string                  → color de acento del jefe
 * - onToggleHabit: (habitId) => void
 */
export default function HabitList({
  habits = [],
  completedHabits = {},
  accent = "emerald",
  onToggleHabit,
}) {
  return (
    <ul className="flex-1 divide-y divide-white/5">
      {habits.map((habit) => (
        <HabitItem
          key={habit.id}
          name={habit.name}
          weight={habit.weight}
          checked={!!completedHabits[habit.id]}
          accent={accent}
          onToggle={() => onToggleHabit(habit.id)}
        />
      ))}
    </ul>
  );
}
