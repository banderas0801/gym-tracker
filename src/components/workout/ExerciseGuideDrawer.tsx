'use client';

import React from 'react';
import { Sparkles, ChevronUp, ChevronDown, Eye, AlertTriangle } from 'lucide-react';
import { ExerciseMediaInfo } from '@/lib/exerciseMedia';

export interface ExerciseGuideInfo {
  vietnameseName: string;
  formCues: string[];
  commonMistake: string;
  startingWeightGuide: {
    recommendedWeightKg: number;
    recommendedUnit: string;
    targetReps: string;
    targetRpe: string;
    advice: string;
  };
}

interface ExerciseGuideDrawerProps {
  exerciseId: string;
  guide: ExerciseGuideInfo;
  media: ExerciseMediaInfo;
  isExpanded: boolean;
  onToggle: () => void;
  onApplySuggestedWeight: (weight: number) => void;
  onPreviewMedia: () => void;
}

export default function ExerciseGuideDrawer({
  exerciseId,
  guide,
  media,
  isExpanded,
  onToggle,
  onApplySuggestedWeight,
  onPreviewMedia,
}: ExerciseGuideDrawerProps) {
  return (
    <div className="pt-1">
      <button
        type="button"
        onClick={onToggle}
        className="w-full px-3.5 py-2.5 rounded-2xl bg-zinc-950/80 border border-emerald-500/25 text-emerald-400 text-xs sm:text-sm font-bold flex items-center justify-between hover:bg-emerald-500/10 transition active:scale-[0.99]"
      >
        <div className="flex items-center space-x-2 truncate">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="truncate">💡 Hình ảnh & Mẹo tập: <span className="text-zinc-100 font-extrabold">{guide.vietnameseName}</span></span>
        </div>
        <div className="flex items-center space-x-1.5 shrink-0 ml-2">
          <span className="text-xs font-bold text-zinc-300 bg-zinc-800 border border-zinc-700 px-2 py-0.5 rounded-lg">
            {guide.startingWeightGuide.recommendedWeightKg > 0 ? `~${guide.startingWeightGuide.recommendedWeightKg}${guide.startingWeightGuide.recommendedUnit}` : 'Tập tự do'}
          </span>
          {isExpanded ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
        </div>
      </button>

      {isExpanded && (
        <div className="mt-2.5 p-4 bg-zinc-950/90 border border-zinc-800 rounded-2xl space-y-4 text-xs sm:text-sm animate-in fade-in duration-200">
          {/* Starting Weight Recommendation */}
          <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-950/60 to-zinc-900 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-xs uppercase font-black px-2 py-0.5 rounded bg-emerald-500 text-zinc-950">
                  Gợi ý Newbie
                </span>
                <span className="font-black text-white text-sm sm:text-base">
                  {guide.startingWeightGuide.recommendedWeightKg} {guide.startingWeightGuide.recommendedUnit}
                </span>
                <span className="text-zinc-400 font-medium">({guide.startingWeightGuide.targetReps} • {guide.startingWeightGuide.targetRpe})</span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-medium">{guide.startingWeightGuide.advice}</p>
            </div>

            {guide.startingWeightGuide.recommendedWeightKg > 0 && (
              <button
                type="button"
                onClick={() => onApplySuggestedWeight(guide.startingWeightGuide.recommendedWeightKg)}
                className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-xs sm:text-sm transition shadow-md shadow-emerald-500/20 shrink-0 self-start sm:self-center active:scale-95"
              >
                Áp dụng mức tạ này
              </button>
            )}
          </div>

          {/* 2-Frame Visual Motion */}
          {media.startImageUrl && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="font-black text-zinc-300 uppercase tracking-wider flex items-center space-x-1.5">
                  <Eye className="w-4 h-4 text-emerald-400" />
                  <span>Quỹ Đạo Động Tác (2 Khung Hình Chuẩn):</span>
                </span>
                <button
                  type="button"
                  onClick={onPreviewMedia}
                  className="text-emerald-400 hover:underline font-bold text-xs sm:text-sm"
                >
                  Xem ảnh lớn ↗
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div
                  onClick={onPreviewMedia}
                  className="relative bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800/90 group cursor-pointer aspect-[4/3] shadow-md"
                >
                  <img
                    src={media.startImageUrl}
                    alt="Tư thế bắt đầu"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    loading="lazy"
                  />
                  <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-sm text-xs font-bold text-zinc-200 border border-zinc-700/60">
                    1. Bắt đầu (Start)
                  </div>
                </div>

                <div
                  onClick={onPreviewMedia}
                  className="relative bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800/90 group cursor-pointer aspect-[4/3] shadow-md"
                >
                  <img
                    src={media.endImageUrl || media.startImageUrl}
                    alt="Điểm siết cơ đỉnh"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    loading="lazy"
                  />
                  <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-lg bg-emerald-950/90 backdrop-blur-sm text-xs font-bold text-emerald-300 border border-emerald-500/40">
                    2. Siết cơ (Peak)
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3 Form Cues */}
          <div className="space-y-2">
            <div className="text-xs uppercase tracking-wider font-black text-zinc-400">
              3 Khẩu quyết kỹ thuật chuẩn:
            </div>
            <div className="space-y-2">
              {guide.formCues.map((cue, cIdx) => (
                <div key={cIdx} className="flex items-start space-x-2.5 text-xs sm:text-sm text-zinc-200">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
                    {cIdx + 1}
                  </span>
                  <span className="font-medium leading-relaxed">{cue}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Common Mistake */}
          <div className="p-3 rounded-xl bg-red-950/25 border border-red-500/30 text-xs sm:text-sm text-red-200 flex items-start space-x-2.5">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span className="leading-relaxed"><strong className="text-red-400 font-black">Lỗi sai thường gặp:</strong> {guide.commonMistake}</span>
          </div>
        </div>
      )}
    </div>
  );
}
