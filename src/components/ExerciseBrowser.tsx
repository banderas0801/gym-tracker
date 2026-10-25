'use client';

import React, { useState, useMemo } from 'react';
import { Search, X, Dumbbell, Filter, Info, ArrowLeft } from 'lucide-react';
import { Exercise } from '@/types/workout';
import exercisesData from '@/data/exercises.json';
import { translateMuscle, translateEquipment, translateCategory, translateInstructions } from '@/lib/translations';
import { getExerciseGuide } from '@/lib/exerciseGuide';

const MUSCLE_GROUPS = [
  { id: 'all', label: 'Tất cả' },
  { id: 'chest', label: 'Ngực (Chest)' },
  { id: 'lats', label: 'Lưng xô (Lats)' },
  { id: 'middle back', label: 'Lưng giữa' },
  { id: 'lower back', label: 'Lưng dưới' },
  { id: 'shoulders', label: 'Vai (Shoulders)' },
  { id: 'biceps', label: 'Tay trước (Biceps)' },
  { id: 'triceps', label: 'Tay sau (Triceps)' },
  { id: 'quadriceps', label: 'Đùi trước (Quads)' },
  { id: 'hamstrings', label: 'Đùi sau' },
  { id: 'glutes', label: 'Mông (Glutes)' },
  { id: 'calves', label: 'Bắp chuối (Calves)' },
  { id: 'abdominals', label: 'Cơ bụng (Abs)' },
];

interface ExerciseBrowserProps {
  onBackToHome?: () => void;
}

