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
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-zinc-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo tên bài tập (Bench Press, Squat, Pullup...)"
              className="w-full bg-zinc-900 border border-zinc-700/80 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3.5 top-3 text-zinc-500 hover:text-zinc-300"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Muscle Pills Carousel */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            {MUSCLE_GROUPS.map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedMuscle(m.id)}
                className={`px-3 py-1.5 rounded-full font-medium shrink-0 transition ${
                  selectedMuscle === m.id
                    ? 'bg-emerald-500 text-zinc-950 font-bold shadow-sm'
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
                  className="py-3 px-2 flex items-center justify-between hover:bg-zinc-900/60 rounded-2xl transition group"
                >
                  <div className="flex items-center space-x-3.5 flex-1 min-w-0 pr-3">
                    {/* Thumbnail */}
                    <div className="w-14 h-14 rounded-xl bg-zinc-900 border border-zinc-800 shrink-0 overflow-hidden flex items-center justify-center">
                      {imageSrc ? (
                        <img
                          src={imageSrc}
                          alt={ex.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition"
                          loading="lazy"
                        />
                      ) : (
                        <Dumbbell className="w-6 h-6 text-zinc-600" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-white truncate group-hover:text-emerald-400 transition">
                        {ex.name}
                      </h3>
                      <div className="flex flex-wrap items-center gap-1.5 mt-1 text-[11px]">
                        <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20 capitalize">
                          {ex.primaryMuscles.join(', ')}
                        </span>
                        {ex.equipment && (
                          <span className="px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-400 capitalize">
                            {ex.equipment}
                          </span>
                        )}
                        <span className="text-zinc-500 capitalize">{ex.level}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-1.5 shrink-0">
                    <button
                      onClick={() => setPreviewExercise(ex)}
                      className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
                      title="Xem hướng dẫn động tác"
                    >
                      <Info className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        onSelectExercise(ex);
                        onClose();
                      }}
                      className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold text-xs transition flex items-center space-x-1 shadow-md shadow-emerald-500/15"
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
            <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/90 animate-in fade-in">
              <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 max-w-lg w-full max-h-[85vh] overflow-y-auto space-y-4 shadow-2xl">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-white">{guide.vietnameseName || previewExercise.name}</h3>
                    <div className="flex flex-wrap items-center gap-1.5 mt-1 text-xs">
                      <span className="text-emerald-400 font-bold capitalize">
                        {previewExercise.primaryMuscles.map(translateMuscle).join(', ')}
                      </span>
                      <span>•</span>
                      <span className="text-zinc-300 capitalize">{translateEquipment(previewExercise.equipment)}</span>
                      <span>•</span>
                      <span className="text-zinc-400 font-mono text-[11px]">{previewExercise.name}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setPreviewExercise(null)}
                    className="p-1 rounded-lg text-zinc-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Demo Photos */}
                <div className="grid grid-cols-2 gap-2">
                  {previewExercise.images?.map((img, i) => (
                    <div key={i} className="rounded-xl overflow-hidden border border-zinc-800 bg-black">
                      <img
                        src={`https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/${img}`}
                        alt="Demo"
                        className="w-full h-40 object-cover"
                      />
                      <div className="text-[10px] text-zinc-300 text-center py-1 bg-zinc-900/90 font-medium">
                        {i === 0 ? '① Tư thế bắt đầu (Start)' : '② Điểm co căng cơ (Peak)'}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Form Cues */}
                {guide.formCues && guide.formCues.length > 0 && (
                  <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-2xl p-3 space-y-1.5 text-xs">
                    <h4 className="font-bold text-emerald-400">💡 Khẩu quyết kỹ thuật:</h4>
                    <ul className="text-zinc-200 space-y-1 pl-1">
                      {guide.formCues.map((cue, i) => (
                        <li key={i} className="flex items-start space-x-1.5">
                          <span className="text-emerald-400 font-bold">•</span>
                          <span>{cue}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Instructions */}
                <div className="space-y-2 pt-2 border-t border-zinc-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                    Hướng dẫn thực hiện:
                  </h4>
                  <div className="space-y-1.5">
                    {steps.map((step, i) => (
                      <div key={i} className="text-xs text-zinc-200 leading-relaxed bg-zinc-900/60 p-2.5 rounded-xl border border-zinc-800/60 flex items-start space-x-2">
                        <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0 text-[11px]">
                          {i + 1}
                        </span>
                        <span className="flex-1">{step.replace(/^Bước \d+:\s*/, '')}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => {
                    onSelectExercise(previewExercise);
                    setPreviewExercise(null);
                    onClose();
                  }}
                  className="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-sm transition shadow-lg shadow-emerald-500/20 active:scale-95"
                >
                  Thêm bài này vào buổi tập
                </button>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
}
