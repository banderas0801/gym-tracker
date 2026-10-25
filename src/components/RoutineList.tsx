'use client';

import React, { useState } from 'react';
import { Play, Plus, Dumbbell, Calendar, Flame, ChevronRight, Layers, Sparkles, Wand2, Compass, BookOpen, Wind, ShieldCheck, X, ArrowLeft } from 'lucide-react';
import { RoutineTemplate, WorkoutSession, WorkoutExerciseItem, SetLog, Exercise } from '@/types/workout';
import { getRoutines, saveRoutine, getPreviousPerformance } from '@/lib/storage';
import { getExerciseMedia } from '@/lib/exerciseMedia';
import { getTodayRecommendation } from '@/lib/workoutGenerator';
import ExerciseSelectorModal from './ExerciseSelectorModal';
import SmartWorkoutModal from './SmartWorkoutModal';
import ExerciseQuickViewModal from './ExerciseQuickViewModal';
import LevelAdvisorModal from './LevelAdvisorModal';

interface RoutineListProps {
  onStartSession: (session: WorkoutSession) => void;
}

export default function RoutineList({ onStartSession }: RoutineListProps) {
  const [routines, setRoutines] = useState<RoutineTemplate[]>(() => getRoutines());
  const [routineSystem, setRoutineSystem] = useState<'basic' | 'thol'>('basic');
  const [basicFilter, setBasicFilter] = useState<'all' | 'newbie' | 'intermediate'>('all');
  const [tholFilter, setTholFilter] = useState<'all' | 'tang1' | 'tang2' | 'tang3'>('all');
  const [isGymPhoModalOpen, setIsGymPhoModalOpen] = useState(false);
  const [isAdvisorModalOpen, setIsAdvisorModalOpen] = useState(false);
  const [isCreatingRoutine, setIsCreatingRoutine] = useState(false);
  const [newRoutineName, setNewRoutineName] = useState('');
  const [newRoutineFocus, setNewRoutineFocus] = useState('');
  const [newRoutineExercises, setNewRoutineExercises] = useState<
    { exerciseId: string; exerciseName: string; defaultSets: number; defaultReps: number }[]
  >([]);
  const [isExerciseModalOpen, setIsExerciseModalOpen] = useState(false);
  const [isSmartModalOpen, setIsSmartModalOpen] = useState(false);
  const [quickViewExerciseId, setQuickViewExerciseId] = useState<string | null>(null);
  const [quickViewExerciseName, setQuickViewExerciseName] = useState<string>('');
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
      category: 'basic',
      exercises: newRoutineExercises,
    };

    saveRoutine(created);
    setRoutines(getRoutines());
    setIsCreatingRoutine(false);
    setNewRoutineName('');
    setNewRoutineFocus('');
    setNewRoutineExercises([]);
  };

  const filteredRoutines = routines.filter((r) => {
    const isThol = r.category === 'thol' || r.id.startsWith('thol-');
    if (routineSystem === 'basic') {
      if (isThol) return false;
      if (basicFilter === 'newbie') return r.level === 'Newbie';
      if (basicFilter === 'intermediate') return r.level === 'Intermediate';
      return true;
    } else {
      if (!isThol) return false;
      if (tholFilter === 'tang1') return r.id.startsWith('thol-tang1');
      if (tholFilter === 'tang2') return r.id.startsWith('thol-tang2');
      if (tholFilter === 'tang3') return r.id.startsWith('thol-tang3');
      return true;
    }
  });

  const basicCount = routines.filter(r => r.category === 'basic' || (!r.id.startsWith('thol-') && r.category !== 'thol')).length;
  const tholCount = routines.filter(r => r.category === 'thol' || r.id.startsWith('thol-')).length;

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

      {/* ========================================================================= */}
      {/* PHÂN ĐỊNH RÕ RÀNG: GIÁO ÁN KHOA HỌC CƠ BẢN vs CẨM NANG GYM PHỔ THOL       */}
      {/* ========================================================================= */}
      <div className="bg-zinc-900/90 p-1.5 rounded-2xl border border-zinc-800 grid grid-cols-2 gap-1.5 shadow-lg">
        <button
          type="button"
          onClick={() => {
            setRoutineSystem('basic');
            setBasicFilter('all');
          }}
          className={`py-3 px-3 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center space-x-2 transition active:scale-98 ${
            routineSystem === 'basic'
              ? 'bg-emerald-500 text-zinc-950 shadow-md shadow-emerald-500/20'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-850'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>🌟 Giáo Án Cơ Bản ({basicCount})</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setRoutineSystem('thol');
            setTholFilter('all');
          }}
          className={`py-3 px-3 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center space-x-2 transition active:scale-98 ${
            routineSystem === 'thol'
              ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-zinc-950 shadow-md shadow-amber-500/20'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-850'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>🏛️ Gym Phổ THOL ({tholCount})</span>
        </button>
      </div>

      {/* 2A. GIAO DIỆN KHOA HỌC CƠ BẢN */}
      {routineSystem === 'basic' && (
        <div className="space-y-3 animate-in fade-in duration-200">
          <div className="bg-gradient-to-r from-emerald-950/40 via-zinc-900 to-zinc-950 border border-emerald-500/30 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-md">
            <div className="space-y-0.5">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono">
                  Fitness Khoa Học
                </span>
                <span className="text-xs font-bold text-white">Giáo Án Chuẩn Hóa</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Tân binh Full Body 3 buổi/tuần làm quen chuyển động & thần kinh cơ; sau đó nâng cấp lên Phân hóa Đẩy - Kéo - Chân (Push - Pull - Legs).
              </p>
            </div>
          </div>

          {/* Sub-filter Pills Cơ Bản */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none text-xs">
            <button
              type="button"
              onClick={() => setBasicFilter('all')}
              className={`px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap active:scale-95 ${
                basicFilter === 'all'
                  ? 'bg-zinc-700 text-white shadow-sm'
                  : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              Tất Cả Cơ Bản ({basicCount})
            </button>

            <button
              type="button"
              onClick={() => setBasicFilter('newbie')}
              className={`px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap active:scale-95 flex items-center space-x-1 ${
                basicFilter === 'newbie'
                  ? 'bg-emerald-500 text-black font-black shadow-sm'
                  : 'bg-zinc-900 border border-zinc-800 text-emerald-400 hover:text-emerald-300'
              }`}
            >
              <span>⭐ Tân Binh (Full Body 3 Buổi)</span>
            </button>

            <button
              type="button"
              onClick={() => setBasicFilter('intermediate')}
              className={`px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap active:scale-95 flex items-center space-x-1 ${
                basicFilter === 'intermediate'
                  ? 'bg-blue-500 text-white font-black shadow-sm'
                  : 'bg-zinc-900 border border-zinc-800 text-blue-400 hover:text-blue-300'
              }`}
            >
              <span>🔥 Phân Hóa Đẩy - Kéo - Chân (PPL)</span>
            </button>
          </div>
        </div>
      )}

      {/* 2B. GIAO DIỆN CẨM NANG GYM PHỔ THOL */}
      {routineSystem === 'thol' && (
        <div className="space-y-3 animate-in fade-in duration-200">
          <div className="bg-gradient-to-r from-amber-950/60 via-zinc-900 to-zinc-950 border border-amber-500/40 rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-mono">
                    THOL Duy Nguyễn
                  </span>
                  <span className="text-xs font-bold text-white">Cẩm Nang Gym Phổ</span>
                </div>
                <p className="text-xs text-zinc-300 mt-0.5 italic">
                  “Thể hình phục vụ cuộc sống chứ đừng để cuộc sống phục vụ thể hình.”
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setIsAdvisorModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-zinc-950 font-black text-xs flex items-center justify-center space-x-1.5 transition active:scale-95 shadow-md shadow-amber-500/20"
              >
                <Sparkles className="w-3.5 h-3.5 text-zinc-950 fill-zinc-950" />
                <span>Gợi Ý Level Phù Hợp</span>
              </button>

              <button
                type="button"
                onClick={() => setIsGymPhoModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white border border-zinc-700 font-bold text-xs flex items-center justify-center space-x-1.5 transition active:scale-95 shadow-sm"
              >
                <Wind className="w-3.5 h-3.5 text-cyan-400" />
                <span>Kỹ Thuật Hít Thở</span>
              </button>
            </div>
          </div>

          {/* Sub-filter Pills Gym Phổ */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none text-xs">
            <button
              type="button"
              onClick={() => setTholFilter('all')}
              className={`px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap active:scale-95 ${
                tholFilter === 'all'
                  ? 'bg-zinc-700 text-white shadow-sm'
                  : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              Tất Cả Gym Phổ ({tholCount})
            </button>

            <button
              type="button"
              onClick={() => setTholFilter('tang1')}
              className={`px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap active:scale-95 flex items-center space-x-1 ${
                tholFilter === 'tang1'
                  ? 'bg-emerald-500 text-black font-black shadow-sm'
                  : 'bg-zinc-900 border border-zinc-800 text-emerald-400 hover:text-emerald-300'
              }`}
            >
              <span>🎓 Tầng 1: Tạ Khối (Tuần 1-4)</span>
            </button>

            <button
              type="button"
              onClick={() => setTholFilter('tang2')}
              className={`px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap active:scale-95 flex items-center space-x-1 ${
                tholFilter === 'tang2'
                  ? 'bg-teal-400 text-black font-black shadow-sm'
                  : 'bg-zinc-900 border border-zinc-800 text-teal-300 hover:text-teal-200'
              }`}
            >
              <span>⚙️ Tầng 2: Robot Đòn Bẩy (Tuần 4-8)</span>
            </button>

            <button
              type="button"
              onClick={() => setTholFilter('tang3')}
              className={`px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap active:scale-95 flex items-center space-x-1 ${
                tholFilter === 'tang3'
                  ? 'bg-amber-400 text-black font-black shadow-sm'
                  : 'bg-zinc-900 border border-zinc-800 text-amber-300 hover:text-amber-200'
              }`}
            >
              <span>🏋️ Tầng 3: Smith & Free Weight (Tuần 8-12)</span>
            </button>
          </div>
        </div>
      )}

      {/* Routine Templates Header */}
      <div className="space-y-1 pt-1">
        <h3 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-emerald-400" />
          <span>
            {routineSystem === 'basic' ? 'Danh Sách Giáo Án Cơ Bản' : 'Danh Sách Giáo Trình Gym Phổ'} ({filteredRoutines.length} Buổi Tập)
          </span>
        </h3>
        <p className="text-xs text-zinc-400">
          {routineSystem === 'basic'
            ? 'Bấm "Bắt đầu" để nạp toàn bộ bài tập vào ca tập, hoặc chạm từng bài để xem ảnh và video tư thế chuẩn'
            : 'Tuân thủ thứ tự từng tầng để xây dựng nền tảng khớp và hệ tuần hoàn khỏe mạnh trước khi nâng tạ nặng'}
        </p>
      </div>

      {/* Routine Grid */}
      <div className="space-y-4">
        {filteredRoutines.map((routine) => (
          <div
            key={routine.id}
            className={`border rounded-3xl p-5 hover:border-zinc-700 transition shadow-lg space-y-3 group ${
              routine.id.startsWith('thol-tang1')
                ? 'bg-gradient-to-br from-emerald-950/30 to-zinc-900 border-emerald-500/40 shadow-emerald-950/20'
                : routine.id.startsWith('thol-tang2')
                ? 'bg-gradient-to-br from-teal-950/30 to-zinc-900 border-teal-500/40 shadow-teal-950/20'
                : routine.id.startsWith('thol-tang3')
                ? 'bg-gradient-to-br from-amber-950/25 to-zinc-900 border-amber-500/40 shadow-amber-950/20'
                : routine.level === 'Newbie'
                ? 'bg-gradient-to-br from-emerald-950/30 to-zinc-900 border-emerald-500/40 shadow-emerald-950/20'
                : 'bg-zinc-900 border-zinc-800'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1.5 min-w-0">
                <div className="flex flex-wrap items-center gap-1.5">
                  {routine.id.startsWith('thol-tang1') && (
                    <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-500 text-black shadow-sm font-mono">
                      🎓 GYM PHỔ TẦNG 1 (TẠ KHỐI)
                    </span>
                  )}
                  {routine.id.startsWith('thol-tang2') && (
                    <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-teal-400 text-black shadow-sm font-mono">
                      ⚙️ GYM PHỔ TẦNG 2 (ROBOT ĐÒN BẨY)
                    </span>
                  )}
                  {routine.id.startsWith('thol-tang3') && (
                    <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-amber-400 text-black shadow-sm font-mono">
                      🏋️ GYM PHỔ TẦNG 3 (FREE WEIGHT)
                    </span>
                  )}
                  {routine.level === 'Newbie' && !routine.id.startsWith('thol-') && (
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      ⭐ DÀNH CHO NGƯỜI MỚI (NEWBIE)
                    </span>
                  )}
                  {routine.level === 'Intermediate' && !routine.id.startsWith('thol-') && (
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
            <div className="pt-3.5 border-t border-zinc-800/80 space-y-2.5">
              <div className="flex items-center justify-between text-xs uppercase font-extrabold text-zinc-400 tracking-wider">
                <span>{routine.exercises.length} Bài Tập Trong Buổi:</span>
                <span className="text-xs text-emerald-400 font-semibold normal-case">Chạm bài tập để xem kỹ thuật</span>
              </div>
              <div className="grid grid-cols-1 gap-2.5">
                {routine.exercises.map((ex, i) => {
                  const media = getExerciseMedia(ex.exerciseId, ex.exerciseName);
                  return (
                    <div
                      key={i}
                      onClick={() => {
                        setQuickViewExerciseId(ex.exerciseId);
                        setQuickViewExerciseName(ex.exerciseName);
                      }}
                      className="bg-zinc-950/90 border border-zinc-800/90 hover:border-emerald-500/50 hover:bg-zinc-900 rounded-2xl p-3 sm:p-3.5 flex items-center justify-between space-x-3 cursor-pointer transition active:scale-[0.99] group/item shadow-sm"
                    >
                      <div className="flex items-center space-x-3 sm:space-x-3.5 min-w-0">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-zinc-900 border border-zinc-800 shrink-0 overflow-hidden flex items-center justify-center relative group-hover/item:border-emerald-500/40 transition shadow-inner">
                          {media.startImageUrl ? (
                            <img
                              src={media.startImageUrl}
                              alt={ex.exerciseName}
                              className="w-full h-full object-cover group-hover/item:scale-105 transition"
                              loading="lazy"
                            />
                          ) : (
                            <Dumbbell className="w-7 h-7 text-zinc-600" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="text-zinc-100 font-extrabold text-base sm:text-lg group-hover/item:text-emerald-400 transition truncate leading-snug">
                            {i + 1}. {ex.exerciseName}
                          </div>
                          <div className="text-xs sm:text-sm text-zinc-400 flex flex-wrap items-center gap-1.5 sm:gap-2 mt-1">
                            <span className="text-emerald-400 font-black font-mono bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                              {ex.defaultSets} × {ex.defaultReps} {ex.suggestedWeightKg ? `(~${ex.suggestedWeightKg}kg)` : ''}
                            </span>
                            <span>•</span>
                            <span className="text-zinc-400 font-medium">Bấm xem form</span>
                          </div>
                        </div>
                      </div>

                      <div className="px-3 py-2 rounded-xl bg-zinc-850 border border-zinc-750 text-xs sm:text-sm font-extrabold text-zinc-200 group-hover/item:text-emerald-400 group-hover/item:border-emerald-500/30 transition shrink-0 flex items-center space-x-1 shadow-sm">
                        <span>Xem</span>
                        <ChevronRight className="w-4 h-4" />
                      </div>
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
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <Layers className="w-5 h-5 text-emerald-400" />
                <span>Thiết Lập Giáo Án Tập Mới</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsCreatingRoutine(false)}
                className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 transition shrink-0 flex items-center space-x-1.5 text-xs font-bold active:scale-95 shadow-sm"
                title="Quay lại danh sách giáo án"
              >
                <ArrowLeft className="w-4 h-4 text-emerald-400 stroke-[2.5]" />
                <span>Quay lại</span>
              </button>
            </div>

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

      {/* Modal Xem Nhanh Chi Tiết Bài Tập Khi Bấm Vào */}
      <ExerciseQuickViewModal
        exerciseId={quickViewExerciseId}
        exerciseName={quickViewExerciseName}
        onClose={() => setQuickViewExerciseId(null)}
        onStartSingleExercise={(exId, exName) => {
          const singleExerciseSession: WorkoutSession = {
            id: `session-${Date.now()}`,
            title: `Tập: ${exName}`,
            startTime: new Date().toISOString(),
            durationSeconds: 0,
            exercises: [
              {
                exerciseId: exId,
                exerciseName: exName,
                primaryMuscle: 'Cơ bắp',
                sets: [
                  {
                    id: `set-${Date.now()}-1`,
                    setNumber: 1,
                    setType: 'normal',
                    weightKg: 20,
                    reps: 10,
                    isCompleted: false,
                  },
                ],
              },
            ],
            totalVolumeKg: 0,
            totalSets: 0,
          };
          onStartSession(singleExerciseSession);
        }}
      />

      {/* Modal Cẩm Nang Kiến Thức Gym Phổ (THOL Duy Nguyễn) */}
      {isGymPhoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-5 sm:p-6 space-y-5 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3 border-b border-zinc-800/80 pb-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono">
                    THOL Duy Nguyễn
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-mono">
                    Giáo Án Đẳng Cấp
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-white">
                  CẨM NANG & KỸ THUẬT GYM PHỔ
                </h3>
                <p className="text-xs text-zinc-300 italic border-l-2 border-emerald-500 pl-2 mt-1">
                  “Thể hình phục vụ cuộc sống chứ đừng để cuộc sống phục vụ thể hình.”
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsGymPhoModalOpen(false)}
                className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Phần 1: Nguyên Tắc Hít Thở Yếm Khí */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-cyan-400 flex items-center space-x-1.5">
                <Wind className="w-4 h-4 text-cyan-400" />
                <span>1. Bí Kíp Hít Thở Yếm Khí (Khóa Khớp & Tăng Lực)</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-1.5">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase font-mono block">
                    Pha Kháng Lực (Dãn Cơ)
                  </span>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    Hạ tạ chậm 2-3s: Hít thật sâu bằng mũi vào khoang bụng, nén chặt khí trong ổ bụng để khóa cứng cột sống.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-1.5">
                  <span className="text-[10px] font-bold text-cyan-400 uppercase font-mono block">
                    Pha Phát Lực (Co Cơ)
                  </span>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    Đẩy/Kéo bùng nổ: Dồn lực vượt qua điểm nặng nhất và thở dồn/thở mạnh ra bằng miệng dứt khoát.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-1.5">
                  <span className="text-[10px] font-bold text-amber-400 uppercase font-mono block">
                    Đỉnh Co Cơ (Peak)
                  </span>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    Siết cơ 0.5 - 1s: Nén chặt khí giữ tạ ở đỉnh, tập trung 100% cảm nhận vào thớ cơ mục tiêu.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-cyan-950/20 border border-cyan-500/20 text-xs text-zinc-300 flex items-start space-x-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Nghỉ giữa hiệp:</strong> Nghỉ từ 1 - 2 phút giữa các set. Trong lúc nghỉ, uống từng ngụm nhỏ nước bù khoáng điện giải hoặc Intra-workout (BCAA/EAA) để chống mỏi cơ.
                </span>
              </div>
            </div>

            {/* Phần 2: Lộ Trình 3 Tầng */}
            <div className="space-y-3 pt-2 border-t border-zinc-800">
              <h4 className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center space-x-1.5">
                <Layers className="w-4 h-4 text-emerald-400" />
                <span>2. Lộ Trình Phát Triển 3 Tầng Khoa Học</span>
              </h4>

              <div className="space-y-2">
                <div className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-start space-x-3">
                  <span className="text-xs font-mono font-black px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
                    TẦNG 1
                  </span>
                  <div>
                    <h5 className="text-xs font-bold text-white">Tuần 1 - 4: Tạ Khối (Selectorized) & Thể Trọng (Bodyweight)</h5>
                    <p className="text-[11px] text-zinc-400 leading-relaxed mt-0.5">
                      Giúp người mới kích hoạt hệ thần kinh cơ, an toàn tuyệt đối cho khớp, không lo chấn thương và thuần thục nhịp thở yếm khí.
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-start space-x-3">
                  <span className="text-xs font-mono font-black px-2 py-0.5 rounded-lg bg-teal-500/20 text-teal-300 border border-teal-500/30 shrink-0">
                    TẦNG 2
                  </span>
                  <div>
                    <h5 className="text-xs font-bold text-white">Tuần 5 - 8: Đòn Bẩy Robot (Leverage)</h5>
                    <p className="text-[11px] text-zinc-400 leading-relaxed mt-0.5">
                      Tăng tải trọng cơ bắp với máy đòn bẩy robot, cô lập từng bên cơ trái/phải độc lập để phát triển cơ bắp cân đối.
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-start space-x-3">
                  <span className="text-xs font-mono font-black px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
                    TẦNG 3
                  </span>
                  <div>
                    <h5 className="text-xs font-bold text-white">Tuần 9 - 12: Tạ Tự Do (Free Weight - Đòn & Đơn)</h5>
                    <p className="text-[11px] text-zinc-400 leading-relaxed mt-0.5">
                      Huy động toàn bộ cơ thăng bằng và nhóm cơ lõi (core), xây dựng sức mạnh nguyên bản và độ dày cơ bắp toàn diện.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Nút đóng */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setIsGymPhoModalOpen(false)}
                className="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-xs transition"
              >
                ĐÃ HIỂU & QUAY LẠI TẬP LUYỆN
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Trợ Lý Tư Vấn Level Phù Hợp */}
      <LevelAdvisorModal
        isOpen={isAdvisorModalOpen}
        onClose={() => setIsAdvisorModalOpen(false)}
        onApplyLevel={(filter) => {
          setRoutineSystem('thol');
          setTholFilter(filter as 'all' | 'tang1' | 'tang2' | 'tang3');
        }}
      />
    </div>
  );
}
