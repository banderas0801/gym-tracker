'use client';

import React, { useMemo } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Dumbbell, 
  Calendar, 
  Zap, 
  Trophy, 
  Flame, 
  Activity, 
  Layers, 
  ShieldCheck, 
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { WorkoutSession } from '@/types/workout';
import { calculateWeeklyGymAnalytics } from '@/lib/weeklyAnalytics';

interface WeeklyGymCardProps {
  history: WorkoutSession[];
}

export default function WeeklyGymCard({ history }: WeeklyGymCardProps) {
  const analytics = useMemo(() => {
    return calculateWeeklyGymAnalytics(history);
  }, [history]);

  const {
    thisWeek,
    lastWeek,
    volumeDeltaKg,
    volumeDeltaPercent,
    setsDelta,
    overloadTrend,
    trendTitle,
    trendAdvice,
    exerciseProgressions,
    recentWeeks,
  } = analytics;

  // Tìm volume max 4 tuần để làm mốc vẽ cột
  const maxWeeklyVol = Math.max(...recentWeeks.map(w => w.totalVolumeKg), 1000);

  const formatVolume = (kg: number) => {
    if (kg >= 1000) {
      return `${(kg / 1000).toFixed(1)} tấn`;
    }
    return `${kg} kg`;
  };

  return (
    <div className="bg-gradient-to-br from-zinc-900 via-zinc-900/95 to-zinc-950 border border-zinc-800 rounded-3xl p-4 sm:p-5 space-y-4 shadow-xl">
      {/* Tiêu đề & Tag Tuần */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800/80 pb-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
            <Dumbbell className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-black text-white uppercase tracking-wide">
              Tích Lũy Khối Lượng Tạ & Kỷ Lục Tuần
            </h3>
            <p className="text-[11px] text-zinc-400 font-mono">
              Khoảng thời gian: <strong className="text-zinc-300">{thisWeek.weekLabel}</strong>
            </p>
          </div>
        </div>

        {/* Delta Week-over-Week Volume Badge */}
        <div className="flex items-center">
          {lastWeek.totalVolumeKg > 0 ? (
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-black font-mono flex items-center space-x-1 ${
                volumeDeltaPercent >= 5
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : volumeDeltaPercent >= -5
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
              }`}
            >
              {volumeDeltaPercent >= 0 ? <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> : <TrendingDown className="w-3.5 h-3.5 mr-0.5" />}
              <span>{volumeDeltaPercent > 0 ? `+${volumeDeltaPercent}%` : `${volumeDeltaPercent}%`} WoW</span>
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold font-mono bg-zinc-800 text-zinc-400">
              Khởi đầu chu kỳ
            </span>
          )}
        </div>
      </div>

      {/* Thông số chính: Volume tạ tuần này */}
      <div className="space-y-1">
        <span className="text-[10px] uppercase font-bold text-zinc-400 block font-mono">
          Tổng Khối Lượng Vận Động (Volume Load)
        </span>
        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono tracking-tight">
              {formatVolume(thisWeek.totalVolumeKg)}
            </span>
            {lastWeek.totalVolumeKg > 0 && (
              <span className="text-xs text-zinc-400 font-mono">
                (Tuần trước: {formatVolume(lastWeek.totalVolumeKg)})
              </span>
            )}
          </div>

          {lastWeek.totalVolumeKg > 0 && (
            <span className="text-xs font-mono font-bold text-zinc-300">
              {volumeDeltaKg >= 0 ? `+${volumeDeltaKg} kg` : `${volumeDeltaKg} kg`}
            </span>
          )}
        </div>
      </div>

      {/* Grid 3 chỉ số: Sets hoàn thành, Buổi tập, Thời gian tập */}
      <div className="grid grid-cols-3 gap-2.5 text-center font-mono">
        <div className="p-2.5 rounded-2xl bg-zinc-950/70 border border-zinc-800/80">
          <span className="text-[10px] uppercase font-bold text-zinc-400 block">Tổng Số Set</span>
          <span className="text-base sm:text-lg font-black text-white mt-0.5 block">
            {thisWeek.totalSets}
          </span>
          <span className="text-[9px] text-zinc-500">
            {lastWeek.totalSets > 0 ? `${setsDelta >= 0 ? `+${setsDelta}` : setsDelta} set vs tuần trước` : 'sets tập'}
          </span>
        </div>

        <div className="p-2.5 rounded-2xl bg-zinc-950/70 border border-zinc-800/80">
          <span className="text-[10px] uppercase font-bold text-zinc-400 block">Buổi Đã Tập</span>
          <span className="text-base sm:text-lg font-black text-amber-400 mt-0.5 block">
            {thisWeek.workoutsCount}
          </span>
          <span className="text-[9px] text-zinc-500">buổi trong tuần</span>
        </div>

        <div className="p-2.5 rounded-2xl bg-zinc-950/70 border border-zinc-800/80">
          <span className="text-[10px] uppercase font-bold text-zinc-400 block">Thời Lượng</span>
          <span className="text-base sm:text-lg font-black text-blue-400 mt-0.5 block">
            {thisWeek.durationMinutes}p
          </span>
          <span className="text-[9px] text-zinc-500">tổng phòng gym</span>
        </div>
      </div>

      {/* Progressive Overload Status Banner */}
      <div
        className={`p-3.5 rounded-2xl border transition-all ${
          overloadTrend === 'progressive_overload'
            ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
            : overloadTrend === 'optimal_maintenance'
            ? 'bg-amber-950/30 border-amber-500/40 text-amber-200'
            : overloadTrend === 'deload_recovery'
            ? 'bg-blue-950/30 border-blue-500/40 text-blue-200'
            : 'bg-zinc-950/60 border-zinc-800 text-zinc-300'
        }`}
      >
        <div className="flex items-start space-x-2.5">
          <div className="shrink-0 mt-0.5">
            {overloadTrend === 'progressive_overload' ? (
              <Zap className="w-5 h-5 text-emerald-400" />
            ) : overloadTrend === 'optimal_maintenance' ? (
              <ShieldCheck className="w-5 h-5 text-amber-400" />
            ) : (
              <Activity className="w-5 h-5 text-blue-400" />
            )}
          </div>
          <div className="space-y-1">
            <h4 className="text-xs sm:text-sm font-bold flex items-center space-x-1.5">
              <span>{trendTitle}</span>
              <span className="text-[10px] font-normal px-2 py-0.5 rounded-full bg-black/40 text-zinc-300">
                Khoa Học Tăng Tải
              </span>
            </h4>
            <p className="text-[11px] leading-relaxed opacity-90">
              {trendAdvice}
            </p>
          </div>
        </div>
      </div>

      {/* 🏋️ Sets Phân Bổ Theo Nhóm Cơ Tuần Này (Hypertrophy Volume) */}
      {Object.keys(thisWeek.setsByMuscle).length > 0 && (
        <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-2xl p-3 sm:p-4 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-zinc-300 uppercase tracking-wide flex items-center space-x-1.5">
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              <span>Số Set Theo Nhóm Cơ (Chuẩn 10-20 Sets/Tuần Phì Đại Cơ)</span>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
            {Object.entries(thisWeek.setsByMuscle).map(([muscle, count]) => {
              const isOptimal = count >= 10 && count <= 20;
              const isOver = count > 20;
              return (
                <div
                  key={muscle}
                  className="bg-zinc-900/90 border border-zinc-800/80 rounded-xl p-2.5 flex items-center justify-between"
                >
                  <div className="min-w-0 pr-1">
                    <span className="text-xs font-bold text-zinc-200 block truncate">{muscle}</span>
                    <span className="text-[10px] text-zinc-500 font-mono">
                      {isOptimal ? 'Tối ưu phì đại' : isOver ? 'Ngưỡng cao' : 'Khởi động'}
                    </span>
                  </div>
                  <div className="text-right shrink-0">
                    <span
                      className={`text-sm font-black font-mono ${
                        isOptimal
                          ? 'text-emerald-400'
                          : isOver
                          ? 'text-amber-400'
                          : 'text-zinc-300'
                      }`}
                    >
                      {count}
                    </span>
                    <span className="text-[10px] text-zinc-500 block">sets</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 🏆 So Sánh Kỷ Lục Mức Tạ (Exercise Max Records) Giữa 2 Tuần */}
      {exerciseProgressions.length > 0 && (
        <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-2xl p-3 sm:p-4 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-zinc-300 uppercase tracking-wide flex items-center space-x-1.5">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Biến Động Kỷ Lục Mức Tạ So Với Tuần Trước</span>
            </span>
            <span className="text-[10px] text-zinc-500 font-mono">
              {exerciseProgressions.filter(e => e.isNewRecord).length} kỷ lục mới
            </span>
          </div>

          <div className="space-y-2 pt-1 max-h-56 overflow-y-auto pr-1 custom-scrollbar">
            {exerciseProgressions.map((prog) => (
              <div
                key={prog.exerciseId}
                className="bg-zinc-900 border border-zinc-800/80 rounded-xl p-2.5 flex items-center justify-between gap-2"
              >
                <div className="min-w-0">
                  <div className="flex items-center space-x-1.5">
                    <h5 className="text-xs font-bold text-white truncate">{prog.exerciseName}</h5>
                    {prog.isNewRecord && (
                      <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[9px] font-black uppercase font-mono">
                        PR Mới
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-zinc-500 font-mono mt-0.5">
                    1RM: <strong className="text-zinc-300">{prog.thisWeek1RM}kg</strong>
                    {prog.lastWeekMaxWeightKg > 0 && (
                      <span> • Tuần trước: {prog.lastWeekMaxWeightKg}kg</span>
                    )}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-xs sm:text-sm font-black text-white font-mono">
                    {prog.thisWeekMaxWeightKg} kg
                  </div>
                  {prog.lastWeekMaxWeightKg > 0 ? (
                    <div
                      className={`text-[10px] font-mono font-bold ${
                        prog.deltaWeightKg > 0
                          ? 'text-emerald-400'
                          : prog.deltaWeightKg < 0
                          ? 'text-zinc-400'
                          : 'text-zinc-500'
                      }`}
                    >
                      {prog.deltaWeightKg > 0 ? `+${prog.deltaWeightKg}kg (+${prog.deltaPercent}%)` : `${prog.deltaWeightKg}kg`}
                    </div>
                  ) : (
                    <span className="text-[10px] text-zinc-500 font-mono">Mức tạ đầu</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 📊 Biểu đồ so sánh 4 tuần gần nhất */}
      <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-2xl p-3 sm:p-4 space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-zinc-300 uppercase tracking-wide flex items-center space-x-1.5">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>Xu hướng khối lượng tạ (Volume) 4 tuần gần nhất</span>
          </span>
          <span className="text-[10px] text-zinc-500 font-mono">Tấn tạ/tuần</span>
        </div>

        <div className="grid grid-cols-4 gap-2 pt-2 items-end h-28">
          {recentWeeks.map((w, idx) => {
            const heightPercent = Math.max(12, Math.round((w.totalVolumeKg / maxWeeklyVol) * 100));
            return (
              <div key={idx} className="flex flex-col items-center h-full justify-end space-y-1.5 group">
                <span className="text-[10px] font-mono font-bold text-zinc-300">
                  {w.totalVolumeKg >= 1000 ? `${(w.totalVolumeKg / 1000).toFixed(1)}t` : `${w.totalVolumeKg}k`}
                </span>

                <div className="w-full bg-zinc-800/60 rounded-xl h-16 flex items-end p-1 overflow-hidden">
                  <div
                    className={`w-full rounded-lg transition-all duration-500 ${
                      w.isCurrent
                        ? 'bg-gradient-to-t from-emerald-500 to-teal-300 shadow-[0_0_10px_rgba(16,185,129,0.4)]'
                        : 'bg-zinc-700 hover:bg-zinc-600'
                    }`}
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>

                <div className="text-center">
                  <span
                    className={`text-[9px] block font-mono ${
                      w.isCurrent ? 'text-emerald-400 font-black' : 'text-zinc-500'
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
    </div>
  );
}
