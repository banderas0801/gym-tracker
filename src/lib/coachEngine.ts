import { WorkoutSession, WorkoutExerciseItem, SetLog } from '@/types/workout';
import { calculate1RM } from './storage';

export interface OverloadRecommendation {
  exerciseId: string;
  exerciseName: string;
  primaryMuscle: string;
  currentWeightKg: number;
  currentReps: number;
  targetWeightKg: number;
  targetReps: number;
  actionType: 'increase_weight' | 'increase_reps' | 'maintain_form' | 'deload';
  badgeText: string;
  badgeColor: 'emerald' | 'amber' | 'blue' | 'purple';
  advice: string;
  scientificReason: string;
}

export interface CoachSummary {
  recommendations: OverloadRecommendation[];
  weeklyConsistencyScore: number; // 0 - 100
  totalVolumeTrend: 'increasing' | 'stable' | 'decreasing';
  recoveryAdvice: string;
}

/**
 * Phân tích lịch sử tập luyện và sinh các đề xuất tải tăng tiến (Progressive Overload)
 */
export function analyzeProgressiveOverload(history: WorkoutSession[]): CoachSummary {
  if (!history || history.length === 0) {
    return {
      recommendations: [],
      weeklyConsistencyScore: 0,
      totalVolumeTrend: 'stable',
      recoveryAdvice: 'Chưa có dữ liệu tập luyện. Hãy hoàn thành buổi tập đầu tiên để AI đưa ra lộ trình tăng tạ!',
    };
  }

  // 1. Nhóm dữ liệu theo từng bài tập từ các buổi gần nhất
  const exerciseSessionsMap: Record<
    string,
    { sessionDate: string; exerciseName: string; primaryMuscle: string; sets: SetLog[] }[]
  > = {};

  history.forEach((session) => {
    session.exercises.forEach((ex) => {
      const completedSets = ex.sets.filter((s) => s.isCompleted && s.weightKg > 0);
      if (completedSets.length > 0) {
        if (!exerciseSessionsMap[ex.exerciseId]) {
          exerciseSessionsMap[ex.exerciseId] = [];
        }
        exerciseSessionsMap[ex.exerciseId].push({
          sessionDate: session.startTime,
          exerciseName: ex.exerciseName,
          primaryMuscle: ex.primaryMuscle,
          sets: completedSets,
        });
      }
    });
  });

  const recommendations: OverloadRecommendation[] = [];

  // 2. Xét từng bài tập để tính toán Progressive Overload
  Object.entries(exerciseSessionsMap).forEach(([exerciseId, sessions]) => {
    // Sắp xếp buổi mới nhất lên đầu
    sessions.sort((a, b) => new Date(b.sessionDate).getTime() - new Date(a.sessionDate).getTime());
    const latest = sessions[0];
    if (!latest || latest.sets.length === 0) return;

    // Tìm working set nặng nhất của buổi gần nhất
    const bestSet = latest.sets.reduce((prev, curr) =>
      curr.weightKg > prev.weightKg || (curr.weightKg === prev.weightKg && curr.reps > prev.reps)
        ? curr
        : prev
    );

    const isLowerBody =
      latest.primaryMuscle.toLowerCase().includes('đùi') ||
      latest.primaryMuscle.toLowerCase().includes('chân') ||
      latest.primaryMuscle.toLowerCase().includes('mông') ||
      latest.primaryMuscle.toLowerCase().includes('hamstring') ||
      latest.primaryMuscle.toLowerCase().includes('quad') ||
      latest.primaryMuscle.toLowerCase().includes('calves') ||
      latest.exerciseName.toLowerCase().includes('squat') ||
      latest.exerciseName.toLowerCase().includes('leg press') ||
      latest.exerciseName.toLowerCase().includes('deadlift');

    const weightIncrement = isLowerBody ? 5 : 2.5;

    // Kiểm tra tính nhất quán: tất cả set hoàn thành có đạt ngưỡng rep trần (>=10 hoặc >=12) không
    const avgReps = latest.sets.reduce((sum, s) => sum + s.reps, 0) / latest.sets.length;
    const allSetsCompleted = latest.sets.length >= 3;

    if (bestSet.reps >= 12 && allSetsCompleted) {
      // Đã chạm trần rep range (12 reps) -> Sẵn sàng tăng tạ
      const nextWeight = bestSet.weightKg + weightIncrement;
      recommendations.push({
        exerciseId,
        exerciseName: latest.exerciseName,
        primaryMuscle: latest.primaryMuscle,
        currentWeightKg: bestSet.weightKg,
        currentReps: bestSet.reps,
        targetWeightKg: nextWeight,
        targetReps: 8,
        actionType: 'increase_weight',
        badgeText: `Tăng +${weightIncrement}kg`,
        badgeColor: 'emerald',
        advice: `Buổi trước bạn đã hoàn thành xuất sắc ${bestSet.weightKg}kg × ${bestSet.reps} reps. Hãy tự tin lắp thêm ${weightIncrement}kg và tập ở khoảng 8-10 reps!`,
        scientificReason:
          'Nguyên tắc Double Progression: Khi đạt trần rep range (12 reps), tăng tạ và hạ rep về sàn (8 reps) để kích thích phì đại cơ mới.',
      });
    } else if (bestSet.reps >= 8 && bestSet.reps < 12) {
      // Đang trong ngưỡng hypertrophy (8-11 reps) -> Giữ tạ, tăng rep
      const nextReps = Math.min(12, bestSet.reps + 1);
      recommendations.push({
        exerciseId,
        exerciseName: latest.exerciseName,
        primaryMuscle: latest.primaryMuscle,
        currentWeightKg: bestSet.weightKg,
        currentReps: bestSet.reps,
        targetWeightKg: bestSet.weightKg,
        targetReps: nextReps,
        actionType: 'increase_reps',
        badgeText: `Tăng +1 rep (${nextReps} reps)`,
        badgeColor: 'blue',
        advice: `Mức tạ ${bestSet.weightKg}kg đang rất vừa sức (${bestSet.reps} reps). Buổi tới hãy ráng thêm 1-2 reps trước khi nâng tạ tiếp.`,
        scientificReason:
          'Tiếp tục tích lũy Volume trong khoảng an toàn RPE 7-8 để củng cố hệ thần kinh và khớp trước khi tăng mức tạ nặng hơn.',
      });
    } else {
      // Reps dưới 8 -> Cần củng cố kỹ thuật
      recommendations.push({
        exerciseId,
        exerciseName: latest.exerciseName,
        primaryMuscle: latest.primaryMuscle,
        currentWeightKg: bestSet.weightKg,
        currentReps: bestSet.reps,
        targetWeightKg: bestSet.weightKg,
        targetReps: 8,
        actionType: 'maintain_form',
        badgeText: 'Củng cố kỹ thuật',
        badgeColor: 'amber',
        advice: `Số rep hiện tại (${bestSet.reps} reps) đang hơi thấp. Giữ nguyên ${bestSet.weightKg}kg, tập trung vào nhịp hạ chậm 2 giây và gồng cơ tối đa.`,
        scientificReason:
          'Tập tạ quá nặng khi chưa làm chủ kỹ thuật dễ gây ăn gian khớp vai/lưng dưới. Ưu tiên cảm nhận cơ (Mind-Muscle Connection).',
      });
    }
  });

  // 3. Phân tích xu hướng Volume (Volume Trend)
  let totalVolumeTrend: 'increasing' | 'stable' | 'decreasing' = 'stable';
  if (history.length >= 2) {
    const recentVolume = history[0].totalVolumeKg || 0;
    const previousVolume = history[1].totalVolumeKg || 0;
    if (recentVolume > previousVolume * 1.05) totalVolumeTrend = 'increasing';
    else if (recentVolume < previousVolume * 0.95) totalVolumeTrend = 'decreasing';
  }

  // 4. Lời khuyên hồi phục
  let recoveryAdvice = 'Duy trì phong độ tập đều đặn và ngủ đủ 7-8 tiếng để cơ bắp phục hồi!';
  if (history.length >= 4) {
    const daysBetween =
      (new Date(history[0].startTime).getTime() -
        new Date(history[history.length - 1].startTime).getTime()) /
      (1000 * 60 * 60 * 24);
    if (daysBetween < 5 && history.length >= 4) {
      recoveryAdvice =
        '⚡ Bạn đã tập rất năng suất trong tuần này! Chú ý nạp đủ 1.6g-2g Protein/kg thể trọng và dành 1 ngày nghỉ ngơi hoàn toàn.';
    }
  }

  // 5. Điểm số tính nhất quán (Consistency Score)
  const consistencyScore = Math.min(100, Math.round((history.length / 4) * 100));

  return {
    recommendations: recommendations.slice(0, 5), // Lấy top 5 bài phổ biến nhất
    weeklyConsistencyScore: consistencyScore,
    totalVolumeTrend,
    recoveryAdvice,
  };
}
