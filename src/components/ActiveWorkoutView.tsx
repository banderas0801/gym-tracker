'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Plus,
  Trash2,
  Trophy,
  Dumbbell,
  Copy,
  Calculator,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { WorkoutSession, WorkoutExerciseItem, SetLog, Exercise, SetType } from '@/types/workout';
import {
  calculate1RM,
  getPreviousPerformance,
  getPersonalRecord,
  saveWorkoutSession,
} from '@/lib/storage';
import { getExerciseGuide } from '@/lib/exerciseGuide';
import { getExerciseMedia, ExerciseMediaInfo } from '@/lib/exerciseMedia';
import ExerciseSelectorModal from './ExerciseSelectorModal';
import RestTimerModal from './RestTimerModal';
import PlateCalculatorModal from './PlateCalculatorModal';
import { triggerHaptic } from '@/lib/haptics';

// Sub-components (Phase 2 refactor)
import WorkoutHeader from './workout/WorkoutHeader';
import SetRow from './workout/SetRow';
import StarterComboPanel from './workout/StarterComboPanel';
import ImagePreviewModal from './workout/ImagePreviewModal';
import ExerciseGuideDrawer from './workout/ExerciseGuideDrawer';
import NextExerciseSuggestion from './workout/NextExerciseSuggestion';

interface ActiveWorkoutViewProps {
  initialSession: WorkoutSession;
  onFinishWorkout: () => void;
  onDiscardWorkout: () => void;
  onMinimize?: () => void;
}

