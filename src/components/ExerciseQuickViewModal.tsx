'use client';

import React from 'react';
import { X, Dumbbell, Sparkles, AlertTriangle, ShieldCheck, Play, ArrowLeft } from 'lucide-react';
import exercisesData from '@/data/exercises.json';
import { getExerciseGuide } from '@/lib/exerciseGuide';
import { getExerciseMedia } from '@/lib/exerciseMedia';
import { translateMuscle, translateEquipment, translateInstructions } from '@/lib/translations';
import { Exercise } from '@/types/workout';

interface ExerciseQuickViewModalProps {
  exerciseId: string | null;
  exerciseName?: string;
  onClose: () => void;
  onStartSingleExercise?: (exerciseId: string, exerciseName: string) => void;
}

export default function ExerciseQuickViewModal({
  exerciseId,
  exerciseName,
  onClose,
  onStartSingleExercise,
}: ExerciseQuickViewModalProps) {
  if (!exerciseId) return null;

  const media = getExerciseMedia(exerciseId, exerciseName);
  const allExercises = exercisesData as unknown as Exercise[];
  const idLower = exerciseId.toLowerCase();
  const nameLower = (exerciseName || '').toLowerCase();

  const foundExercise = allExercises.find(
    (e) => e.id.toLowerCase() === idLower || 
           (nameLower && e.name.toLowerCase() === nameLower) ||
           e.id.toLowerCase().replace(/_/g, ' ') === idLower.replace(/_/g, ' ')
  );

  const exercise: Exercise = foundExercise || {
    id: exerciseId,
    name: exerciseName || media.name || exerciseId,
    primaryMuscles: media.primaryMuscles.length > 0 ? media.primaryMuscles : ['chest'],
    secondaryMuscles: media.secondaryMuscles || [],
    equipment: media.equipment || 'machine',
    instructions: media.instructions || [],
    level: media.level || 'Mọi cấp độ',
    category: media.category || 'strength',
    images: media.images,
  };

  const primaryMuscle = (exercise.primaryMuscles && exercise.primaryMuscles.length > 0)
    ? exercise.primaryMuscles[0]
    : (media.primaryMuscles && media.primaryMuscles.length > 0)
    ? media.primaryMuscles[0]
    : 'chest';

  const effectiveEquipment = exercise.equipment || media.equipment || 'machine';
  const guide = getExerciseGuide(exerciseId, exerciseName || exercise.name, effectiveEquipment, primaryMuscle);
  const titleDisplay = guide.vietnameseName || exerciseName || exercise.name;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-zinc-950 border border-zinc-800 rounded-3xl w-full max-w-lg max-h-[92vh] overflow-y-auto shadow-2xl p-5 sm:p-6 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-zinc-800 pb-3.5">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-black capitalize">
                {titleDisplay}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-zinc-900 text-zinc-300 border border-zinc-800 text-xs font-semibold capitalize">
                {translateEquipment(effectiveEquipment)}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">{titleDisplay}</h3>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1 flex flex-wrap items-center gap-2">
              <span>Tên quốc tế: <span className="text-zinc-200 font-mono font-semibold">{exercise.name}</span></span>
              <span>•</span>
              <span>Cơ chính: <strong className="text-emerald-400 capitalize">{(exercise.primaryMuscles && exercise.primaryMuscles.length > 0 ? exercise.primaryMuscles : media.primaryMuscles).map(translateMuscle).join(', ')}</strong></span>
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white border border-zinc-700 transition shrink-0 flex items-center space-x-1.5 text-xs sm:text-sm font-bold active:scale-95 shadow-sm"
            title="Quay lại danh sách"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-400 stroke-[2.5]" />
            <span>Quay lại</span>
          </button>
        </div>

        {/* Demo Pictures: Start vs Peak Form */}
        <div className="space-y-2.5">
          <div className="text-xs sm:text-sm uppercase font-extrabold text-zinc-300 tracking-wider flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Hình ảnh tư thế chuẩn:</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900 shadow-md">
              <div className="w-full h-48 sm:h-56 bg-zinc-950 flex items-center justify-center">
                {media.startImageUrl ? (
                  <img
                    src={media.startImageUrl}
                    alt="Tư thế bắt đầu"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <Dumbbell className="w-10 h-10 text-zinc-700" />
                )}
              </div>
              <div className="text-xs sm:text-sm font-bold text-zinc-200 text-center py-2 bg-zinc-900/90 border-t border-zinc-800">
                ① Bắt đầu (Start)
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900 shadow-md">
              <div className="w-full h-48 sm:h-56 bg-zinc-950 flex items-center justify-center">
                {media.endImageUrl || media.startImageUrl ? (
                  <img
                    src={media.endImageUrl || media.startImageUrl || ''}
                    alt="Điểm căng cơ"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <Dumbbell className="w-10 h-10 text-zinc-700" />
                )}
              </div>
              <div className="text-xs sm:text-sm font-bold text-zinc-200 text-center py-2 bg-zinc-900/90 border-t border-zinc-800">
                ② Co siết cơ (Peak)
              </div>
            </div>
          </div>
        </div>

        {/* Form Cues & Cẩm nang tập chuẩn */}
        {guide.formCues && guide.formCues.length > 0 && (
          <div className="bg-emerald-950/25 border border-emerald-500/30 rounded-2xl p-4 space-y-2.5">
            <h4 className="text-xs sm:text-sm font-black text-emerald-400 flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 stroke-[2.5]" />
              <span>Kỹ thuật cần nhớ (Form Cues):</span>
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

        {/* Common Mistakes */}
        {guide.commonMistake && (
          <div className="bg-amber-950/25 border border-amber-500/30 rounded-2xl p-4 space-y-2 text-xs sm:text-sm">
            <h4 className="font-black text-amber-400 flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 stroke-[2.5]" />
              <span>Lỗi sai thường gặp cần tránh:</span>
            </h4>
            <p className="text-zinc-200 leading-relaxed font-medium">{guide.commonMistake}</p>
          </div>
        )}

        {/* Starting Weight Suggestion */}
        {guide.startingWeightGuide && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-2 text-xs sm:text-sm">
            <h4 className="font-extrabold text-white">Mức tạ & số hiệp tham khảo cho người mới:</h4>
            <div className="flex items-center space-x-2.5 text-emerald-400 font-mono font-black text-sm sm:text-base">
              <span>
                {guide.startingWeightGuide.recommendedWeightKg > 0
                  ? `~${guide.startingWeightGuide.recommendedWeightKg}${guide.startingWeightGuide.recommendedUnit}`
                  : 'Trọng lượng cơ thể'}
              </span>
              <span>•</span>
              <span>{guide.startingWeightGuide.targetReps} reps/hiệp</span>
              <span>•</span>
              <span className="text-zinc-400 text-xs sm:text-sm font-normal">RPE {guide.startingWeightGuide.targetRpe}</span>
            </div>
            <p className="text-zinc-300 text-xs sm:text-sm mt-1 leading-relaxed">
              {guide.startingWeightGuide.advice}
            </p>
          </div>
        )}

        {/* Hướng Dẫn Từng Bước 100% Tiếng Việt */}
        {guide.detailedStepsVi && guide.detailedStepsVi.length > 0 ? (
          <div className="space-y-2.5 pt-2 border-t border-zinc-800">
            <h4 className="text-xs sm:text-sm font-black uppercase tracking-wider text-zinc-300">
              Chi tiết các bước thực hiện chuẩn:
            </h4>
            <div className="space-y-2.5">
              {guide.detailedStepsVi.map((step, i) => (
                <div key={i} className="text-xs sm:text-sm text-zinc-100 leading-relaxed bg-zinc-900/80 p-3 rounded-2xl border border-zinc-800 flex items-start space-x-2.5">
                  <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-black flex items-center justify-center shrink-0 text-xs mt-0.5">
                    {i + 1}
                  </span>
                  <span className="flex-1 font-medium">{step.replace(/^Bước \d+:\s*/, '')}</span>
                </div>
              ))}
            </div>
          </div>
        ) : exercise.instructionsVi && exercise.instructionsVi.length > 0 ? (
          <div className="space-y-2.5 pt-2 border-t border-zinc-800">
            <h4 className="text-xs sm:text-sm font-black uppercase tracking-wider text-zinc-300">
              Chi tiết các bước thực hiện:
            </h4>
            <div className="space-y-2.5">
              {exercise.instructionsVi.map((step, i) => (
                <div key={i} className="text-xs sm:text-sm text-zinc-100 leading-relaxed bg-zinc-900/80 p-3 rounded-2xl border border-zinc-800 flex items-start space-x-2.5">
                  <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-black flex items-center justify-center shrink-0 text-xs mt-0.5">
                    {i + 1}
                  </span>
                  <span className="flex-1 font-medium">{step.replace(/^Bước \d+:\s*/, '')}</span>
                </div>
              ))}
            </div>
          </div>
        ) : exercise.instructions && exercise.instructions.length > 0 ? (
          <div className="space-y-2.5 pt-2 border-t border-zinc-800">
            <h4 className="text-xs sm:text-sm font-black uppercase tracking-wider text-zinc-300">
              Chi tiết các bước thực hiện:
            </h4>
            <div className="space-y-2.5">
              {translateInstructions(exercise.instructions).map((step, i) => (
                <div key={i} className="text-xs sm:text-sm text-zinc-100 leading-relaxed bg-zinc-900/80 p-3 rounded-2xl border border-zinc-800 flex items-start space-x-2.5">
                  <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-black flex items-center justify-center shrink-0 text-xs mt-0.5">
                    {i + 1}
                  </span>
                  <span className="flex-1 font-medium">{step}</span>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {/* Bottom Actions */}
        <div className="pt-3 flex items-center space-x-2.5">
          {onStartSingleExercise && (
            <button
              type="button"
              onClick={() => {
                onStartSingleExercise(exercise.id, exercise.name);
                onClose();
              }}
              className="flex-1 py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-zinc-950 font-black text-sm sm:text-base shadow-lg shadow-emerald-500/20 transition flex items-center justify-center space-x-2 active:scale-95"
            >
              <Play className="w-4 h-4 fill-zinc-950" />
              <span>Vào Tập Bài Này Ngay</span>
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className={`${
              onStartSingleExercise ? 'px-6' : 'w-full'
            } py-3.5 sm:py-4 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-white font-extrabold text-sm sm:text-base transition active:scale-95 border border-zinc-700`}
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
