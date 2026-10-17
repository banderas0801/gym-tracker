'use client';

import React, { useState } from 'react';
import { Play, Plus, Dumbbell, Calendar, Flame, ChevronRight, Layers, Sparkles, Wand2, Compass } from 'lucide-react';
import { RoutineTemplate, WorkoutSession, WorkoutExerciseItem, SetLog, Exercise } from '@/types/workout';
import { getRoutines, saveRoutine, getPreviousPerformance } from '@/lib/storage';
import { getExerciseMedia } from '@/lib/exerciseMedia';
import { getTodayRecommendation } from '@/lib/workoutGenerator';
import ExerciseSelectorModal from './ExerciseSelectorModal';
import SmartWorkoutModal from './SmartWorkoutModal';

interface RoutineListProps {
  onStartSession: (session: WorkoutSession) => void;
}

export default function RoutineList({ onStartSession }: RoutineListProps) {
  const [routines, setRoutines] = useState<RoutineTemplate[]>(() => getRoutines());
  const [isCreatingRoutine, setIsCreatingRoutine] = useState(false);
  const [newRoutineName, setNewRoutineName] = useState('');
  const [newRoutineFocus, setNewRoutineFocus] = useState('');
  const [newRoutineExercises, setNewRoutineExercises] = useState<
    { exerciseId: string; exerciseName: string; defaultSets: number; defaultReps: number }[]
  >([]);
  const [isExerciseModalOpen, setIsExerciseModalOpen] = useState(false);
  const [isSmartModalOpen, setIsSmartModalOpen] = useState(false);
  const [todayRec, setTodayRec] = useState(() => getTodayRecommendation(1));

  React.useEffect(() => {
    setTodayRec(getTodayRecommendation(new Date().getDay()));
  }, []);

  // Bắt đầu buổi tập gợi ý hôm nay (1-chạm)
  const handleStartTodayRecommendation = () => {
    const matched = routines.find((r) => r.id === todayRec.routineId) || routines[0];
    if (matched) {
      handleStartRoutine(matched);
    }
  };

  // Bắt đầu buổi tập từ 1 giáo án có sẵn
  const handleStartRoutine = (routine: RoutineTemplate) => {
    const exercises: WorkoutExerciseItem[] = routine.exercises.map((rEx) => {
      const prev = getPreviousPerformance(rEx.exerciseId);

      const sets: SetLog[] = Array.from({ length: rEx.defaultSets }).map((_, i) => ({
        id: `set-${Date.now()}-${i + 1}`,
        setNumber: i + 1,
        setType: 'normal',
        weightKg: (prev[i]?.weightKg && prev[i].weightKg > 0) ? prev[i].weightKg : (rEx.suggestedWeightKg || 0),
        reps: prev[i]?.reps || rEx.defaultReps || 10,
        isCompleted: false,
        previousWeightKg: prev[i]?.weightKg,
        previousReps: prev[i]?.reps,
      }));

      return {
        exerciseId: rEx.exerciseId,
        exerciseName: rEx.exerciseName,
        primaryMuscle: routine.targetFocus.split(',')[0] || 'Cơ bắp',
        sets,
      };
    });

    const session: WorkoutSession = {
      id: `session-${Date.now()}`,
      title: routine.name,
      startTime: new Date().toISOString(),
      durationSeconds: 0,
      exercises,
      totalVolumeKg: 0,
      totalSets: 0,
    };

    onStartSession(session);
  };

  // Bắt đầu buổi tập tự do (Empty Workout)
  const handleStartEmptyWorkout = () => {
    const session: WorkoutSession = {
      id: `session-${Date.now()}`,
      title: 'Buổi Tập Tự Do',
      startTime: new Date().toISOString(),
      durationSeconds: 0,
      exercises: [],
      totalVolumeKg: 0,
      totalSets: 0,
    };
    onStartSession(session);
  };

  // Lưu giáo án mới
  const handleSaveNewRoutine = () => {
    if (!newRoutineName.trim()) {
      alert('Vui lòng nhập tên giáo án');
      return;
    }
    if (newRoutineExercises.length === 0) {
      alert('Vui lòng thêm ít nhất một bài tập vào giáo án');
      return;
    }

    const created: RoutineTemplate = {
      id: `routine-${Date.now()}`,
      name: newRoutineName.trim(),
      targetFocus: newRoutineFocus.trim() || 'Toàn thân',
      exercises: newRoutineExercises,
    };

    saveRoutine(created);
    setRoutines(getRoutines());
    setIsCreatingRoutine(false);
    setNewRoutineName('');
    setNewRoutineFocus('');
    setNewRoutineExercises([]);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-24 px-3 sm:px-4 animate-in fade-in duration-300">
      {/* 1. GỢI Ý HÔM NAY (TODAY'S AI RECOMMENDATION HERO CARD) */}
      <div className="bg-gradient-to-br from-emerald-950/90 via-zinc-900 to-zinc-950 border-2 border-emerald-500/50 rounded-3xl p-5 sm:p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 opacity-15 pointer-events-none">
          <Sparkles className="w-56 h-56 text-emerald-400" />
        </div>

        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-extrabold text-xs border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>GỢI Ý HÔM NAY ({todayRec.dayName})</span>
            </div>
            <span className="text-[11px] text-zinc-400 font-mono font-medium">
              Thời lượng: ~{todayRec.suggestedDuration} phút
            </span>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center space-x-2">
              <span>{todayRec.title}</span>
            </h2>
            <p className="text-xs text-zinc-300 mt-1 leading-relaxed max-w-xl">
              {todayRec.description}
            </p>
            <div className="flex items-center space-x-2 mt-2 text-[11px] text-zinc-400">
              <span className="font-semibold text-emerald-400">Cơ bắp kích hoạt:</span>
              <span>{todayRec.focusMuscles}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-3">
            <button
              type="button"
              onClick={handleStartTodayRecommendation}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-zinc-950 font-black text-sm sm:text-base shadow-lg shadow-emerald-500/25 transition flex items-center justify-center space-x-2 active:scale-95"
            >
              <Play className="w-5 h-5 fill-zinc-950" />
              <span>Vào Tập Ngay Buổi Đề Xuất (1-Chạm)</span>
            </button>

            <button
              type="button"
              onClick={() => setIsSmartModalOpen(true)}
              className="px-5 py-3 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs sm:text-sm border border-zinc-700 transition flex items-center justify-center space-x-2 active:scale-95 shadow-md"
            >
              <Wand2 className="w-4 h-4 text-amber-400" />
              <span>Trợ Lý Tạo Buổi Tập (Theo Ý Bạn)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Action Options: Tập Tự Do & Tạo Lịch Thủ Công */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          onClick={handleStartEmptyWorkout}
          className="p-4 rounded-2xl bg-zinc-900/90 hover:bg-zinc-850 border border-zinc-800 text-left transition group active:scale-[0.99]"
        >
          <div className="text-sm font-bold text-zinc-200 group-hover:text-emerald-400 transition flex items-center space-x-2">
            <Play className="w-4 h-4 text-zinc-400 group-hover:text-emerald-400" />
            <span>Tập Tự Do (Tự Chọn Bài)</span>
          </div>
          <div className="text-xs text-zinc-400 mt-1">Không theo giáo án cố định, thêm bài tùy ý</div>
        </button>

        <button
          onClick={() => setIsCreatingRoutine(true)}
          className="p-4 rounded-2xl bg-zinc-900/90 hover:bg-zinc-850 border border-zinc-800 text-left transition group active:scale-[0.99]"
        >
          <div className="text-sm font-bold text-zinc-200 group-hover:text-emerald-400 transition flex items-center space-x-2">
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>Tự Thiết Kế Giáo Án Mới</span>
          </div>
          <div className="text-xs text-zinc-400 mt-1">Lưu lại lịch tập riêng phù hợp với bạn</div>
        </button>
      </div>

      {/* Routine Templates Header */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-emerald-400" />
            <span>Giáo Án & Lịch Tập ({routines.length})</span>
          </h3>
          <p className="text-xs text-zinc-400">Chọn một giáo án để bắt đầu theo kế hoạch chuẩn</p>
        </div>
      </div>

      {/* Routine Grid */}
      <div className="space-y-4">
        {routines.map((routine) => (
          <div
            key={routine.id}
            className={`border rounded-3xl p-5 hover:border-zinc-700 transition shadow-lg space-y-3 group ${
              routine.level === 'Newbie'
                ? 'bg-gradient-to-br from-emerald-950/30 to-zinc-900 border-emerald-500/40 shadow-emerald-950/20'
                : 'bg-zinc-900 border-zinc-800'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1.5 min-w-0">
                <div className="flex flex-wrap items-center gap-1.5">
                  {routine.level === 'Newbie' && (
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      ⭐ DÀNH CHO NGƯỜI MỚI (NEWBIE)
                    </span>
                  )}
                  {routine.level === 'Intermediate' && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      🔥 PHÂN HÓA PPL
                    </span>
                  )}
                </div>
                <h4 className="text-base sm:text-lg font-bold text-white group-hover:text-emerald-400 transition">
                  {routine.name}
                </h4>
                <p className="text-xs text-zinc-400">{routine.targetFocus}</p>
                {routine.description && (
                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                    {routine.description}
                  </p>
                )}
              </div>

              <button
                onClick={() => handleStartRoutine(routine)}
                className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold text-xs sm:text-sm flex items-center space-x-1.5 shadow-md shadow-emerald-500/15 transition shrink-0 self-start"
              >
                <Play className="w-3.5 h-3.5 fill-zinc-950" />
                <span>Bắt đầu</span>
              </button>
            </div>

            {/* Exercises List inside routine */}
            <div className="pt-3 border-t border-zinc-800/80 space-y-2">
              <div className="text-xs uppercase font-bold text-zinc-400 tracking-wider">
                {routine.exercises.length} Bài Tập Trong Buổi:
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {routine.exercises.map((ex, i) => {
                  const media = getExerciseMedia(ex.exerciseId, ex.exerciseName);
                  return (
                    <div
                      key={i}
                      className="bg-zinc-950/70 border border-zinc-800/70 rounded-2xl p-2.5 flex items-center justify-between space-x-3"
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <div className="w-11 h-11 rounded-xl bg-zinc-900 border border-zinc-800 shrink-0 overflow-hidden flex items-center justify-center">
                          {media.startImageUrl ? (
                            <img
                              src={media.startImageUrl}
                              alt={ex.exerciseName}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          ) : (
                            <Dumbbell className="w-5 h-5 text-zinc-600" />
                          )}
                        </div>
                        <span className="text-zinc-200 font-semibold text-sm truncate">
                          {i + 1}. {ex.exerciseName}
                        </span>
                      </div>
                      <span className="text-emerald-400 font-mono text-xs font-semibold shrink-0 bg-zinc-900 px-2.5 py-1 rounded-lg border border-zinc-800/80">
                        {ex.defaultSets} × {ex.defaultReps} {ex.suggestedWeightKg ? `(~${ex.suggestedWeightKg}kg)` : ''}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Tạo Lịch Tập Mới */}
      {isCreatingRoutine && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl w-full max-w-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <Layers className="w-5 h-5 text-emerald-400" />
              <span>Thiết Lập Giáo Án Tập Mới</span>
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-zinc-400">Tên Giáo Án (*)</label>
                <input
                  type="text"
                  value={newRoutineName}
                  onChange={(e) => setNewRoutineName(e.target.value)}
                  placeholder="Ví dụ: Upper Body (Thân Trên)"
                  className="w-full mt-1 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-400">Nhóm Cơ Tập Trung</label>
                <input
                  type="text"
                  value={newRoutineFocus}
                  onChange={(e) => setNewRoutineFocus(e.target.value)}
                  placeholder="Ví dụ: Ngực, Lưng, Vai"
                  className="w-full mt-1 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Danh sách bài tập đã chọn */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-zinc-400">
                    Danh Sách Bài Tập ({newRoutineExercises.length})
                  </label>
                  <button
                    onClick={() => setIsExerciseModalOpen(true)}
                    className="text-xs text-emerald-400 font-bold hover:underline flex items-center space-x-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Thêm bài</span>
                  </button>
                </div>

                {newRoutineExercises.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-zinc-900 border border-zinc-800 rounded-xl p-2.5 flex items-center justify-between text-xs"
                  >
                    <span className="text-white font-medium">{item.exerciseName}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-zinc-400">
                        {item.defaultSets} sets × {item.defaultReps} reps
                      </span>
                      <button
                        onClick={() =>
                          setNewRoutineExercises(newRoutineExercises.filter((_, i) => i !== idx))
                        }
                        className="text-zinc-500 hover:text-red-400"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-4 border-t border-zinc-800">
              <button
                onClick={() => setIsCreatingRoutine(false)}
                className="px-4 py-2 rounded-xl text-zinc-400 hover:text-white text-xs font-semibold"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveNewRoutine}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold text-xs shadow-md"
              >
                Lưu Giáo Án
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Chọn bài tập khi tạo giáo án */}
      <ExerciseSelectorModal
        isOpen={isExerciseModalOpen}
        onClose={() => setIsExerciseModalOpen(false)}
        onSelectExercise={(ex: Exercise) => {
          setNewRoutineExercises((prev) => [
            ...prev,
            {
              exerciseId: ex.id,
              exerciseName: ex.name,
              defaultSets: 3,
              defaultReps: 10,
            },
          ]);
        }}
      />

      {/* Modal Trợ Lý Tạo Buổi Tập Thông Minh */}
      <SmartWorkoutModal
        isOpen={isSmartModalOpen}
        onClose={() => setIsSmartModalOpen(false)}
        onStartSession={onStartSession}
      />
    </div>
  );
}
