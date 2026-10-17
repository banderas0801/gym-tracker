'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { SetLog, SetType } from '@/types/workout';
import { triggerHaptic } from '@/lib/haptics';

interface SetRowProps {
  set: SetLog;
  exerciseIndex: number;
  setIndex: number;
  onCycleSetType: (exerciseIndex: number, setIndex: number) => void;
  onUpdateSet: (exerciseIndex: number, setIndex: number, field: 'weightKg' | 'reps' | 'setType', value: number | string) => void;
  onToggleComplete: (exerciseIndex: number, setIndex: number) => void;
}

export default function SetRow({
  set,
  exerciseIndex,
  setIndex,
  onCycleSetType,
  onUpdateSet,
  onToggleComplete,
}: SetRowProps) {
  const est1RM =
    set.reps > 0 && set.weightKg > 0
      ? set.reps === 1
        ? set.weightKg
        : Math.round(set.weightKg * (1 + set.reps / 30) * 10) / 10
      : 0;

  const handleSetTypeClick = () => {
    triggerHaptic('light');
    onCycleSetType(exerciseIndex, setIndex);
  };

  const handleToggleClick = () => {
    triggerHaptic(set.isCompleted ? 'light' : 'success');
    onToggleComplete(exerciseIndex, setIndex);
  };

  return (
    <tr
      className={`transition ${
        set.isCompleted
          ? 'bg-emerald-500/10 text-zinc-200'
          : 'hover:bg-zinc-800/30'
      }`}
    >
      {/* Set Badge / Type */}
      <td className="py-2 text-center">
        <button
          type="button"
          onClick={handleSetTypeClick}
          className={`w-7 h-7 rounded-lg text-xs font-bold transition flex items-center justify-center mx-auto active:scale-90 ${
            set.setType === 'warmup'
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
              : set.setType === 'drop'
              ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40'
              : set.setType === 'failure'
              ? 'bg-red-500/20 text-red-400 border border-red-500/40'
              : 'bg-zinc-800 text-zinc-300'
          }`}
          title="Bấm để đổi loại Set (Normal / Warmup / Drop / Failure)"
        >
          {set.setType === 'warmup'
            ? 'W'
            : set.setType === 'drop'
            ? 'D'
            : set.setType === 'failure'
            ? 'F'
            : set.setNumber}
        </button>
      </td>

      {/* Previous weight/reps */}
      <td className="py-2 pl-1.5 sm:pl-2 text-zinc-500 font-mono text-[10px] sm:text-[11px] truncate max-w-[65px] sm:max-w-none">
        {set.previousWeightKg !== undefined
          ? `${set.previousWeightKg}k×${set.previousReps}`
          : '—'}
      </td>

      {/* Weight input - Mobile optimized: inputMode="decimal" & text-[16px] prevents iOS zoom */}
      <td className="py-2 px-1 text-center">
        <input
          type="number"
          step="0.5"
          inputMode="decimal"
          value={set.weightKg === 0 ? '' : set.weightKg}
          placeholder="0"
          onChange={(e) =>
            onUpdateSet(exerciseIndex, setIndex, 'weightKg', parseFloat(e.target.value) || 0)
          }
          className="w-16 sm:w-20 bg-zinc-950 border border-zinc-800 rounded-xl px-1 sm:px-2 py-1.5 text-center text-[16px] sm:text-sm font-bold text-white focus:outline-none focus:border-emerald-500 tabular-nums"
        />
      </td>

      {/* Reps input - Mobile optimized: inputMode="numeric" & text-[16px] prevents iOS zoom */}
      <td className="py-2 px-1 text-center">
        <input
          type="number"
          inputMode="numeric"
          value={set.reps === 0 ? '' : set.reps}
          placeholder="0"
          onChange={(e) =>
            onUpdateSet(exerciseIndex, setIndex, 'reps', parseInt(e.target.value, 10) || 0)
          }
          className="w-14 sm:w-16 bg-zinc-950 border border-zinc-800 rounded-xl px-1 sm:px-2 py-1.5 text-center text-[16px] sm:text-sm font-bold text-white focus:outline-none focus:border-emerald-500 tabular-nums"
        />
      </td>

      {/* Est 1RM */}
      <td className="py-2 text-center font-mono text-[10px] sm:text-[11px] text-zinc-400">
        {est1RM > 0 ? `${est1RM}` : '—'}
      </td>

      {/* Complete Checkbox */}
      <td className="py-2 text-center">
        <button
          type="button"
          onClick={handleToggleClick}
          className={`w-7 h-7 rounded-xl flex items-center justify-center transition mx-auto active:scale-90 ${
            set.isCompleted
              ? 'bg-emerald-500 text-zinc-950 shadow-md shadow-emerald-500/30'
              : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-600 hover:text-zinc-300 border border-zinc-700'
          }`}
        >
          <Check className="w-4 h-4 stroke-[3]" />
        </button>
      </td>
    </tr>
  );
}
