import { WorkoutSession, RoutineTemplate, Exercise } from '@/types/workout';

const WORKOUT_HISTORY_KEY = 'gym_tracker_workout_history_v1';
const ROUTINES_KEY = 'gym_tracker_routines_v1';
const ACTIVE_WORKOUT_KEY = 'gym_tracker_active_session_v1';

export const DEFAULT_ROUTINES: RoutineTemplate[] = [
  {
    id: 'newbie-fullbody-a',
    name: 'Full Body A (Tân Binh - Thứ 2/6)',
    targetFocus: 'Ngực, Chân, Lưng xô, Vai - Thân thiện khớp cho người mới',
    level: 'Newbie',
    description: 'Giáo án hoàn hảo cho người mới tập 0 - 6 tháng. Giúp kích hoạt toàn thân, làm quen cảm giác cơ mà không bị đau nhức kiệt sức.',
    exercises: [
      { exerciseId: 'Barbell_Bench_Press_-_Medium_Grip', exerciseName: 'Barbell Bench Press', defaultSets: 3, defaultReps: 10, suggestedWeightKg: 20 },
      { exerciseId: 'Leg_Press', exerciseName: 'Leg Press (Đạp Đùi Máy)', defaultSets: 3, defaultReps: 12, suggestedWeightKg: 40 },
      { exerciseId: 'Wide-Grip_Lat_Pulldown', exerciseName: 'Lat Pulldown (Kéo Xô Máy)', defaultSets: 3, defaultReps: 12, suggestedWeightKg: 20 },
      { exerciseId: 'Dumbbell_Shoulder_Press', exerciseName: 'Dumbbell Shoulder Press (Đẩy Vai)', defaultSets: 3, defaultReps: 10, suggestedWeightKg: 5 },
      { exerciseId: 'Triceps_Pushdown', exerciseName: 'Triceps Pushdown (Tay Sau Máy)', defaultSets: 2, defaultReps: 12, suggestedWeightKg: 10 }
    ]
  },
  {
    id: 'newbie-fullbody-b',
    name: 'Full Body B (Tân Binh - Thứ 4)',
    targetFocus: 'Lưng đùi, Ngực trên, Chèo xô, Vai bên, Bắp tay',
    level: 'Newbie',
    description: 'Buổi thứ 2 trong tuần: tập trung vào nhóm cơ kéo và bổ trợ, hoàn thiện vóc dáng cân đối.',
    exercises: [
      { exerciseId: 'Incline_Dumbbell_Press', exerciseName: 'Incline Dumbbell Press', defaultSets: 3, defaultReps: 10, suggestedWeightKg: 6 },
      { exerciseId: 'Romanian_Deadlift', exerciseName: 'Romanian Deadlift (Tạ Đơn/Đòn)', defaultSets: 3, defaultReps: 10, suggestedWeightKg: 20 },
      { exerciseId: 'Bent_Over_Barbell_Row', exerciseName: 'Dumbbell/Cable Row (Chèo Lưng)', defaultSets: 3, defaultReps: 10, suggestedWeightKg: 8 },
      { exerciseId: 'Side_Lateral_Raise', exerciseName: 'Side Lateral Raise (Bay Vai)', defaultSets: 3, defaultReps: 12, suggestedWeightKg: 3 },
      { exerciseId: 'Barbell_Curl', exerciseName: 'Bicep Curl (Cuộn Tay Trước)', defaultSets: 2, defaultReps: 12, suggestedWeightKg: 5 }
    ]
  },
  {
    id: 'push-day',
    name: 'Push Day (Ngực - Vai - Tay Sau)',
    targetFocus: 'Ngực, Vai trước/giữa, Cơ tam đầu (Triceps)',
    level: 'Intermediate',
    description: 'Giáo án phân hóa đẩy (Push) cho người đã có nền tảng 6 tháng trở lên.',
    exercises: [
      { exerciseId: 'Barbell_Bench_Press_-_Medium_Grip', exerciseName: 'Barbell Bench Press', defaultSets: 4, defaultReps: 8, suggestedWeightKg: 40 },
      { exerciseId: 'Incline_Dumbbell_Press', exerciseName: 'Incline Dumbbell Press', defaultSets: 3, defaultReps: 10, suggestedWeightKg: 14 },
      { exerciseId: 'Standing_Dumbbell_Shoulder_Press', exerciseName: 'Standing Dumbbell Shoulder Press', defaultSets: 3, defaultReps: 10, suggestedWeightKg: 12 },
      { exerciseId: 'Side_Lateral_Raise', exerciseName: 'Side Lateral Raise', defaultSets: 4, defaultReps: 12, suggestedWeightKg: 6 },
      { exerciseId: 'Triceps_Pushdown', exerciseName: 'Triceps Pushdown', defaultSets: 3, defaultReps: 12, suggestedWeightKg: 20 }
    ]
  },
  {
    id: 'pull-day',
    name: 'Pull Day (Lưng Xô - Tay Trước)',
    targetFocus: 'Lưng xô (Lats), Lưng trên (Traps/Rhomboids), Tay trước (Biceps)',
    level: 'Intermediate',
    description: 'Giáo án phân hóa kéo (Pull) phát triển độ dày và rộng của lưng xô.',
    exercises: [
      { exerciseId: 'Barbell_Deadlift', exerciseName: 'Barbell Deadlift', defaultSets: 3, defaultReps: 5, suggestedWeightKg: 60 },
      { exerciseId: 'Pullups', exerciseName: 'Pull-ups', defaultSets: 4, defaultReps: 8 },
      { exerciseId: 'Bent_Over_Barbell_Row', exerciseName: 'Bent Over Barbell Row', defaultSets: 4, defaultReps: 8, suggestedWeightKg: 35 },
      { exerciseId: 'Face_Pull', exerciseName: 'Face Pull', defaultSets: 3, defaultReps: 15, suggestedWeightKg: 15 },
      { exerciseId: 'Barbell_Curl', exerciseName: 'Barbell Bicep Curl', defaultSets: 3, defaultReps: 10, suggestedWeightKg: 15 }
    ]
  },
  {
    id: 'leg-day',
    name: 'Leg Day & Core (Chân - Mông - Bụng)',
    targetFocus: 'Đùi trước (Quads), Đùi sau (Hamstrings), Mông (Glutes), Bụng (Core)',
    level: 'Intermediate',
    description: 'Giáo án thân dưới & cơ lõi toàn diện.',
    exercises: [
      { exerciseId: 'Barbell_Full_Squat', exerciseName: 'Barbell Full Squat', defaultSets: 4, defaultReps: 6, suggestedWeightKg: 50 },
      { exerciseId: 'Romanian_Deadlift', exerciseName: 'Romanian Deadlift', defaultSets: 3, defaultReps: 8, suggestedWeightKg: 45 },
      { exerciseId: 'Leg_Press', exerciseName: 'Leg Press', defaultSets: 3, defaultReps: 10, suggestedWeightKg: 80 },
      { exerciseId: 'Standing_Calf_Raises', exerciseName: 'Standing Calf Raises', defaultSets: 4, defaultReps: 15, suggestedWeightKg: 30 },
      { exerciseId: 'Hanging_Leg_Raise', exerciseName: 'Hanging Leg Raise', defaultSets: 3, defaultReps: 12 }
    ]
  }
];

