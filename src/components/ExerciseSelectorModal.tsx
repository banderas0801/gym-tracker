'use client';

import React, { useState, useMemo } from 'react';
import { Search, X, Dumbbell, Filter, Info, Check } from 'lucide-react';
import { Exercise } from '@/types/workout';
import exercisesData from '@/data/exercises.json';
import { translateMuscle, translateEquipment, translateInstructions } from '@/lib/translations';
import { getExerciseGuide } from '@/lib/exerciseGuide';

interface ExerciseSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectExercise: (exercise: Exercise) => void;
}

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
  { id: 'abdominals', label: 'Bụng (Abs)' },
];

export default function ExerciseSelectorModal({
  isOpen,
  onClose,
  onSelectExercise,
}: ExerciseSelectorModalProps) {
  const [search, setSearch] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState('all');
  const [previewExercise, setPreviewExercise] = useState<Exercise | null>(null);

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl w-full max-w-2xl h-[85vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-800 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <Dumbbell className="w-5 h-5 text-emerald-400" />
              <span>Thư Viện Bài Tập ({allExercises.length} bài)</span>
            </h2>
            <p className="text-xs text-zinc-400">Chọn bài tập để thêm vào buổi tập của bạn</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Muscle Filters */}
        <div className="p-4 border-b border-zinc-800 space-y-3 bg-zinc-900/50">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3.5 top-3.5 text-zinc-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo tên bài tập (Bench Press, Squat, Pullup...)"
              className="w-full bg-zinc-900 border border-zinc-700/80 rounded-2xl pl-11 pr-10 py-3 text-base text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition shadow-inner"
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

          {/* Muscle Pills Carousel */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none text-xs sm:text-sm">
            {MUSCLE_GROUPS.map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedMuscle(m.id)}
                className={`px-3.5 py-2 rounded-2xl font-bold shrink-0 transition whitespace-nowrap active:scale-95 ${
                  selectedMuscle === m.id
                    ? 'bg-emerald-500 text-zinc-950 shadow-md shadow-emerald-500/20'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* List of Exercises */}
        <div className="flex-1 overflow-y-auto p-4 divide-y divide-zinc-800/60">
          {filteredExercises.length === 0 ? (
            <div className="py-20 text-center text-zinc-500 space-y-2">
              <Dumbbell className="w-10 h-10 mx-auto opacity-30" />
              <p className="text-sm">Không tìm thấy bài tập nào phù hợp</p>
            </div>
          ) : (
            filteredExercises.map((ex) => {
              const imageSrc =
                ex.images && ex.images.length > 0
                  ? `https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/${ex.images[0]}`
                  : null;

              return (
                <div
                  key={ex.id}
                  className="py-3.5 px-2 flex items-center justify-between hover:bg-zinc-900/60 rounded-2xl transition group"
                >
                  <div className="flex items-center space-x-3.5 flex-1 min-w-0 pr-3">
                    {/* Thumbnail */}
                    <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 shrink-0 overflow-hidden flex items-center justify-center shadow-inner">
                      {imageSrc ? (
                        <img
                          src={imageSrc}
                          alt={ex.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition"
                          loading="lazy"
                        />
                      ) : (
                        <Dumbbell className="w-7 h-7 text-zinc-600" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <h3 className="text-base font-black text-white truncate group-hover:text-emerald-400 transition">
                        {ex.name}
                      </h3>
                      <div className="flex flex-wrap items-center gap-1.5 mt-1 text-xs">
                        <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20 capitalize">
                          {ex.primaryMuscles.join(', ')}
                        </span>
                        {ex.equipment && (
                          <span className="px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300 capitalize font-medium">
                            {ex.equipment}
                          </span>
                        )}
                        <span className="text-zinc-500 capitalize">{ex.level}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={() => setPreviewExercise(ex)}
                      className="p-2.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
                      title="Xem hướng dẫn động tác"
                    >
                      <Info className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => {
                        onSelectExercise(ex);
                        onClose();
                      }}
                      className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-xs sm:text-sm transition flex items-center space-x-1 shadow-md shadow-emerald-500/20 active:scale-95"
                    >
                      <span>Chọn</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Chi tiết bài tập */}
        {previewExercise && (() => {
          const guide = getExerciseGuide(
            previewExercise.id,
            previewExercise.name,
            previewExercise.equipment,
            previewExercise.primaryMuscles[0]
          );
          const steps = (guide.detailedStepsVi && guide.detailedStepsVi.length > 0)
            ? guide.detailedStepsVi
            : (previewExercise.instructionsVi && previewExercise.instructionsVi.length > 0)
            ? previewExercise.instructionsVi
            : translateInstructions(previewExercise.instructions);

          return (
            <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md animate-in fade-in">
              <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-5 sm:p-6 max-w-lg w-full max-h-[92vh] overflow-y-auto space-y-4 shadow-2xl">
                <div className="flex justify-between items-start gap-3 border-b border-zinc-800 pb-3">
                  <div className="min-w-0">
                    <h3 className="text-xl sm:text-2xl font-black text-white">{guide.vietnameseName || previewExercise.name}</h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs sm:text-sm">
                      <span className="text-emerald-400 font-black capitalize">
                        {previewExercise.primaryMuscles.map(translateMuscle).join(', ')}
                      </span>
                      <span>•</span>
                      <span className="text-zinc-200 font-semibold capitalize">{translateEquipment(previewExercise.equipment)}</span>
                      <span>•</span>
                      <span className="text-zinc-400 font-mono text-xs">{previewExercise.name}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setPreviewExercise(null)}
                    className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white border border-zinc-700 transition shrink-0 flex items-center space-x-1.5 text-xs sm:text-sm font-bold active:scale-95 shadow-sm"
                    title="Quay lại danh sách"
                  >
                    <ArrowLeft className="w-4 h-4 text-emerald-400 stroke-[2.5]" />
                    <span>Quay lại</span>
                  </button>
                </div>

                {/* Demo Photos */}
                <div className="grid grid-cols-2 gap-3">
                  {previewExercise.images?.map((img, i) => (
                    <div key={i} className="rounded-2xl overflow-hidden border border-zinc-800 bg-black shadow-md">
                      <img
                        src={`https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/${img}`}
                        alt="Demo"
                        className="w-full h-44 sm:h-52 object-cover"
                      />
                      <div className="text-xs sm:text-sm text-zinc-200 text-center py-2 bg-zinc-900/90 font-bold border-t border-zinc-800">
                        {i === 0 ? '① Bắt đầu (Start)' : '② Co siết đỉnh (Peak)'}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Form Cues */}
                {guide.formCues && guide.formCues.length > 0 && (
                  <div className="bg-emerald-950/25 border border-emerald-500/30 rounded-2xl p-4 space-y-2 text-xs sm:text-sm">
                    <h4 className="font-black text-emerald-400">💡 Khẩu quyết kỹ thuật:</h4>
                    <ul className="text-zinc-100 space-y-2 pl-1">
                      {guide.formCues.map((cue, i) => (
                        <li key={i} className="flex items-start space-x-2.5">
                          <span className="text-emerald-400 font-black shrink-0 text-base leading-none">•</span>
                          <span className="leading-relaxed font-medium">{cue}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Instructions */}
                <div className="space-y-2.5 pt-2 border-t border-zinc-800">
                  <h4 className="text-xs sm:text-sm font-black uppercase tracking-wider text-zinc-300">
                    Hướng dẫn thực hiện:
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

                <div className="pt-2 flex items-center space-x-2.5">
                  <button
                    onClick={() => {
                      onSelectExercise(previewExercise);
                      setPreviewExercise(null);
                      onClose();
                    }}
                    className="flex-1 py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-zinc-950 font-black text-sm sm:text-base transition shadow-lg shadow-emerald-500/20 active:scale-95"
                  >
                    Thêm bài này vào buổi tập
                  </button>
                  <button
                    onClick={() => setPreviewExercise(null)}
                    className="px-5 py-3.5 sm:py-4 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-sm sm:text-base transition active:scale-95 border border-zinc-700"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
