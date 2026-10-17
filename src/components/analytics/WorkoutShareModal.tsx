'use client';

import React, { useState } from 'react';
import { Share2, Copy, Check, X, Trophy, Dumbbell, Clock, Flame, Sparkles } from 'lucide-react';
import { WorkoutSession } from '@/types/workout';

interface WorkoutShareModalProps {
  session: WorkoutSession | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function WorkoutShareModal({ session, isOpen, onClose }: WorkoutShareModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !session) return null;

  const dateStr = new Date(session.startTime).toLocaleDateString('vi-VN', {
    weekday: 'long',
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  });

  const durationMin = Math.round((session.durationSeconds || 0) / 60);

  // Tìm top sets
  const topExercises = session.exercises.map((ex) => {
    const bestSet = ex.sets.reduce((prev, curr) =>
      curr.isCompleted && curr.weightKg > prev.weightKg ? curr : prev,
      { weightKg: 0, reps: 0 }
    );
    return {
      name: ex.exerciseName,
      weight: bestSet.weightKg,
      reps: bestSet.reps,
      completedSets: ex.sets.filter((s) => s.isCompleted).length,
    };
  });

  const generateShareText = () => {
    let text = `🔥 HOÀN THÀNH BUỔI TẬP: ${session.title}\n`;
    text += `📅 ${dateStr} • ⏱️ ${durationMin} phút\n`;
    text += `💪 Tổng Volume: ${(session.totalVolumeKg || 0).toLocaleString()} kg (${session.totalSets || 0} sets)\n\n`;
    text += `📋 Chi tiết bài tập:\n`;
    topExercises.forEach((e) => {
      text += `• ${e.name}: ${e.weight > 0 ? `${e.weight}kg × ${e.reps}` : `${e.completedSets} sets`}\n`;
    });
    text += `\n#GymTracker #ProgressiveOverload #FitnessVN`;
    return text;
  };

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(generateShareText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.error('Clipboard copy failed:', e);
    }
  };

  const handleNativeShare = async () => {
    const text = generateShareText();
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Gym Tracker Pro - ${session.title}`,
          text: text,
          url: window.location.origin,
        });
      } catch (err) {
        // User cancelled share
      }
    } else {
      handleCopyText();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-5 sm:p-6 max-w-sm w-full space-y-4 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Share2 className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-black text-white">Thẻ Thành Tích Buổi Tập</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Visual Story Card Preview (Instagram / Story Styled) */}
        <div
          id="workout-story-card"
          className="relative bg-gradient-to-b from-zinc-900 via-black to-zinc-950 border-2 border-emerald-500/40 rounded-3xl p-5 shadow-2xl space-y-4 overflow-hidden"
        >
          {/* Neon Glow Accents */}
          <div className="absolute -top-16 -right-16 w-36 h-36 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

          {/* Top Brand */}
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-xl bg-emerald-500 flex items-center justify-center text-zinc-950 font-black">
                <Dumbbell className="w-4 h-4" />
              </div>
              <span className="text-xs font-black tracking-wider text-white">GYM TRACKER PRO</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              WORKOUT
            </span>
          </div>

          {/* Workout Title & Date */}
          <div>
            <h3 className="text-lg font-black text-white leading-tight">{session.title}</h3>
            <p className="text-[11px] text-zinc-400 mt-1 flex items-center space-x-1.5">
              <span>{dateStr}</span>
              <span>•</span>
              <span className="flex items-center space-x-1 text-emerald-400">
                <Clock className="w-3 h-3" />
                <span>{durationMin} phút</span>
              </span>
            </p>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="bg-zinc-900/80 p-3 rounded-2xl border border-zinc-800">
              <div className="text-[10px] uppercase font-bold text-zinc-400">Tổng Volume</div>
              <div className="text-lg font-black text-emerald-400 font-mono mt-0.5">
                {(session.totalVolumeKg || 0).toLocaleString()} <span className="text-[10px] text-zinc-400 font-normal">kg</span>
              </div>
            </div>
            <div className="bg-zinc-900/80 p-3 rounded-2xl border border-zinc-800">
              <div className="text-[10px] uppercase font-bold text-zinc-400">Số Hiệp (Sets)</div>
              <div className="text-lg font-black text-teal-400 font-mono mt-0.5">
                {session.totalSets || 0} <span className="text-[10px] text-zinc-400 font-normal">sets</span>
              </div>
            </div>
          </div>

          {/* Highlights List */}
          <div className="space-y-1.5 pt-1">
            <div className="text-[10px] uppercase font-bold text-zinc-500">Các bài tập nổi bật:</div>
            <div className="space-y-1">
              {topExercises.slice(0, 4).map((ex, idx) => (
                <div
                  key={idx}
                  className="bg-zinc-950/70 p-2 rounded-xl border border-zinc-800/60 flex items-center justify-between text-xs"
                >
                  <span className="text-zinc-200 truncate pr-2 font-medium">{ex.name}</span>
                  <span className="font-mono font-bold text-emerald-400 shrink-0 text-[11px]">
                    {ex.weight > 0 ? `${ex.weight}kg × ${ex.reps}` : `${ex.completedSets} sets`}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Card Footer Tagline */}
          <div className="text-center pt-2 border-t border-zinc-800/80 text-[10px] text-zinc-500 font-medium">
            Tải tăng tiến đều đặn • Kỷ luật tạo nên thể hình
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-1">
          <button
            type="button"
            onClick={handleNativeShare}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-zinc-950 font-black text-xs transition shadow-lg shadow-emerald-500/20 flex items-center justify-center space-x-2 active:scale-95"
          >
            <Share2 className="w-4 h-4 stroke-[2.5]" />
            <span>Chia Sẻ Lên Story / Mạng Xã Hội</span>
          </button>

          <button
            type="button"
            onClick={handleCopyText}
            className="w-full py-2.5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold text-xs transition flex items-center justify-center space-x-1.5 active:scale-95 border border-zinc-800"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Đã sao chép vào bộ nhớ tạm!' : 'Sao chép văn bản tóm tắt'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