// Helper tính 1RM theo công thức Epley
export function calculate1RM(weightKg: number, reps: number): number {
  if (reps <= 0 || weightKg <= 0) return 0;
  if (reps === 1) return weightKg;
  return Math.round(weightKg * (1 + reps / 30) * 10) / 10;
}

export function getWorkoutHistory(): WorkoutSession[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(WORKOUT_HISTORY_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Lỗi đọc lịch sử tập:', e);
    return [];
  }
}

export function saveWorkoutSession(session: WorkoutSession): void {
  if (typeof window === 'undefined') return;
  try {
    const list = getWorkoutHistory();
    const updated = [session, ...list];
    localStorage.setItem(WORKOUT_HISTORY_KEY, JSON.stringify(updated));
    localStorage.removeItem(ACTIVE_WORKOUT_KEY);
  } catch (e) {
    console.error('Lỗi lưu buổi tập:', e);
  }
}

export function deleteWorkoutSession(sessionId: string): void {
  if (typeof window === 'undefined') return;
  try {
    const list = getWorkoutHistory();
    const updated = list.filter((s) => s.id !== sessionId);
    localStorage.setItem(WORKOUT_HISTORY_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Lỗi xóa buổi tập:', e);
  }
}

export function getRoutines(): RoutineTemplate[] {
  if (typeof window === 'undefined') return DEFAULT_ROUTINES;
  try {
    const raw = localStorage.getItem(ROUTINES_KEY);
    if (!raw) {
      localStorage.setItem(ROUTINES_KEY, JSON.stringify(DEFAULT_ROUTINES));
      return DEFAULT_ROUTINES;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_ROUTINES;
  }
}

export function saveRoutine(routine: RoutineTemplate): void {
  if (typeof window === 'undefined') return;
  try {
    const routines = getRoutines();
    const existingIndex = routines.findIndex(r => r.id === routine.id);
    let updated: RoutineTemplate[];
    if (existingIndex >= 0) {
      updated = [...routines];
      updated[existingIndex] = routine;
    } else {
      updated = [...routines, routine];
    }
    localStorage.setItem(ROUTINES_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Lỗi lưu giáo án:', e);
  }
}

// Lấy thành tích tốt nhất buổi trước của 1 bài tập
export function getPreviousPerformance(exerciseId: string): { weightKg: number; reps: number; setNumber: number }[] {
  const history = getWorkoutHistory();
  for (const session of history) {
    const item = session.exercises.find(ex => ex.exerciseId === exerciseId);
    if (item && item.sets.some(s => s.isCompleted)) {
      return item.sets
        .filter(s => s.isCompleted)
        .map(s => ({
          weightKg: s.weightKg,
          reps: s.reps,
          setNumber: s.setNumber,
        }));
    }
  }
  return [];
}

// Lấy Kỷ lục cá nhân (PR) cao nhất từ trước đến nay của 1 bài tập
export function getPersonalRecord(exerciseId: string): { maxWeight: number; max1RM: number } {
  const history = getWorkoutHistory();
  let maxWeight = 0;
  let max1RM = 0;

  for (const session of history) {
    const item = session.exercises.find(ex => ex.exerciseId === exerciseId);
    if (item) {
      for (const s of item.sets) {
        if (s.isCompleted && s.weightKg > 0) {
          if (s.weightKg > maxWeight) maxWeight = s.weightKg;
          const e1rm = calculate1RM(s.weightKg, s.reps);
          if (e1rm > max1RM) max1RM = e1rm;
        }
      }
    }
  }

  return { maxWeight, max1RM };
}