export default function ExerciseBrowser({ onBackToHome }: ExerciseBrowserProps) {
  const [search, setSearch] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState('all');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  const allExercises = exercisesData as unknown as Exercise[];

  const filteredExercises = useMemo(() => {
    return allExercises.filter((ex) => {
      const matchSearch =
        ex.name.toLowerCase().includes(search.toLowerCase()) ||
        ex.primaryMuscles.some((m) => m.toLowerCase().includes(search.toLowerCase())) ||
        (ex.equipment && ex.equipment.toLowerCase().includes(search.toLowerCase()));

      const matchMuscle =
        selectedMuscle === 'all' ||
        ex.primaryMuscles.includes(selectedMuscle) ||
        ex.secondaryMuscles?.includes(selectedMuscle);

      return matchSearch && matchMuscle;
    });
  }, [allExercises, search, selectedMuscle]);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24 px-3 sm:px-4 animate-in fade-in duration-300">
      {/* Search & Filter Header */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 shadow-xl space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-extrabold text-white flex items-center space-x-2">
              <Dumbbell className="w-5 h-5 text-emerald-400" />
              <span>Thư Viện Bài Tập Chi Tiết ({allExercises.length} bài)</span>
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Tra cứu hướng dẫn chuẩn động tác, nhóm cơ tác động và hình ảnh minh họa tư thế
            </p>
          </div>

          {onBackToHome && (
            <button
              type="button"
              onClick={onBackToHome}
              className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700 transition shrink-0 flex items-center space-x-1.5 text-xs font-bold active:scale-95 shadow-sm"
              title="Quay lại Trang Chủ Giáo Án"
            >
              <ArrowLeft className="w-4 h-4 text-emerald-400 stroke-[2.5]" />
              <span>Trang Chủ</span>
            </button>
          )}
        </div>

        <div className="relative">
          <Search className="w-5 h-5 absolute left-3.5 top-3.5 text-zinc-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên bài tập (Squat, Deadlift, Bench Press, Curl, Kéo xô...)"
            className="w-full bg-zinc-950 border border-zinc-700/80 rounded-2xl pl-11 pr-10 py-3 text-base text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition shadow-inner"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3.5 top-3.5 text-zinc-500 hover:text-zinc-300"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Muscle Filter Carousel */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1.5 scrollbar-none text-xs sm:text-sm">
          {MUSCLE_GROUPS.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedMuscle(m.id)}
              className={`px-4 py-2 rounded-2xl font-bold shrink-0 transition whitespace-nowrap active:scale-95 ${
                selectedMuscle === m.id
                  ? 'bg-emerald-500 text-zinc-950 shadow-md shadow-emerald-500/20'
                  : 'bg-zinc-950 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Exercises */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredExercises.slice(0, 48).map((ex) => {
          const imageSrc =
            ex.images && ex.images.length > 0
              ? `https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/${ex.images[0]}`
              : null;

          return (
            <div
              key={ex.id}
              onClick={() => setSelectedExercise(ex)}
              className="bg-zinc-900 border border-zinc-800 rounded-3xl p-4 hover:border-zinc-700 hover:scale-[1.01] transition shadow-lg cursor-pointer group flex flex-col justify-between space-y-3.5"
            >
              <div className="space-y-3">
                {/* Image */}
                <div className="w-full h-48 sm:h-52 rounded-2xl bg-zinc-950 overflow-hidden border border-zinc-800 flex items-center justify-center relative">
                  {imageSrc ? (
                    <img
                      src={imageSrc}
                      alt={ex.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      loading="lazy"
                    />
                  ) : (
                    <Dumbbell className="w-10 h-10 text-zinc-700" />
                  )}

                  <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md text-xs text-zinc-200 capitalize font-bold border border-zinc-700/60">
                    {ex.level || 'Tất cả'}
                  </div>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-black text-white group-hover:text-emerald-400 transition line-clamp-1">
                    {ex.name}
                  </h3>
                  <div className="flex flex-wrap items-center gap-1.5 mt-2 text-xs">
                    <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/15 text-emerald-400 font-extrabold border border-emerald-500/30 capitalize">
                      {ex.primaryMuscles.map(translateMuscle).join(', ')}
                    </span>
                    {ex.equipment && (
                      <span className="px-2.5 py-0.5 rounded-lg bg-zinc-800 text-zinc-300 font-semibold capitalize border border-zinc-700/50">
                        {translateEquipment(ex.equipment)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-2.5 border-t border-zinc-800/80 flex items-center justify-between text-xs sm:text-sm text-zinc-400 font-medium">
                <span>Xem kỹ thuật & form</span>
                <span className="text-emerald-400 group-hover:translate-x-1 transition font-black text-base">→</span>
              </div>
            </div>
          );
        })}
      </div>

      {filteredExercises.length > 48 && (
        <div className="text-center text-xs sm:text-sm text-zinc-500 pt-4">
          Đang hiển thị 48 / {filteredExercises.length} bài tập. Nhập từ khóa để tìm chính xác hơn.
        </div>
      )}

      {/* Detail Modal */}
      {selectedExercise && (() => {
        const guide = getExerciseGuide(
          selectedExercise.id,
          selectedExercise.name,
          selectedExercise.equipment,
          selectedExercise.primaryMuscles[0]
        );
        const steps = (guide.detailedStepsVi && guide.detailedStepsVi.length > 0)
          ? guide.detailedStepsVi
          : (selectedExercise.instructionsVi && selectedExercise.instructionsVi.length > 0)
          ? selectedExercise.instructionsVi
          : translateInstructions(selectedExercise.instructions);

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
            <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-5 sm:p-6 max-w-xl w-full max-h-[92vh] overflow-y-auto space-y-4 shadow-2xl">
              <div className="flex justify-between items-start gap-3 border-b border-zinc-800 pb-3">
                <div className="min-w-0">
                  <h3 className="text-xl sm:text-2xl font-black text-white">{guide.vietnameseName || selectedExercise.name}</h3>
                  <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs sm:text-sm">
                    <span className="text-emerald-400 font-black capitalize">
                      {selectedExercise.primaryMuscles.map(translateMuscle).join(', ')}
                    </span>
                    <span>•</span>
                    <span className="text-zinc-200 font-semibold capitalize">{translateEquipment(selectedExercise.equipment)}</span>
                    <span>•</span>
                    <span className="text-zinc-400 font-mono text-xs">{selectedExercise.name}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedExercise(null)}
                  className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white border border-zinc-700 transition shrink-0 flex items-center space-x-1.5 text-xs sm:text-sm font-bold active:scale-95 shadow-sm"
                  title="Quay lại danh sách bài tập"
                >
                  <ArrowLeft className="w-4 h-4 text-emerald-400 stroke-[2.5]" />
                  <span>Quay lại</span>
                </button>
              </div>

              {/* Side-by-side start / peak pictures */}
              <div className="grid grid-cols-2 gap-3">
                {selectedExercise.images?.map((img, i) => (
                  <div key={i} className="rounded-2xl overflow-hidden border border-zinc-800 bg-black shadow-md">
                    <img
                      src={`https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/${img}`}
                      alt="Demonstration"
                      className="w-full h-48 sm:h-56 object-cover"
                    />
                    <div className="text-xs sm:text-sm font-bold text-zinc-200 text-center py-2 bg-zinc-900/90 border-t border-zinc-800">
                      {i === 0 ? '① Bắt đầu (Start)' : '② Co siết đỉnh (Peak)'}
                    </div>
                  </div>
                ))}
              </div>

              {/* Form Cues */}
              {guide.formCues && guide.formCues.length > 0 && (
                <div className="bg-emerald-950/25 border border-emerald-500/30 rounded-2xl p-4 space-y-2.5">
                  <h4 className="text-xs sm:text-sm font-black text-emerald-400">
                    💡 Khẩu quyết kỹ thuật chuẩn:
                  </h4>
                  <ul className="text-xs sm:text-sm text-zinc-100 space-y-2 pl-1">
                    {guide.formCues.map((cue, i) => (
                      <li key={i} className="flex items-start space-x-2.5">
                        <span className="text-emerald-400 font-black shrink-0 text-base leading-none">•</span>
                        <span className="leading-relaxed font-medium">{cue}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Instruction Steps 100% Vietnamese */}
              <div className="space-y-2.5 pt-2 border-t border-zinc-800">
                <h4 className="text-xs sm:text-sm font-black uppercase tracking-wider text-zinc-300">
                  Chi tiết các bước thực hiện:
                </h4>
                <div className="space-y-2.5">
                  {steps.map((step, i) => (
                    <div key={i} className="text-xs sm:text-sm text-zinc-100 leading-relaxed bg-zinc-900/80 p-3 rounded-2xl border border-zinc-800 flex items-start space-x-2.5">
                      <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-black flex items-center justify-center shrink-0 text-xs mt-0.5">
                        {i + 1}
                      </span>
                      <span className="flex-1 font-medium">{step.replace(/^Bước \d+:\s*/, '')}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedExercise(null)}
                className="w-full py-3.5 sm:py-4 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-sm sm:text-base transition flex items-center justify-center space-x-2 active:scale-95 border border-zinc-700"
              >
                <ArrowLeft className="w-4 h-4 text-emerald-400 stroke-[2.5]" />
                <span>Quay lại danh sách bài tập</span>
              </button>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
