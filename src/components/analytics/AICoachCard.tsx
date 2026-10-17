'use client';

import React from 'react';
import { Sparkles, ArrowUpRight, ShieldCheck, HeartPulse, BrainCircuit, Activity } from 'lucide-react';
import { CoachSummary, OverloadRecommendation } from '@/lib/coachEngine';

interface AICoachCardProps {
  summary: CoachSummary;
}

export default function AICoachCard({ summary }: AICoachCardProps) {
  if (summary.recommendations.length === 0) return null;

  return (
    <div className="bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 border border-emerald-500/30 rounded-3xl p-5 shadow-2xl space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-zinc-950 shadow-lg shadow-emerald-500/20 shrink-0">
            <BrainCircuit className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="text-base font-black text-white flex items-center space-x-1.5">
              <span>Cố Vấn Tăng Tải Thông Minh (AI Overload Coach)</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold uppercase">
                Khoa học
              </span>
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Phân tích hiệu suất & đề xuất mức tạ chuẩn cho buổi tiếp theo
            </p>
          </div>
        </div>
      </div>

      {/* Recovery & Trend Insight */}
      <div className="bg-zinc-950/70 border border-zinc-800/80 rounded-2xl p-3 flex items-start space-x-2.5 text-xs text-zinc-300">
        <HeartPulse className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <div className="font-bold text-zinc-200">Trạng Thái & Phục Hồi:</div>
          <p className="text-zinc-400 leading-relaxed text-[11px]">{summary.recoveryAdvice}</p>
        </div>
      </div>

      {/* Actionable Overload Cards */}
      <div className="space-y-2.5">
        <div className="text-[11px] uppercase font-extrabold text-zinc-400 tracking-wider flex items-center justify-between">
          <span>Mục Tiêu Buổi Tập Kế Tiếp:</span>
          <span className="text-emerald-400 lowercase font-normal">quy tắc double progression</span>
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          {summary.recommendations.map((rec, idx) => (
            <div
              key={idx}
              className="bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-3.5 space-y-2 transition shadow-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white truncate flex items-center space-x-1.5">
                    <span>{rec.exerciseName}</span>
                    <span className="text-[10px] text-zinc-500 capitalize">• {rec.primaryMuscle}</span>
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">
                    Mức vừa qua: <span className="font-mono text-zinc-200 font-bold">{rec.currentWeightKg}kg × {rec.currentReps}r</span>
                  </div>
                </div>

                <div
                  className={`px-2.5 py-1 rounded-xl text-xs font-black shrink-0 flex items-center space-x-1 ${
                    rec.actionType === 'increase_weight'
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : rec.actionType === 'increase_reps'
                      ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                      : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                  }`}
                >
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>{rec.badgeText}</span>
                </div>
              </div>

              {/* Concrete Advice */}
              <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-950/60 p-2.5 rounded-xl border border-zinc-800/60">
                👉 {rec.advice}
              </p>

              {/* Scientific explanation */}
              <div className="text-[10px] text-zinc-500 flex items-center space-x-1 pt-0.5">
                <ShieldCheck className="w-3 h-3 text-emerald-500/60 shrink-0" />
                <span className="truncate">{rec.scientificReason}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
