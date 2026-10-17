'use client';

import React from 'react';
import { Sparkles, Dumbbell } from 'lucide-react';
import { getExerciseMedia } from '@/lib/exerciseMedia';

interface SuggestedExercise {
  id: string;
  name: string;
  muscle: string;
  tip: string;
}

interface NextExerciseSuggestionProps {
  suggestions: SuggestedExercise[];
  onAddExercise: (exerciseId: string, exerciseName: string, primaryMuscle: string) => void;
}

export default function NextExerciseSuggestion({
  suggestions,
  onAddExercise,
}: NextExerciseSuggestionProps) {
  if (suggestions.length === 0) return null;

  return (
    <div className="bg-zinc-950/80 border border-zinc-800/90 rounded-3xl p-4 sm:p-5 space-y-3 shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <h4 className="text-xs sm:text-sm font-bold text-white">
            Gợi Ý Bài Tập Tiếp Theo (Cân Bằng Cơ Thể)
          </h4>
        </div>
        <span className="text-[10px] text-zinc-500">Dựa theo các nhóm cơ trong buổi</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {suggestions.map((sug) => {
          const sugMedia = getExerciseMedia(sug.id, sug.name);
          return (
            <div
              key={sug.id}
              className="p-2.5 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition flex items-center justify-between space-x-2.5 group"
            >
              <div className="flex items-center space-x-2.5 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-zinc-950 border border-zinc-800 shrink-0 overflow-hidden flex items-center justify-center">
                  {sugMedia.startImageUrl ? (
                    <img
                      src={sugMedia.startImageUrl}
                      alt={sug.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                      loading="lazy"
                    />
                  ) : (
                    <Dumbbell className="w-4 h-4 text-zinc-600" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white truncate group-hover:text-emerald-400 transition">
                    {sug.name}
                  </div>
                  <div className="text-[10px] text-emerald-400 truncate">
                    {sug.tip}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onAddExercise(sug.id, sug.name, sug.muscle)}
                className="px-2.5 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-zinc-950 font-bold text-[11px] transition shrink-0 active:scale-90"
              >
                + Thêm
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
