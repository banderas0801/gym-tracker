'use client';

import React from 'react';
import { X, Dumbbell, Sparkles, AlertTriangle, ShieldCheck, Play } from 'lucide-react';
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

  const allExercises = exercisesData as unknown as Exercise[];
  const exercise = allExercises.find((e) => e.id === exerciseId) || {
    id: exerciseId,
    name: exerciseName || exerciseId,
    primaryMuscles: ['chest'],
    secondaryMuscles: [],
    equipment: 'barbell',
    instructions: [],
    level: 'Newbie',
    category: 'strength',
    images: [],
  };

  const primaryMuscle = exercise.primaryMuscles?.[0] || 'chest';
  const guide = getExerciseGuide(exerciseId, exercise.name, exercise.equipment, primaryMuscle);
  const media = getExerciseMedia(exerciseId, exercise.name);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-zinc-950 border border-zinc-800 rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl p-5 sm:p-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-zinc-800 pb-3">
          <div>
            <div className="flex flex-wrap items-center gap-1.5 mb-1">
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold capitalize">
                {guide.vietnameseName || exercise.name}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-zinc-900 text-zinc-300 border border-zinc-800 text-[11px] font-medium capitalize">
                {translateEquipment(exercise.equipment)}
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-white">{guide.vietnameseName}</h3>
            <p className="text-xs text-zinc-400 mt-0.5 flex flex-wrap items-center gap-1.5">
              <span>Tên quốc tế: <span className="text-zinc-300 font-mono">{exercise.name}</span></span>
              <span>•</span>
              <span>Cơ chính: <strong className="text-emerald-400 capitalize">{exercise.primaryMuscles.map(translateMuscle).join(', ')}</strong></span>
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Demo Pictures: Start vs Peak Form */}
        <div className="space-y-2">
          <div className="text-xs uppercase font-bold text-zinc-400 tracking-wider flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Hình ảnh tư thế chuẩn:</span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900">
              <div className="w-full h-40 sm:h-48 bg-zinc-950 flex items-center justify-center">
                {media.startImageUrl ? (
                  <img
                    src={media.startImageUrl}
                    alt="Tư thế bắt đầu"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <Dumbbell className="w-8 h-8 text-zinc-700" />
                )}
              </div>
              <div className="text-[11px] font-bold text-zinc-300 text-center py-1.5 bg-zinc-900/90 border-t border-zinc-800">
                ① Tư thế bắt đầu (Start)
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900">
              <div className="w-full h-40 sm:h-48 bg-zinc-950 flex items-center justify-center">
                {media.endImageUrl || media.startImageUrl ? (
                  <img
                    src={media.endImageUrl || media.startImageUrl || ''}
                    alt="Điểm căng cơ"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <Dumbbell className="w-8 h-8 text-zinc-700" />
                )}
              </div>
              <div className="text-[11px] font-bold text-zinc-300 text-center py-1.5 bg-zinc-900/90 border-t border-zinc-800">
                ② Điểm co căng cơ (Peak)
              </div>
            </div>
          </div>
        </div>

        {/* Form Cues & Cẩm nang tập chuẩn */}
        {guide.formCues && guide.formCues.length > 0 && (
          <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-2xl p-3.5 space-y-2">
            <h4 className="text-xs font-bold text-emerald-400 flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Kỹ thuật cần nhớ (Form Cues):</span>
            </h4>
            <ul className="text-xs text-zinc-200 space-y-1.5 pl-2">
              {guide.formCues.map((cue, i) => (
                <li key={i} className="flex items-start space-x-2">
                  <span className="text-emerald-400 font-bold shrink-0">•</span>
                  <span>{cue}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Common Mistakes */}
        {guide.commonMistake && (
          <div className="bg-amber-950/20 border border-amber-500/20 rounded-2xl p-3.5 space-y-1.5 text-xs">
            <h4 className="font-bold text-amber-400 flex items-center space-x-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Lỗi sai thường gặp cần tránh:</span>
            </h4>
            <p className="text-zinc-300 leading-relaxed">{guide.commonMistake}</p>
          </div>
        )}

        {/* Starting Weight Suggestion */}
        {guide.startingWeightGuide && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-3.5 space-y-1.5 text-xs">
            <h4 className="font-bold text-white">Mức tạ & số hiệp tham khảo cho người mới:</h4>
            <div className="flex items-center space-x-2 text-emerald-400 font-mono font-bold text-sm">
              <span>
                {guide.startingWeightGuide.recommendedWeightKg > 0
                  ? `~${guide.startingWeightGuide.recommendedWeightKg}${guide.startingWeightGuide.recommendedUnit}`
                  : 'Trọng lượng cơ thể'}
              </span>
              <span>•</span>
              <span>{guide.startingWeightGuide.targetReps} reps/hiệp</span>
              <span>•</span>
              <span className="text-zinc-400 text-xs font-normal">RPE {guide.startingWeightGuide.targetRpe}</span>
            </div>
            <p className="text-zinc-400 text-[11px] mt-0.5 leading-relaxed">
              {guide.startingWeightGuide.advice}
            </p>
          </div>
        )}

        {/* Hướng Dẫn Từng Bước 100% Tiếng Việt */}
        {guide.detailedStepsVi && guide.detailedStepsVi.length > 0 ? (
          <div className="space-y-2 pt-2 border-t border-zinc-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Chi tiết các bước thực hiện chuẩn:
            </h4>
            <div className="space-y-2">
              {guide.detailedStepsVi.map((step, i) => (
                <div key={i} className="text-xs text-zinc-200 leading-relaxed bg-zinc-900/60 p-2.5 rounded-xl border border-zinc-800/60 flex items-start space-x-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0 text-[11px]">
                    {i + 1}
                  </span>
                  <span className="flex-1">{step.replace(/^Bước \d+:\s*/, '')}</span>
                </div>
              ))}
            </div>
          </div>
        ) : exercise.instructions && exercise.instructions.length > 0 ? (
          <div className="space-y-2 pt-2 border-t border-zinc-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Chi tiết các bước thực hiện:
            </h4>
            <div className="space-y-2">
              {translateInstructions(exercise.instructions).map((step, i) => (
                <div key={i} className="text-xs text-zinc-200 leading-relaxed bg-zinc-900/60 p-2.5 rounded-xl border border-zinc-800/60 flex items-start space-x-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0 text-[11px]">
                    {i + 1}
                  </span>
                  <span className="flex-1">{step}</span>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {/* Bottom Actions */}
        <div className="pt-2 flex items-center space-x-2">
          {onStartSingleExercise && (
            <button
              type="button"
              onClick={() => {
                onStartSingleExercise(exercise.id, exercise.name);
                onClose();
              }}
              className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-zinc-950 font-black text-xs sm:text-sm shadow-lg shadow-emerald-500/20 transition flex items-center justify-center space-x-1.5 active:scale-95"
            >
              <Play className="w-4 h-4 fill-zinc-950" />
              <span>Vào Tập Bài Này Ngay</span>
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className={`${
              onStartSingleExercise ? 'px-5' : 'w-full'
            } py-3 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs sm:text-sm transition active:scale-95`}
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