export default function ActiveWorkoutView({
  initialSession,
  onFinishWorkout,
  onDiscardWorkout,
  onMinimize,
}: ActiveWorkoutViewProps) {
  const [session, setSession] = useState<WorkoutSession>(initialSession);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  const [isExerciseModalOpen, setIsExerciseModalOpen] = useState(false);
  const [isRestTimerOpen, setIsRestTimerOpen] = useState(false);
  const [restSeconds, setRestSeconds] = useState(90);

  const [isPlateModalOpen, setIsPlateModalOpen] = useState(false);
  const [calcInitialWeight, setCalcInitialWeight] = useState(60);

  const [prCelebration, setPrCelebration] = useState<{ exerciseName: string; weight: number; e1rm: number } | null>(null);
  const [expandedGuideId, setExpandedGuideId] = useState<string | null>(null);
  const [previewMedia, setPreviewMedia] = useState<ExerciseMediaInfo | null>(null);

  // ─── Handlers ───────────────────────────────────────────

  const handleApplySuggestedWeight = (exIdx: number, weight: number) => {
    triggerHaptic('medium');
    setSession((prev) => {
      const updated = { ...prev };
      const ex = updated.exercises[exIdx];
      ex.sets.forEach((s) => {
        if (!s.isCompleted) s.weightKg = weight;
      });
      return updated;
    });
  };

  const handleQuickAdjustWeight = (exIdx: number, delta: number) => {
    triggerHaptic('light');
    setSession((prev) => {
      const updated = { ...prev };
      const ex = updated.exercises[exIdx];
      const targetSet = ex.sets.find((s) => !s.isCompleted) || ex.sets[ex.sets.length - 1];
      if (targetSet) {
        targetSet.weightKg = Math.max(0, Math.round((targetSet.weightKg + delta) * 100) / 100);
      }
      return updated;
    });
  };

  const handleQuickAdjustReps = (exIdx: number, delta: number) => {
    triggerHaptic('light');
    setSession((prev) => {
      const updated = { ...prev };
      const ex = updated.exercises[exIdx];
      const targetSet = ex.sets.find((s) => !s.isCompleted) || ex.sets[ex.sets.length - 1];
      if (targetSet) {
        targetSet.reps = Math.max(1, targetSet.reps + delta);
      }
      return updated;
    });
  };

  const handleCopyPreviousSet = (exIdx: number) => {
    triggerHaptic('medium');
    setSession((prev) => {
      const updated = { ...prev };
      const ex = updated.exercises[exIdx];
      const uncompletedIdx = ex.sets.findIndex((s) => !s.isCompleted);
      if (uncompletedIdx > 0) {
        const prevSet = ex.sets[uncompletedIdx - 1];
        ex.sets[uncompletedIdx].weightKg = prevSet.weightKg;
        ex.sets[uncompletedIdx].reps = prevSet.reps;
      }
      return updated;
    });
  };

  // ─── Timer ──────────────────────────────────────────────

  useEffect(() => {
    if (!isTimerRunning) return;
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // ─── Memoized Calculations ─────────────────────────────

  const totalVolume = useMemo(() => session.exercises.reduce((acc, ex) => {
    return acc + ex.sets.reduce((sAcc, s) => {
      return s.isCompleted ? sAcc + (s.weightKg || 0) * (s.reps || 0) : sAcc;
    }, 0);
  }, 0), [session.exercises]);

  const totalCompletedSets = useMemo(() => session.exercises.reduce((acc, ex) => {
    return acc + ex.sets.filter((s) => s.isCompleted).length;
  }, 0), [session.exercises]);

  const totalPlannedSets = useMemo(() => session.exercises.reduce((acc, ex) => {
    return acc + ex.sets.length;
  }, 0), [session.exercises]);

  // ─── Exercise Management ───────────────────────────────

  const handleAddExercise = (exercise: Exercise) => {
    const prevSets = getPreviousPerformance(exercise.id);

    const initialSets: SetLog[] = [
      {
        id: `set-${Date.now()}-1`, setNumber: 1, setType: 'normal',
        weightKg: prevSets[0]?.weightKg || 0, reps: prevSets[0]?.reps || 10,
        isCompleted: false, previousWeightKg: prevSets[0]?.weightKg, previousReps: prevSets[0]?.reps,
      },
      {
        id: `set-${Date.now()}-2`, setNumber: 2, setType: 'normal',
        weightKg: prevSets[1]?.weightKg || prevSets[0]?.weightKg || 0, reps: prevSets[1]?.reps || prevSets[0]?.reps || 10,
        isCompleted: false, previousWeightKg: prevSets[1]?.weightKg, previousReps: prevSets[1]?.reps,
      },
      {
        id: `set-${Date.now()}-3`, setNumber: 3, setType: 'normal',
        weightKg: prevSets[2]?.weightKg || prevSets[0]?.weightKg || 0, reps: prevSets[2]?.reps || prevSets[0]?.reps || 10,
        isCompleted: false, previousWeightKg: prevSets[2]?.weightKg, previousReps: prevSets[2]?.reps,
      },
    ];

    const newItem: WorkoutExerciseItem = {
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      primaryMuscle: exercise.primaryMuscles[0] || 'Toàn thân',
      sets: initialSets,
    };

    setSession((prev) => ({ ...prev, exercises: [...prev.exercises, newItem] }));
  };

  const handleAddSuggestedExercise = (exerciseId: string, exerciseName: string, primaryMuscle: string) => {
    const guide = getExerciseGuide(exerciseId, exerciseName, null, primaryMuscle);
    const weight = guide.startingWeightGuide.recommendedWeightKg || 10;

    const initialSets: SetLog[] = [
      { id: `set-${Date.now()}-1`, setNumber: 1, setType: 'normal', weightKg: weight, reps: 10, isCompleted: false },
      { id: `set-${Date.now()}-2`, setNumber: 2, setType: 'normal', weightKg: weight, reps: 10, isCompleted: false },
      { id: `set-${Date.now()}-3`, setNumber: 3, setType: 'normal', weightKg: weight, reps: 10, isCompleted: false },
    ];

    setSession((prev) => ({
      ...prev,
      exercises: [...prev.exercises, { exerciseId, exerciseName, primaryMuscle, sets: initialSets }],
    }));
  };

  const handleAddStarterCombo = (type: 'fullbody' | 'upper' | 'lower') => {
    const combos = {
      fullbody: [
        { id: 'Barbell_Bench_Press_-_Medium_Grip', name: 'Barbell Bench Press', muscle: 'Ngực', weight: 20 },
        { id: 'Wide-Grip_Lat_Pulldown', name: 'Lat Pulldown (Máy Kéo Xô)', muscle: 'Lưng xô', weight: 20 },
        { id: 'Leg_Press', name: 'Leg Press (Đạp Đùi Máy)', muscle: 'Đùi trước', weight: 40 },
      ],
      upper: [
        { id: 'Barbell_Bench_Press_-_Medium_Grip', name: 'Barbell Bench Press', muscle: 'Ngực', weight: 20 },
        { id: 'Wide-Grip_Lat_Pulldown', name: 'Lat Pulldown (Kéo Xô)', muscle: 'Lưng xô', weight: 20 },
        { id: 'Dumbbell_Shoulder_Press', name: 'Dumbbell Shoulder Press', muscle: 'Vai', weight: 6 },
        { id: 'Triceps_Pushdown', name: 'Triceps Pushdown', muscle: 'Tay sau', weight: 10 },
      ],
      lower: [
        { id: 'Leg_Press', name: 'Leg Press (Đạp Đùi Máy)', muscle: 'Đùi trước', weight: 40 },
        { id: 'Romanian_Deadlift', name: 'Romanian Deadlift', muscle: 'Đùi sau', weight: 20 },
        { id: 'Standing_Calf_Raises', name: 'Standing Calf Raises', muscle: 'Bắp chân', weight: 20 },
      ],
    };

    const chosen = combos[type];
    const newItems: WorkoutExerciseItem[] = chosen.map((item, idx) => ({
      exerciseId: item.id,
      exerciseName: item.name,
      primaryMuscle: item.muscle,
      sets: [
        { id: `combo-set-${Date.now()}-${idx}-1`, setNumber: 1, setType: 'warmup' as SetType, weightKg: Math.round(item.weight * 0.7), reps: 12, isCompleted: false },
        { id: `combo-set-${Date.now()}-${idx}-2`, setNumber: 2, setType: 'normal' as SetType, weightKg: item.weight, reps: 10, isCompleted: false },
        { id: `combo-set-${Date.now()}-${idx}-3`, setNumber: 3, setType: 'normal' as SetType, weightKg: item.weight, reps: 10, isCompleted: false },
      ],
    }));

    setSession((prev) => ({ ...prev, exercises: [...prev.exercises, ...newItems] }));
  };

  // ─── Suggested Next Exercises ──────────────────────────

  const suggestedNextExercises = useMemo(() => {
    const existingIds = new Set(session.exercises.map((e) => e.exerciseId));
    const pool = [
      { id: 'Wide-Grip_Lat_Pulldown', name: 'Lat Pulldown (Kéo Xô)', muscle: 'Lưng xô', tip: 'Cân bằng cơ kéo' },
      { id: 'Incline_Dumbbell_Press', name: 'Incline Dumbbell Press', muscle: 'Ngực trên', tip: 'Phát triển ngực trên' },
      { id: 'Dumbbell_Shoulder_Press', name: 'Dumbbell Shoulder Press', muscle: 'Vai', tip: 'Bổ trợ thân trên' },
      { id: 'Side_Lateral_Raise', name: 'Side Lateral Raise', muscle: 'Vai giữa', tip: 'Tạo bờ vai rộng' },
      { id: 'Triceps_Pushdown', name: 'Triceps Pushdown', muscle: 'Tay sau', tip: 'Khóa khớp an toàn' },
      { id: 'Barbell_Curl', name: 'Bicep Curl', muscle: 'Tay trước', tip: 'Cô lập bắp tay' },
      { id: 'Leg_Press', name: 'Leg Press (Đạp Đùi)', muscle: 'Đùi trước', tip: 'Thân dưới vững chắc' },
      { id: 'Romanian_Deadlift', name: 'Romanian Deadlift', muscle: 'Đùi sau', tip: 'Chống đau lưng dưới' },
    ];
    return pool.filter((p) => !existingIds.has(p.id)).slice(0, 3);
  }, [session.exercises]);

  // ─── Set Management ────────────────────────────────────

  const handleRemoveExercise = (exerciseIndex: number) => {
    setSession((prev) => ({
      ...prev,
      exercises: prev.exercises.filter((_, i) => i !== exerciseIndex),
    }));
  };

  const handleAddSet = (exerciseIndex: number) => {
    setSession((prev) => {
      const updated = { ...prev };
      const ex = updated.exercises[exerciseIndex];
      const lastSet = ex.sets[ex.sets.length - 1];
      const newSetNumber = ex.sets.length + 1;

      ex.sets.push({
        id: `set-${Date.now()}-${newSetNumber}`,
        setNumber: newSetNumber,
        setType: 'normal',
        weightKg: lastSet?.weightKg || 0,
        reps: lastSet?.reps || 10,
        isCompleted: false,
        previousWeightKg: lastSet?.previousWeightKg,
        previousReps: lastSet?.previousReps,
      });

      return updated;
    });
  };

  const handleRemoveSet = (exerciseIndex: number, setIndex: number) => {
    setSession((prev) => {
      const updated = { ...prev };
      const ex = updated.exercises[exerciseIndex];
      ex.sets = ex.sets.filter((_, i) => i !== setIndex);
      ex.sets.forEach((s, idx) => (s.setNumber = idx + 1));
      return updated;
    });
  };

  const handleUpdateSet = (
    exerciseIndex: number,
    setIndex: number,
    field: 'weightKg' | 'reps' | 'setType',
    value: any
  ) => {
    setSession((prev) => {
      const updated = { ...prev };
      const s = updated.exercises[exerciseIndex].sets[setIndex];
      (s as any)[field] = value;
      return updated;
    });
  };

  const handleCycleSetType = (exerciseIndex: number, setIndex: number) => {
    const types: SetType[] = ['normal', 'warmup', 'drop', 'failure'];
    setSession((prev) => {
      const updated = { ...prev };
      const s = updated.exercises[exerciseIndex].sets[setIndex];
      const currentIdx = types.indexOf(s.setType);
      s.setType = types[(currentIdx + 1) % types.length];
      return updated;
    });
  };

  const handleToggleSetComplete = (exerciseIndex: number, setIndex: number) => {
    setSession((prev) => {
      const updated = { ...prev };
      const ex = updated.exercises[exerciseIndex];
      const s = ex.sets[setIndex];
      const nextState = !s.isCompleted;
      s.isCompleted = nextState;

      if (nextState) {
        const currentPr = getPersonalRecord(ex.exerciseId);
        const this1RM = calculate1RM(s.weightKg, s.reps);

        if (s.weightKg > currentPr.maxWeight || this1RM > currentPr.max1RM) {
          confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.7 },
            colors: ['#10b981', '#f59e0b', '#3b82f6', '#ec4899'],
          });
          setPrCelebration({ exerciseName: ex.exerciseName, weight: s.weightKg, e1rm: this1RM });
          setTimeout(() => setPrCelebration(null), 3500);
        }

        setIsRestTimerOpen(true);
      }

      return updated;
    });
  };

  // ─── Finish Workout ────────────────────────────────────

  const handleFinish = () => {
    const finalSession: WorkoutSession = {
      ...session,
      endTime: new Date().toISOString(),
      durationSeconds: elapsedSeconds,
      totalVolumeKg: totalVolume,
      totalSets: totalCompletedSets,
    };

    saveWorkoutSession(finalSession);
    confetti({ particleCount: 150, spread: 90, origin: { y: 0.5 } });
    onFinishWorkout();
  };

  // ─── Render ────────────────────────────────────────────

  return (
    <div className="max-w-3xl mx-auto pb-28 pt-2 px-3 sm:px-4 space-y-5 animate-in fade-in duration-300">
      {/* PR Celebration Banner */}
      {prCelebration && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-amber-500 to-emerald-500 text-zinc-950 px-5 py-2.5 rounded-full font-extrabold text-sm shadow-xl flex items-center space-x-2 animate-bounce">
          <Trophy className="w-5 h-5 text-zinc-950" />
          <span>
            KỶ LỤC MỚI (PR)! {prCelebration.exerciseName}: {prCelebration.weight}kg (1RM:{' '}
            {prCelebration.e1rm}kg)
          </span>
        </div>
      )}

      {/* Header */}
      <WorkoutHeader
        title={session.title}
        onTitleChange={(title) => setSession({ ...session, title })}
        elapsedSeconds={elapsedSeconds}
        isTimerRunning={isTimerRunning}
        onToggleTimer={() => setIsTimerRunning(!isTimerRunning)}
        totalVolume={totalVolume}
        totalCompletedSets={totalCompletedSets}
        totalPlannedSets={totalPlannedSets}
        exerciseCount={session.exercises.length}
        restSeconds={restSeconds}
        onOpenRestTimer={() => setIsRestTimerOpen(true)}
        onOpenPlateCalculator={() => {
          setCalcInitialWeight(60);
          setIsPlateModalOpen(true);
        }}
        onFinish={handleFinish}
        onMinimize={onMinimize}
      />

      {/* Exercise List */}
      <div className="space-y-4">
        {session.exercises.length === 0 ? (
          <StarterComboPanel onAddCombo={handleAddStarterCombo} />
        ) : (
          session.exercises.map((exItem, exIdx) => {
            const pr = getPersonalRecord(exItem.exerciseId);
            const guide = getExerciseGuide(exItem.exerciseId, exItem.exerciseName, null, exItem.primaryMuscle);
            const media = getExerciseMedia(exItem.exerciseId, exItem.exerciseName);

            return (
              <div
                key={exItem.exerciseId + exIdx}
                className="bg-zinc-900 border border-zinc-800 rounded-3xl p-4 sm:p-5 shadow-lg space-y-3.5"
              >
                {/* Exercise Header with Thumbnail */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center space-x-3 min-w-0">
                    <button
                      type="button"
                      onClick={() => setPreviewMedia(media)}
                      className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-zinc-950 border border-zinc-800 shrink-0 overflow-hidden group hover:border-emerald-500/50 transition cursor-pointer"
                      title="Bấm để xem ảnh phóng to & tư thế chuẩn"
                    >
                      {media.startImageUrl ? (
                        <img
                          src={media.startImageUrl}
                          alt={exItem.exerciseName}
                          className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-600">
                          <Dumbbell className="w-6 h-6" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition flex items-center justify-center">
                        <span className="text-[9px] bg-black/70 backdrop-blur-sm px-1.5 py-0.5 rounded text-emerald-400 font-bold opacity-0 group-hover:opacity-100 transition">
                          Xem
                        </span>
                      </div>
                    </button>

                    <div className="min-w-0">
                      <h3 className="text-base font-bold text-white flex items-center space-x-2 truncate">
                        <span className="truncate">{exItem.exerciseName}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const highestWeight = Math.max(...exItem.sets.map((s) => s.weightKg), 60);
                            setCalcInitialWeight(highestWeight);
                            setIsPlateModalOpen(true);
                          }}
                          className="p-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-amber-400 transition shrink-0"
                          title="Tính bánh tạ đòn cho bài này"
                        >
                          <Calculator className="w-3.5 h-3.5" />
                        </button>
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 mt-0.5 text-xs">
                        <span className="text-emerald-400 font-medium capitalize">{exItem.primaryMuscle}</span>
                        {media.equipment && (
                          <span className="text-zinc-500 text-[11px] capitalize">• {media.equipment}</span>
                        )}
                        {pr.maxWeight > 0 && (
                          <span className="text-amber-400 text-[11px] flex items-center space-x-0.5">
                            <Trophy className="w-3 h-3 inline" />
                            <span>PR: {pr.maxWeight}kg (1RM: {pr.max1RM}kg)</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRemoveExercise(exIdx)}
                    className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-zinc-800 transition shrink-0"
                    title="Xóa bài tập này"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Collapsible Guide Drawer */}
                <ExerciseGuideDrawer
                  exerciseId={exItem.exerciseId}
                  guide={guide}
                  media={media}
                  isExpanded={expandedGuideId === exItem.exerciseId}
                  onToggle={() => setExpandedGuideId(expandedGuideId === exItem.exerciseId ? null : exItem.exerciseId)}
                  onApplySuggestedWeight={(weight) => handleApplySuggestedWeight(exIdx, weight)}
                  onPreviewMedia={() => setPreviewMedia(media)}
                />

                {/* Set Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="text-zinc-500 uppercase text-[10px] tracking-wider border-b border-zinc-800">
                        <th className="pb-2 w-12 text-center">Set</th>
                        <th className="pb-2 pl-2">Trước đó</th>
                        <th className="pb-2 text-center w-24">Kg</th>
                        <th className="pb-2 text-center w-20">Reps</th>
                        <th className="pb-2 text-center w-12">1RM</th>
                        <th className="pb-2 text-center w-12">✓</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/40">
                      {exItem.sets.map((set, setIdx) => (
                        <SetRow
                          key={set.id}
                          set={set}
                          exerciseIndex={exIdx}
                          setIndex={setIdx}
                          onCycleSetType={handleCycleSetType}
                          onUpdateSet={handleUpdateSet}
                          onToggleComplete={handleToggleSetComplete}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Quick Steppers & Actions */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-zinc-800/80">
                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => handleAddSet(exIdx)}
                      className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-xs flex items-center space-x-1 transition active:scale-95"
                    >
                      <Plus className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Thêm Set</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCopyPreviousSet(exIdx)}
                      className="px-2.5 py-1.5 rounded-xl bg-zinc-800/70 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold flex items-center space-x-1 transition active:scale-95"
                      title="Sao chép mức tạ và reps từ hiệp trước sang hiệp chưa hoàn thành"
                    >
                      <Copy className="w-3 h-3 text-teal-400" />
                      <span className="hidden sm:inline">Sao chép hiệp trước</span>
                      <span className="sm:hidden">Sao chép</span>
                    </button>
                  </div>

                  {/* Quick Weight/Rep Adjustments */}
                  <div className="flex items-center space-x-1 text-[11px]">
                    <span className="text-zinc-500 text-[10px] mr-0.5 hidden sm:inline">Chỉnh nhanh:</span>
                    <button type="button" onClick={() => handleQuickAdjustWeight(exIdx, -2.5)} className="px-2 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold active:scale-90 transition" title="Giảm 2.5kg">-2.5k</button>
                    <button type="button" onClick={() => handleQuickAdjustWeight(exIdx, 2.5)} className="px-2 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-emerald-400 font-bold active:scale-90 transition" title="Tăng 2.5kg">+2.5k</button>
                    <button type="button" onClick={() => handleQuickAdjustWeight(exIdx, 5)} className="px-2 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-emerald-400 font-bold active:scale-90 transition" title="Tăng 5kg">+5k</button>
                    <button type="button" onClick={() => handleQuickAdjustReps(exIdx, 1)} className="px-2 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-amber-400 font-bold active:scale-90 transition" title="Tăng 1 rep">+1 rep</button>
                  </div>
                </div>

                {/* Exercise Volume Footer */}
                <div className="text-[11px] text-zinc-500 text-right pr-1">
                  Volume bài: {(exItem.sets.reduce((sum, s) => s.isCompleted ? sum + s.weightKg * s.reps : sum, 0)).toLocaleString()} kg
                </div>
              </div>
            );
          })
        )}

        {/* Next Exercise Suggestions */}
        {session.exercises.length > 0 && (
          <NextExerciseSuggestion
            suggestions={suggestedNextExercises}
            onAddExercise={handleAddSuggestedExercise}
          />
        )}
      </div>

      {/* Bottom Actions */}
      <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={() => setIsExerciseModalOpen(true)}
          className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-sm flex items-center justify-center space-x-2 border border-zinc-700 shadow-md transition"
        >
          <Plus className="w-5 h-5 text-emerald-400" />
          <span>Thêm Bài Tập (Exercise)</span>
        </button>

        <button
          onClick={() => {
            if (confirm('Bạn có chắc muốn hủy buổi tập này không? Dữ liệu chưa lưu sẽ bị mất.')) {
              onDiscardWorkout();
            }
          }}
          className="w-full sm:w-auto px-4 py-3 rounded-2xl text-red-400 hover:bg-red-500/10 text-xs font-semibold transition"
        >
          Hủy buổi tập
        </button>
      </div>

      {/* Modals */}
      <ExerciseSelectorModal
        isOpen={isExerciseModalOpen}
        onClose={() => setIsExerciseModalOpen(false)}
        onSelectExercise={handleAddExercise}
      />

      <RestTimerModal
        initialSeconds={restSeconds}
        isOpen={isRestTimerOpen}
        onClose={() => setIsRestTimerOpen(false)}
      />

      <PlateCalculatorModal
        isOpen={isPlateModalOpen}
        onClose={() => setIsPlateModalOpen(false)}
        initialWeight={calcInitialWeight}
      />

      <ImagePreviewModal
        media={previewMedia}
        onClose={() => setPreviewMedia(null)}
      />
    </div>
  );
}
