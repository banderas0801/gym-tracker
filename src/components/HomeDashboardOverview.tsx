'use client';

import React, { useMemo } from 'react';
import { 
  Dumbbell, 
  Footprints, 
  Flame, 
  TrendingUp, 
  Calendar, 
  Clock, 
  Play, 
  ChevronRight, 
  Activity, 
  Trophy, 
  Zap, 
  CheckCircle2, 
  ShieldCheck,
  Award,
  Sparkles
} from 'lucide-react';
import { WorkoutSession } from '@/types/workout';
import { RunSession } from '@/types/running';
import { getWorkoutHistory } from '@/lib/storage';
import { getRunSessions, getTargetSub } from '@/lib/runningStorage';
import { calculateWeeklyGymAnalytics, calculateWeeklyRunningAnalytics, formatSecondsToTime } from '@/lib/weeklyAnalytics';

interface HomeDashboardOverviewProps {
  onStartTodayRecommendation: () => void;
  onGoToRunning: () => void;
  onGoToHistory: () => void;
  onStartEmptyWorkout: () => void;
}

export default function HomeDashboardOverview({
  onStartTodayRecommendation,
  onGoToRunning,
  onGoToHistory,
  onStartEmptyWorkout,
}: HomeDashboardOverviewProps) {
  // 1. Tải lịch sử Gym & Running
  const workoutHistory: WorkoutSession[] = useMemo(() => {
    return getWorkoutHistory();
  }, []);

  const runSessions: RunSession[] = useMemo(() => {
    return getRunSessions();
  }, []);

  // 2. Phân tích số liệu Gym tuần này
  const gymAnalytics = useMemo(() => {
    return calculateWeeklyGymAnalytics(workoutHistory);
  }, [workoutHistory]);

  // 3. Phân tích số liệu Chạy bộ tuần này
  const targetSub = useMemo(() => getTargetSub(), []);
  const targetWeeklyKm = targetSub === 'sub200' ? 24 : targetSub === 'sub145' ? 32 : 18;

  const runningAnalytics = useMemo(() => {
    return calculateWeeklyRunningAnalytics(runSessions, targetWeeklyKm);
  }, [runSessions, targetWeeklyKm]);

  const { thisWeek: gymThisWeek } = gymAnalytics;
  const { thisWeek: runThisWeek } = runningAnalytics;

  // 4. Tính toán Streak & Hoạt động gần nhất
  const recentActivity = useMemo(() => {
    const allEvents: { date: Date; type: 'gym' | 'run'; title: string; meta: string }[] = [];

    workoutHistory.forEach((w) => {
      allEvents.push({
        date: new Date(w.startTime),
        type: 'gym',
        title: w.title,
        meta: `${(w.totalVolumeKg || 0).toLocaleString()} kg volume • ${w.totalSets || 0} sets`,
      });
    });

    runSessions.forEach((r) => {
      allEvents.push({
        date: new Date(r.startTime),
        type: 'run',
        title: `Chạy ${r.mode === 'outdoor_gps' ? 'ngoài trời' : r.mode === 'treadmill' ? 'máy chạy' : 'biến tốc'}`,
        meta: `${r.distanceKm} km • Pace ${r.avgPace || '--:--'} • ${Math.round(r.calories || 0)} kcal`,
      });
    });

    allEvents.sort((a, b) => b.date.getTime() - a.date.getTime());
    return allEvents[0] || null;
  }, [workoutHistory, runSessions]);

  // Tính số ngày đã vận động trong tuần này
  const daysActiveThisWeek = useMemo(() => {
    const now = new Date();
    const startOfWeek = new Date(now);
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);
    startOfWeek.setHours(0, 0, 0, 0);

    const activeDaysSet = new Set<string>();

    workoutHistory.forEach((w) => {
      const d = new Date(w.startTime);
      if (d >= startOfWeek) {
        activeDaysSet.add(d.toDateString());
      }
    });

    runSessions.forEach((r) => {
      const d = new Date(r.startTime);
      if (d >= startOfWeek) {
        activeDaysSet.add(d.toDateString());
      }
    });

    return activeDaysSet.size;
  }, [workoutHistory, runSessions]);

  // Target số buổi tập trong tuần (thường là 4-5 buổi)
  const targetWorkouts = 4;
  const gymProgressPercent = Math.min(100, Math.round((gymThisWeek.workoutsCount / targetWorkouts) * 100));
  const runProgressPercent = Math.min(100, Math.round((runThisWeek.totalKm / targetWeeklyKm) * 100));

  const formatVolume = (kg: number) => {
    if (kg >= 1000) return `${(kg / 1000).toFixed(1)} tấn`;
    return `${kg.toLocaleString()} kg`;
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Chào buổi sáng! Sẵn sàng rèn luyện thể lực chưa?';
    if (hour < 18) return 'Chào buổi chiều! Giờ vàng để bùng nổ thể lực.';
    return 'Chào buổi tối! Hoàn thành mục tiêu vận động hôm nay nhé.';
  };

  return (
    <section className="space-y-4">
      {/* 1. Header Lời Chào & Chuỗi Ngày Rèn Luyện */}
      <div className="bg-gradient-to-r from-zinc-900 via-zinc-900/90 to-zinc-950 border border-zinc-800 rounded-3xl p-4 sm:p-5 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2 text-xs text-zinc-400 mb-1">
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-bold border border-emerald-500/25">
                <Activity className="w-3.5 h-3.5" />
                <span>BẢNG TỔNG HỢP & TRACKING TUẦN</span>
              </span>
              <span>•</span>
              <span className="text-zinc-300 font-medium">
                {new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'numeric' })}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white">{getGreeting()}</h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Theo dõi nhịp độ phát triển cơ bắp và sức bền tim mạch tuần này tại một nơi duy nhất.
            </p>
          </div>

          <div className="flex items-center space-x-2 self-start sm:self-center shrink-0">
            <div className="px-3 py-2 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center space-x-2 shadow-inner">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black">
                <Flame className="w-4 h-4 fill-amber-400" />
              </div>
              <div>
                <div className="text-[10px] text-zinc-400 uppercase font-bold">Vận động tuần</div>
                <div className="text-sm font-black text-white">{daysActiveThisWeek} / 7 ngày</div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Hai Thẻ Tracking Thể Lực Song Hành (Gym & Chạy Bộ) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-3.5">
          {/* 🏋️ CỘT 1: TRACKING GYM */}
          <div className="bg-zinc-950/80 border border-emerald-500/30 rounded-2xl p-4 space-y-3 shadow-md hover:border-emerald-500/50 transition">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Dumbbell className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-extrabold text-white">Tập Tạ (Gym Volume)</h3>
              </div>
              <span className="text-xs font-bold text-emerald-400 font-mono">
                {gymThisWeek.workoutsCount} / {targetWorkouts} buổi
              </span>
            </div>

            {/* Thanh tiến độ Gym */}
            <div className="space-y-1">
              <div className="w-full h-2 bg-zinc-850 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                  style={{ width: `${gymProgressPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-zinc-400">
                <span>Tiến độ tuần: <strong>{gymProgressPercent}%</strong></span>
                <span>{gymThisWeek.totalSets} hiệp hoàn thành</span>
              </div>
            </div>

            {/* Chỉ số nhanh Gym */}
            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-zinc-800/80">
              <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-800/80">
                <div className="text-[10px] text-zinc-400 uppercase font-semibold">Tổng Khối Lượng</div>
                <div className="text-base font-black text-white font-mono mt-0.5">
                  {formatVolume(gymThisWeek.totalVolumeKg)}
                </div>
              </div>
              <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-800/80">
                <div className="text-[10px] text-zinc-400 uppercase font-semibold">Tải Tăng Tiến</div>
                <div className="text-xs font-bold text-emerald-400 mt-1 truncate">
                  {gymAnalytics.trendTitle || 'Duy trì tối ưu'}
                </div>
              </div>
            </div>
          </div>

          {/* 🏃 CỘT 2: TRACKING CHẠY BỘ */}
          <div className="bg-zinc-950/80 border border-amber-500/30 rounded-2xl p-4 space-y-3 shadow-md hover:border-amber-500/50 transition">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Footprints className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-extrabold text-white">Chạy Bộ (Running 21K)</h3>
              </div>
              <span className="text-xs font-bold text-amber-400 font-mono">
                {runThisWeek.totalKm} / {targetWeeklyKm} km
              </span>
            </div>

            {/* Thanh tiến độ Chạy bộ */}
            <div className="space-y-1">
              <div className="w-full h-2 bg-zinc-850 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-amber-500 to-orange-400 rounded-full transition-all duration-500"
                  style={{ width: `${runProgressPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-zinc-400">
                <span>Mục tiêu tuần: <strong>{runProgressPercent}%</strong></span>
                <span>{runThisWeek.runsCount} buổi chạy</span>
              </div>
            </div>

            {/* Chỉ số nhanh Chạy bộ */}
            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-zinc-800/80">
              <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-800/80">
                <div className="text-[10px] text-zinc-400 uppercase font-semibold">Tốc Độ Trung Bình</div>
                <div className="text-base font-black text-white font-mono mt-0.5">
                  {runThisWeek.avgPace || '--:--'} <span className="text-[10px] font-normal text-zinc-400">/km</span>
                </div>
              </div>
              <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-800/80">
                <div className="text-[10px] text-zinc-400 uppercase font-semibold">Calo Tiêu Hao</div>
                <div className="text-base font-black text-amber-400 font-mono mt-0.5">
                  {Math.round(runThisWeek.totalCalories)} <span className="text-[10px] font-normal text-zinc-400">kcal</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Hoạt Động Gần Nhất & Phím Tắt Hành Động */}
        <div className="pt-3 border-t border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-xs text-zinc-400 flex items-center space-x-2">
            <Clock className="w-4 h-4 text-zinc-500 shrink-0" />
            {recentActivity ? (
              <span className="truncate">
                Lần tập gần nhất: <strong className="text-zinc-200">{recentActivity.title}</strong>{' '}
                <span className="text-zinc-500">({recentActivity.meta})</span>
              </span>
            ) : (
              <span>Chưa có buổi tập nào được ghi nhận tuần này. Hãy bắt đầu ngay!</span>
            )}
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              type="button"
              onClick={onGoToRunning}
              className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-amber-300 font-bold text-xs flex items-center space-x-1.5 transition active:scale-95 border border-zinc-700"
            >
              <Footprints className="w-3.5 h-3.5" />
              <span>Chạy Bộ</span>
            </button>

            <button
              type="button"
              onClick={onGoToHistory}
              className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white font-bold text-xs flex items-center space-x-1.5 transition active:scale-95 border border-zinc-700"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Lịch Sử PRs</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}