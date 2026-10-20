import { RunSession } from '@/types/running';
import { WorkoutSession } from '@/types/workout';
import { calculate1RM } from './storage';

// ==========================================
// 1. HELPER XÁC ĐỊNH TUẦN (Thứ 2 -> Chủ Nhật)
// ==========================================

export function getStartOfWeek(d: Date): Date {
  const date = new Date(d);
  const day = date.getDay();
  // Chủ nhật là 0 -> chuyển thành 7 để Thứ 2 là ngày bắt đầu tuần
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  date.setDate(diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

export function getEndOfWeek(d: Date): Date {
  const start = getStartOfWeek(d);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return end;
}

export function formatWeekSpan(start: Date): string {
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  const sDay = start.getDate().toString().padStart(2, '0');
  const sMonth = (start.getMonth() + 1).toString().padStart(2, '0');
  const eDay = end.getDate().toString().padStart(2, '0');
  const eMonth = (end.getMonth() + 1).toString().padStart(2, '0');
  return `${sDay}/${sMonth} - ${eDay}/${eMonth}`;
}

// ==========================================
// 2. PHÂN TÍCH TÍCH LŨY CHẠY BỘ HÀNG TUẦN
// ==========================================

export interface WeeklyRunningStats {
  startOfWeek: Date;
  weekLabel: string;
  totalKm: number;
  totalSeconds: number;
  runsCount: number;
  avgPace: string;
  avgSpeedKmh: number;
  totalCalories: number;
  targetKm: number;
  completionRatePercent: number;
  breakdownByMode: {
    outdoorGpsKm: number;
    treadmillKm: number;
    intervalKm: number;
  };
}

export interface WeeklyRunningComparison {
  thisWeek: WeeklyRunningStats;
  lastWeek: WeeklyRunningStats;
  deltaKm: number;
  deltaPercent: number; // % tăng giảm quãng đường so với tuần trước
  tenPercentRuleVerdict: 'safe_optimal' | 'overload_warning' | 'deload_recovery' | 'initial_week';
  verdictTitle: string;
  verdictExplanation: string;
  recentWeeks: {
    weekLabel: string;
    totalKm: number;
    runsCount: number;
    isCurrent: boolean;
  }[];
}

function formatPaceFromSec(secondsPerKm: number): string {
  if (!secondsPerKm || !isFinite(secondsPerKm) || secondsPerKm <= 0) return '--:--';
  const mins = Math.floor(secondsPerKm / 60);
  const secs = Math.round(secondsPerKm % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function calculateWeeklyRunningAnalytics(
  sessions: RunSession[],
  targetKmThisWeek = 24
): WeeklyRunningComparison {
  const now = new Date();
  const currentWeekStart = getStartOfWeek(now);

  const prevWeekStart = new Date(currentWeekStart);
  prevWeekStart.setDate(currentWeekStart.getDate() - 7);
  const prevWeekEnd = new Date(currentWeekStart);
  prevWeekEnd.setMilliseconds(prevWeekEnd.getMilliseconds() - 1);

  // Gom các buổi chạy tuần này và tuần trước
  const thisWeekSessions: RunSession[] = [];
  const lastWeekSessions: RunSession[] = [];

  // Nhóm theo 4 tuần gần nhất để vẽ biểu đồ
  const weeksMap = new Map<number, RunSession[]>();
  for (let i = 0; i < 4; i++) {
    const wStart = new Date(currentWeekStart);
    wStart.setDate(currentWeekStart.getDate() - i * 7);
    weeksMap.set(wStart.getTime(), []);
  }

  sessions.forEach((s) => {
    const sDate = new Date(s.date);
    if (sDate >= currentWeekStart) {
      thisWeekSessions.push(s);
    } else if (sDate >= prevWeekStart && sDate <= prevWeekEnd) {
      lastWeekSessions.push(s);
    }

    // Gán vào 4 tuần gần nhất
    const sWeekStart = getStartOfWeek(sDate).getTime();
    if (weeksMap.has(sWeekStart)) {
      weeksMap.get(sWeekStart)!.push(s);
    }
  });

  const buildStats = (list: RunSession[], start: Date, target: number): WeeklyRunningStats => {
    const totalKm = Math.round(list.reduce((sum, s) => sum + s.distanceKm, 0) * 100) / 100;
    const totalSeconds = list.reduce((sum, s) => sum + s.durationSeconds, 0);
    const runsCount = list.length;
    const totalCalories = list.reduce((sum, s) => sum + s.calories, 0);

    const avgPaceSec = totalKm > 0 ? totalSeconds / totalKm : 0;
    const avgSpeed = totalSeconds > 0 ? Math.round(((totalKm * 3600) / totalSeconds) * 10) / 10 : 0;
    const completionRate = target > 0 ? Math.round((totalKm / target) * 100) : 0;

    let outdoorGpsKm = 0;
    let treadmillKm = 0;
    let intervalKm = 0;

    list.forEach((s) => {
      if (s.mode === 'treadmill') treadmillKm += s.distanceKm;
      else if (s.mode === 'interval') intervalKm += s.distanceKm;
      else outdoorGpsKm += s.distanceKm;
    });

    return {
      startOfWeek: start,
      weekLabel: formatWeekSpan(start),
      totalKm,
      totalSeconds,
      runsCount,
      avgPace: formatPaceFromSec(avgPaceSec),
      avgSpeedKmh: avgSpeed,
      totalCalories,
      targetKm: target,
      completionRatePercent: completionRate,
      breakdownByMode: {
        outdoorGpsKm: Math.round(outdoorGpsKm * 10) / 10,
        treadmillKm: Math.round(treadmillKm * 10) / 10,
        intervalKm: Math.round(intervalKm * 10) / 10,
      },
    };
  };

  const thisWeekStats = buildStats(thisWeekSessions, currentWeekStart, targetKmThisWeek);
  const lastWeekStats = buildStats(lastWeekSessions, prevWeekStart, Math.max(1, targetKmThisWeek - 2));

  const deltaKm = Math.round((thisWeekStats.totalKm - lastWeekStats.totalKm) * 100) / 100;
  const deltaPercent =
    lastWeekStats.totalKm > 0
      ? Math.round(((thisWeekStats.totalKm - lastWeekStats.totalKm) / lastWeekStats.totalKm) * 100)
      : 0;

  // Đánh giá quy tắc 10% an toàn (The 10% Rule)
  let tenPercentRuleVerdict: WeeklyRunningComparison['tenPercentRuleVerdict'] = 'initial_week';
  let verdictTitle = 'Tuần Đầu Khởi Động';
  let verdictExplanation = 'Bạn đang xây dựng khối lượng chạy nền tảng đầu tiên.';

  if (lastWeekStats.totalKm > 0) {
    if (deltaPercent > 10) {
      tenPercentRuleVerdict = 'overload_warning';
      verdictTitle = `⚠️ Tăng tải nhanh (+${deltaPercent}%)`;
      verdictExplanation = `Khối lượng tăng vượt quá 10% so với tuần trước. Hãy chú ý lắng nghe gân gót Achilles, khớp gối và ống đồng để tránh chấn thương quá tải.`;
    } else if (deltaPercent >= 0 && deltaPercent <= 10) {
      tenPercentRuleVerdict = 'safe_optimal';
      verdictTitle = `✅ Tăng tải chuẩn vàng (+${deltaPercent}%)`;
      verdictExplanation = `Tuyệt vời! Bạn tuân thủ chuẩn quy tắc 10% an toàn của Jack Daniels, giúp hệ tim mạch và cơ xương khớp thích nghi bền bỉ.`;
    } else {
      tenPercentRuleVerdict = 'deload_recovery';
      verdictTitle = `💤 Tuần giảm tải / Hồi phục (${deltaPercent}%)`;
      verdictExplanation = `Khối lượng chạy giảm so với tuần trước, đây là giai đoạn tốt để cơ bắp sửa chữa tổn thương sợi cơ và nạp đầy glycogen.`;
    }
  }

  // 4 tuần gần nhất sắp xếp từ cũ đến mới (trái qua phải)
  const recentWeeks = Array.from(weeksMap.entries())
    .sort(([t1], [t2]) => t1 - t2)
    .map(([time, list]) => {
      const start = new Date(time);
      const isCur = start.getTime() === currentWeekStart.getTime();
      const km = Math.round(list.reduce((sum, s) => sum + s.distanceKm, 0) * 10) / 10;
      return {
        weekLabel: formatWeekSpan(start),
        totalKm: km,
        runsCount: list.length,
        isCurrent: isCur,
      };
    });

  return {
    thisWeek: thisWeekStats,
    lastWeek: lastWeekStats,
    deltaKm,
    deltaPercent,
    tenPercentRuleVerdict,
    verdictTitle,
    verdictExplanation,
    recentWeeks,
  };
}

// ==========================================
// 3. PHÂN TÍCH TÍCH LŨY TẬP TẠ (GYM LOAD) HÀNG TUẦN
// ==========================================

export interface WeeklyGymStats {
  startOfWeek: Date;
  weekLabel: string;
  totalVolumeKg: number;
  totalSets: number;
  workoutsCount: number;
  durationMinutes: number;
  setsByMuscle: Record<string, number>;
}

export interface WeeklyExerciseRecordProgress {
  exerciseId: string;
  exerciseName: string;
  thisWeekMaxWeightKg: number;
  thisWeek1RM: number;
  lastWeekMaxWeightKg: number;
  lastWeek1RM: number;
  deltaWeightKg: number;
  deltaPercent: number;
  isNewRecord: boolean;
}

export interface WeeklyGymComparison {
  thisWeek: WeeklyGymStats;
  lastWeek: WeeklyGymStats;
  volumeDeltaKg: number;
  volumeDeltaPercent: number;
  setsDelta: number;
  overloadTrend: 'progressive_overload' | 'optimal_maintenance' | 'deload_recovery' | 'initial_week';
  trendTitle: string;
  trendAdvice: string;
  exerciseProgressions: WeeklyExerciseRecordProgress[];
  recentWeeks: {
    weekLabel: string;
    totalVolumeKg: number;
    workoutsCount: number;
    isCurrent: boolean;
  }[];
}

export function calculateWeeklyGymAnalytics(history: WorkoutSession[]): WeeklyGymComparison {
  const now = new Date();
  const currentWeekStart = getStartOfWeek(now);

  const prevWeekStart = new Date(currentWeekStart);
  prevWeekStart.setDate(currentWeekStart.getDate() - 7);
  const prevWeekEnd = new Date(currentWeekStart);
  prevWeekEnd.setMilliseconds(prevWeekEnd.getMilliseconds() - 1);

  const thisWeekSessions: WorkoutSession[] = [];
  const lastWeekSessions: WorkoutSession[] = [];

  const weeksMap = new Map<number, WorkoutSession[]>();
  for (let i = 0; i < 4; i++) {
    const wStart = new Date(currentWeekStart);
    wStart.setDate(currentWeekStart.getDate() - i * 7);
    weeksMap.set(wStart.getTime(), []);
  }

  history.forEach((sess) => {
    const sDate = new Date(sess.startTime);
    if (sDate >= currentWeekStart) {
      thisWeekSessions.push(sess);
    } else if (sDate >= prevWeekStart && sDate <= prevWeekEnd) {
      lastWeekSessions.push(sess);
    }

    const sWeekStart = getStartOfWeek(sDate).getTime();
    if (weeksMap.has(sWeekStart)) {
      weeksMap.get(sWeekStart)!.push(sess);
    }
  });

  const buildStats = (list: WorkoutSession[], start: Date): WeeklyGymStats => {
    let totalVolumeKg = 0;
    let totalSets = 0;
    let durationSec = 0;
    const setsByMuscle: Record<string, number> = {};

    list.forEach((sess) => {
      totalVolumeKg += sess.totalVolumeKg || 0;
      durationSec += sess.durationSeconds || 0;

      sess.exercises.forEach((ex) => {
        const completedSets = ex.sets.filter((s) => s.isCompleted);
        totalSets += completedSets.length;

        const muscleKey = ex.primaryMuscle || 'Khác';
        setsByMuscle[muscleKey] = (setsByMuscle[muscleKey] || 0) + completedSets.length;
      });
    });

    return {
      startOfWeek: start,
      weekLabel: formatWeekSpan(start),
      totalVolumeKg,
      totalSets,
      workoutsCount: list.length,
      durationMinutes: Math.round(durationSec / 60),
      setsByMuscle,
    };
  };

  const thisWeekStats = buildStats(thisWeekSessions, currentWeekStart);
  const lastWeekStats = buildStats(lastWeekSessions, prevWeekStart);

  const volumeDeltaKg = thisWeekStats.totalVolumeKg - lastWeekStats.totalVolumeKg;
  const volumeDeltaPercent =
    lastWeekStats.totalVolumeKg > 0
      ? Math.round(((volumeDeltaKg) / lastWeekStats.totalVolumeKg) * 100)
      : 0;
  const setsDelta = thisWeekStats.totalSets - lastWeekStats.totalSets;

  // Đánh giá xu hướng Progressive Overload
  let overloadTrend: WeeklyGymComparison['overloadTrend'] = 'initial_week';
  let trendTitle = 'Tuần Đầu Thiết Lập Mức Tạ';
  let trendAdvice = 'Hãy hoàn thành các buổi tập để hệ thống theo dõi mức tạ tối đa hàng tuần.';

  if (lastWeekStats.totalVolumeKg > 0) {
    if (volumeDeltaPercent >= 5) {
      overloadTrend = 'progressive_overload';
      trendTitle = `🔥 Tăng tải tiến bộ (+${volumeDeltaPercent}% Volume)`;
      trendAdvice = `Khối lượng tạ tuần này tăng trưởng vượt bậc so với tuần trước. Cơ bắp đang nhận được kích thích phì đại (Hypertrophy) tối ưu!`;
    } else if (volumeDeltaPercent >= -5 && volumeDeltaPercent < 5) {
      overloadTrend = 'optimal_maintenance';
      trendTitle = `⚖️ Ổn định phong độ (~${volumeDeltaPercent}%)`;
      trendAdvice = `Khối lượng vận động duy trì ở mức cân bằng, tạo điều kiện củng cố form động tác trước khi tăng tạ chu kỳ kế tiếp.`;
    } else {
      overloadTrend = 'deload_recovery';
      trendTitle = `🛡️ Tuần phục hồi / Deload (${volumeDeltaPercent}%)`;
      trendAdvice = `Hệ thần kinh cơ bắp đang được xả tải để chuẩn bị cho chu kỳ bứt phá mốc tạ mới tiếp theo.`;
    }
  }

  // So sánh Record mức tạ của từng bài tập giữa 2 tuần
  const getExerciseMaxRecord = (list: WorkoutSession[]) => {
    const map = new Map<string, { name: string; maxWeight: number; max1RM: number }>();
    list.forEach((sess) => {
      sess.exercises.forEach((ex) => {
        ex.sets.forEach((s) => {
          if (s.isCompleted && s.weightKg > 0) {
            const e1rm = calculate1RM(s.weightKg, s.reps);
            const cur = map.get(ex.exerciseId);
            if (!cur || s.weightKg > cur.maxWeight) {
              map.set(ex.exerciseId, {
                name: ex.exerciseName,
                maxWeight: s.weightKg,
                max1RM: e1rm,
              });
            }
          }
        });
      });
    });
    return map;
  };

  const thisWeekMaxMap = getExerciseMaxRecord(thisWeekSessions);
  const lastWeekMaxMap = getExerciseMaxRecord(lastWeekSessions);

  const exerciseProgressions: WeeklyExerciseRecordProgress[] = [];

  thisWeekMaxMap.forEach((thisRec, exId) => {
    const lastRec = lastWeekMaxMap.get(exId);
    const lastWeight = lastRec ? lastRec.maxWeight : 0;
    const last1RM = lastRec ? lastRec.max1RM : 0;
    const delta = thisRec.maxWeight - lastWeight;
    const deltaPct = lastWeight > 0 ? Math.round((delta / lastWeight) * 100) : 0;

    exerciseProgressions.push({
      exerciseId: exId,
      exerciseName: thisRec.name,
      thisWeekMaxWeightKg: thisRec.maxWeight,
      thisWeek1RM: thisRec.max1RM,
      lastWeekMaxWeightKg: lastWeight,
      lastWeek1RM: last1RM,
      deltaWeightKg: delta,
      deltaPercent: deltaPct,
      isNewRecord: delta > 0,
    });
  });

  // Sắp xếp bài có mức tạ tiến bộ lên đầu
  exerciseProgressions.sort((a, b) => b.deltaWeightKg - a.deltaWeightKg);

  const recentWeeks = Array.from(weeksMap.entries())
    .sort(([t1], [t2]) => t1 - t2)
    .map(([time, list]) => {
      const start = new Date(time);
      const isCur = start.getTime() === currentWeekStart.getTime();
      const vol = list.reduce((sum, s) => sum + (s.totalVolumeKg || 0), 0);
      return {
        weekLabel: formatWeekSpan(start),
        totalVolumeKg: vol,
        workoutsCount: list.length,
        isCurrent: isCur,
      };
    });

  return {
    thisWeek: thisWeekStats,
    lastWeek: lastWeekStats,
    volumeDeltaKg,
    volumeDeltaPercent,
    setsDelta,
    overloadTrend,
    trendTitle,
    trendAdvice,
    exerciseProgressions,
    recentWeeks,
  };
}
