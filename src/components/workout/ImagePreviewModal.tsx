'use client';

import React from 'react';
import { Eye, X } from 'lucide-react';
import { ExerciseMediaInfo } from '@/lib/exerciseMedia';

interface ImagePreviewModalProps {
  media: ExerciseMediaInfo | null;
  onClose: () => void;
}

export default function ImagePreviewModal({ media, onClose }: ImagePreviewModalProps) {
  if (!media) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-5 sm:p-6 max-w-xl w-full max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl">
        {/* Modal Header */}
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg sm:text-xl font-black text-white flex items-center space-x-2">
              <Eye className="w-5 h-5 text-emerald-400" />
              <span>{media.name}</span>
            </h3>
            <div className="flex flex-wrap items-center gap-2 mt-1 text-xs">
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20 capitalize">
                {media.primaryMuscles.join(', ') || 'Cơ chính'}
              </span>
              {media.equipment && (
                <span className="px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300 capitalize border border-zinc-700/50">
                  {media.equipment}
                </span>
              )}
              <span className="text-zinc-500 capitalize">{media.level}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2-Frame Demonstration */}
        {media.startImageUrl && (
          <div className="space-y-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
              Quỹ đạo chuyển động (Start & Finish):
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="relative rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 aspect-square flex items-center justify-center">
                <img
                  src={media.startImageUrl}
                  alt="Tư thế bắt đầu"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 px-2 py-1 rounded-lg bg-black/80 backdrop-blur-md text-xs font-bold text-zinc-200 border border-zinc-700">
                  1. Bắt đầu (Start)
                </div>
              </div>

              <div className="relative rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 aspect-square flex items-center justify-center">
                <img
                  src={media.endImageUrl || media.startImageUrl}
                  alt="Điểm siết cơ đỉnh"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 px-2 py-1 rounded-lg bg-emerald-950/80 backdrop-blur-md text-xs font-bold text-emerald-300 border border-emerald-500/40">
                  2. Siết cơ (Peak)
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step-by-Step Instructions */}
        {media.instructions && media.instructions.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-zinc-800">
            <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
              Hướng Dẫn Từng Bước (Instructions):
            </div>
            <div className="space-y-2 text-xs text-zinc-300">
              {media.instructions.map((inst, i) => (
                <div key={i} className="flex items-start space-x-2.5">
                  <span className="w-5 h-5 rounded-full bg-zinc-800 text-zinc-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <p className="leading-relaxed">{inst}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Close Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs transition"
          >
            Đã Rõ Tư Thế & Kỹ Thuật (Đóng)
          </button>
        </div>
      </div>
    </div>
  );
}
