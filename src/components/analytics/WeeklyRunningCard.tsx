'use client';

import React, { useMemo } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  ShieldAlert, 
  ShieldCheck, 
  Calendar, 
  Flame, 
  Footprints, 
  Compass, 
  Award,
  Activity,
  Zap,
  Info
} from 'lucide-react';
import { RunSession } from '@/types/running';
import { calculateWeeklyRunningAnalytics } from '@/lib/weeklyAnalytics';
import { formatSecondsToTime } from '@/data/runningCurriculum';

interface WeeklyRunningCardProps {
  sessions: RunSession[];
  targetWeeklyKm?: number;
}

export default function WeeklyRunningCard({ sessions, targetWeeklyKm = 24 }: WeeklyRunningCardProps) {
  const analytics = useMemo(() => {
    return calculateWeeklyRunningAnalytics(sessions, targetWeeklyKm);
  }, [sessions, targetWeeklyKm]);

  const { thisWeek, lastWeek, deltaKm, deltaPercent, tenPercentRuleVerdict, verdictTitle, verdictExplanation, recentWeeks } = analytics;

  // Tìm giá trị max km trong 4 tuần để làm mốc vẽ cột biểu đồ
  const maxWeeklyKm = Math.max(...recentWeeks.map(w => w.totalKm), targetWeeklyKm, 10);

  return (
    <div className="bg-gradient-to-br from-zinc-900 via-zinc-900/95 to-zinc-950 border border-zinc-800 rounded-3xl p-4 sm:p-5 space-y-4 shadow-xl">
      {/* Tiêu đề & Tag Tuần */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800/80 pb-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
            <Footprints className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-black text-white uppercase tracking-wide">
              Tích Lũy Chạy Bộ Tuần Này
            </h3>
            <p className="text-[11px] text-zinc-400 font-mono">
              Khoảng thời gian: <strong className="text-zinc-300">{thisWeek.weekLabel}</strong>
            </p>
          </div>
        </div>

        {/* Delta Week-over-Week Badge */}
        <div className="flex items-center">
          {lastWeek.totalKm > 0 ? (
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-black font-mono flex items-center space-x-1 ${
                deltaPercent > 10
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : deltaPercent >= 0
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
              }`}
            >
              {deltaPercent >= 0 ? <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> : <TrendingDown className="w-3.5 h-3.5 mr-0.5" />}
              <span>{deltaPercent > 0 ? `+${deltaPercent}%` : `${deltaPercent}%`} WoW</span>
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold font-mono bg-zinc-800 text-zinc-400">
              Tuần bắt đầu
            </span>
          )}
        </div>
      </div>

      {/* Thông số chính: Km tích lũy & Thanh tiến độ mục tiêu */}
      <div className="space-y-2">
        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline space-x-1.5">
            <span className="text-3xl sm:text-4xl font-black text-amber-400 font-mono tracking-tight">
              {thisWeek.totalKm}
            </span>
            <span className="text-sm font-bold text-zinc-400">/ {thisWeek.targetKm} km</span>
          </div>

          <div className="text-right">
            <span className="text-xs font-mono font-bold text-zinc-300">
              Đạt {thisWeek.completionRatePercent}%
            </span>
            {lastWeek.totalKm > 0 && (
              <div className="text-[10px] text-zinc-400 font-mono">
                Tuần trước: <span className="text-zinc-300">{lastWeek.totalKm} km</span>
              </div>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-zinc-800/80 rounded-full h-2.5 overflow-hidden p-0.5 border border-zinc-700/40">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              thisWeek.completionRatePercent >= 100
                ? 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_12px_rgba(16,185,129,0.5)]'
                : 'bg-gradient-to-r from-amber-500 to-amber-300'
            }`}
            style={{ width: `${Math.min(thisWeek.completionRatePercent, 100)}%` }}
          />
        </div>
      </div>

      {/* Grid 4 chỉ số phụ: Buổi chạy, Pace TB, Thời gian, Calo */}
      <div className="grid grid-cols-4 gap-2 pt-1 text-center font-mono">
        <div className="p-2 sm:p-2.5 rounded-2xl bg-zinc-950/70 border border-zinc-800/80">
          <span className="text-[9px] sm:text-[10px] uppercase font-bold text-zinc-400 block">Buổi Chạy</span>
          <span className="text-sm sm:text-base font-black text-white mt-0.5 block">
            {thisWeek.runsCount}
          </span>
          <span className="text-[9px] text-zinc-500">buổi</span>
        </div>

        <div className="p-2 sm:p-2.5 rounded-2xl bg-zinc-950/70 border border-zinc-800/80">
          <span className="text-[9px] sm:text-[10px] uppercase font-bold text-zinc-400 block">Pace TB</span>
          <span className="text-sm sm:text-base font-black text-emerald-400 mt-0.5 block">
            {thisWeek.avgPace}
          </span>
          <span className="text-[9px] text-zinc-500">/km</span>
        </div>

        <div className="p-2 sm:p-2.5 rounded-2xl bg-zinc-950/70 border border-zinc-800/80">
          <span className="text-[9px] sm:text-[10px] uppercase font-bold text-zinc-400 block">Thời Lượng</span>
          <span className="text-xs sm:text-sm font-black text-white mt-1 block truncate">
            {thisWeek.totalSeconds > 0 ? formatSecondsToTime(thisWeek.totalSeconds) : '0p'}
          </span>
          <span className="text-[9px] text-zinc-500">tổng cộng</span>
        </div>

        <div className="p-2 sm:p-2.5 rounded-2xl bg-zinc-950/70 border border-zinc-800/80">
          <span className="text-[9px] sm:text-[10px] uppercase font-bold text-zinc-400 block">Calo Tiêu Hao</span>
          <span className="text-sm sm:text-base font-black text-orange-400 mt-0.5 block">
            {thisWeek.totalCalories}
          </span>
          <span className="text-[9px] text-zinc-500">kcal</span>
        </div>
      </div>

      {/* 🛡️ THE 10% RULE BANNER (Quy tắc 10% an toàn thể thao) */}
      <div
        className={`p-3 sm:p-3.5 rounded-2xl border transition-all ${
          tenPercentRuleVerdict === 'overload_warning'
            ? 'bg-amber-950/30 border-amber-500/40 text-amber-200'
            : tenPercentRuleVerdict === 'safe_optimal'
            ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
            : tenPercentRuleVerdict === 'deload_recovery'
            ? 'bg-blue-950/30 border-blue-500/40 text-blue-200'
            : 'bg-zinc-950/60 border-zinc-800 text-zinc-300'
        }`}
      >
        <div className="flex items-start space-x-2.5">
          <div className="shrink-0 mt-0.5">
            {tenPercentRuleVerdict === 'overload_warning' ? (
              <ShieldAlert className="w-5 h-5 text-amber-400" />
            ) : tenPercentRuleVerdict === 'safe_optimal' ? (
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            ) : (
              <Info className="w-5 h-5 text-blue-400" />
            )}
          </div>
          <div className="space-y-1">
            <h4 className="text-xs sm:text-sm font-bold flex items-center space-x-1.5">
              <span>{verdictTitle}</span>
              <span className="text-[10px] font-normal px-2 py-0.5 rounded-full bg-black/40 text-zinc-300">
                Quy tắc 10% Thể thao
              </span>
            </h4>
            <p className="text-[11px] leading-relaxed opacity-90">
              {verdictExplanation}
            </p>
          </div>
        </div>
      </div>

      {/* 📊 Biểu đồ so sánh 4 tuần gần nhất */}
      <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-2xl p-3 sm:p-4 space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-zinc-300 uppercase tracking-wide flex items-center space-x-1.5">
            <Activity className="w-3.5 h-3.5 text-amber-400" />
            <span>Xu hướng khối lượng 4 tuần gần nhất</span>
          </span>
          <span className="text-[10px] text-zinc-500 font-mono">Đơn vị: km/tuần</span>
        </div>

        <div className="grid grid-cols-4 gap-2 pt-2 items-end h-28">
          {recentWeeks.map((w, idx) => {
            const heightPercent = Math.max(12, Math.round((w.totalKm / maxWeeklyKm) * 100));
            return (
              <div key={idx} className="flex flex-col items-center h-full justify-end space-y-1.5 group">
                <span className="text-[10px] font-mono font-bold text-zinc-300">
                  {w.totalKm > 0 ? `${w.totalKm}k` : '0k'}
                </span>

                <div className="w-full bg-zinc-800/60 rounded-xl h-16 flex items-end p-1 overflow-hidden">
                  <div
                    className={`w-full rounded-lg transition-all duration-500 ${
                      w.isCurrent
                        ? 'bg-gradient-to-t from-amber-500 to-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.4)]'
                        : 'bg-zinc-700 hover:bg-zinc-600'
                    }`}
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>

                <div className="text-center">
                  <span
                    className={`text-[9px] block font-mono ${
                      w.isCurrent ? 'text-amber-400 font-black' : 'text-zinc-500'
                    }`}
                  >
                    {w.isCurrent ? 'Tuần này' : w.weekLabel.split(' - ')[0]}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Phân bổ theo loại hình chạy */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] text-zinc-400">
        <span className="font-semibold text-zinc-300">Phân loại km tuần:</span>
        <div className="flex items-center space-x-3 font-mono text-xs">
          <span>GPS ngoài trời: <strong className="text-emerald-400">{thisWeek.breakdownByMode.outdoorGpsKm} km</strong></span>
          <span>Máy chạy: <strong className="text-blue-400">{thisWeek.breakdownByMode.treadmillKm} km</strong></span>
          {thisWeek.breakdownByMode.intervalKm > 0 && (
            <span>Interval: <strong className="text-purple-400">{thisWeek.breakdownByMode.intervalKm} km</strong></span>
          )}
        </div>
      </div>
    </div>
  );
}
