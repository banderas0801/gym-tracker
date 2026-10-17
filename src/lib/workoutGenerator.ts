import { WorkoutExerciseItem, WorkoutSession, SetLog } from '@/types/workout';
import { getExerciseGuide } from './exerciseGuide';

export type WorkoutSplitTarget = 'fullbody' | 'upper' | 'lower' | 'push' | 'pull' | 'core_cardio';
export type WorkoutDuration = 30 | 45 | 60;
export type EquipmentType = 'gym' | 'dumbbell_only' | 'bodyweight';
export type ExperienceLevel = 'newbie' | 'intermediate';

export interface SmartWorkoutConfig {
  target: WorkoutSplitTarget;
  durationMinutes: WorkoutDuration;
  equipment: EquipmentType;
  level: ExperienceLevel;
}

interface PredefinedExercise {
  exerciseId: string;
  exerciseName: string;
  primaryMuscle: string;
  defaultWeight: number;
  reps: number;
  setsCount: number;
}

// Thư viện bài tập chất lượng cao được tuyển chọn kỹ thuật y khoa cho từng cấu hình
const EXERCISE_POOL: Record<
  string,
  {
    mainCompound: PredefinedExercise[];
    secondaryCompound: PredefinedExercise[];
    accessoryIsolation: PredefinedExercise[];
  }
> = {
  // 1. Fullbody
  fullbody_gym_newbie: {
    mainCompound: [
      { exerciseId: 'Leg_Press', exerciseName: 'Leg Press (Máy Đạp Đùi)', primaryMuscle: 'Đùi trước', defaultWeight: 40, reps: 12, setsCount: 3 },
      { exerciseId: 'Barbell_Bench_Press_-_Medium_Grip', exerciseName: 'Barbell Bench Press (Đẩy Ngực Ngang)', primaryMuscle: 'Ngực', defaultWeight: 20, reps: 10, setsCount: 3 },
    ],
    secondaryCompound: [
      { exerciseId: 'Wide-Grip_Lat_Pulldown', exerciseName: 'Lat Pulldown (Máy Kéo Xô)', primaryMuscle: 'Lưng xô', defaultWeight: 20, reps: 12, setsCount: 3 },
      { exerciseId: 'Dumbbell_Shoulder_Press', exerciseName: 'Dumbbell Shoulder Press (Đẩy Vai)', primaryMuscle: 'Vai', defaultWeight: 6, reps: 10, setsCount: 3 },
    ],
    accessoryIsolation: [
      { exerciseId: 'Triceps_Pushdown', exerciseName: 'Triceps Pushdown (Tay Sau Dây Cáp)', primaryMuscle: 'Tay sau', defaultWeight: 10, reps: 12, setsCount: 3 },
      { exerciseId: 'Barbell_Curl', exerciseName: 'Bicep Curl (Cuộn Tay Trước)', primaryMuscle: 'Tay trước', defaultWeight: 5, reps: 12, setsCount: 3 },
    ],
  },
  fullbody_dumbbell_newbie: {
    mainCompound: [
      { exerciseId: 'Dumbbell_Goblet_Squat', exerciseName: 'Goblet Squat (Ngồi Xổm Ôm Tạ Đơn)', primaryMuscle: 'Đùi & Mông', defaultWeight: 8, reps: 12, setsCount: 3 },
      { exerciseId: 'Incline_Dumbbell_Press', exerciseName: 'Incline Dumbbell Press (Đẩy Ngực Tạ Đơn)', primaryMuscle: 'Ngực trên', defaultWeight: 6, reps: 10, setsCount: 3 },
    ],
    secondaryCompound: [
      { exerciseId: 'Bent_Over_Two-Dumbbell_Row', exerciseName: 'Dumbbell Row (Chèo Lưng Tạ Đơn)', primaryMuscle: 'Lưng', defaultWeight: 8, reps: 10, setsCount: 3 },
      { exerciseId: 'Dumbbell_Shoulder_Press', exerciseName: 'Dumbbell Shoulder Press (Đẩy Vai)', primaryMuscle: 'Vai', defaultWeight: 5, reps: 10, setsCount: 3 },
    ],
    accessoryIsolation: [
      { exerciseId: 'Side_Lateral_Raise', exerciseName: 'Side Lateral Raise (Bay Vai Tạ Đơn)', primaryMuscle: 'Vai giữa', defaultWeight: 3, reps: 12, setsCount: 3 },
      { exerciseId: 'Dumbbell_Bicep_Curl', exerciseName: 'Dumbbell Curl (Cuộn Tay Trước)', primaryMuscle: 'Tay trước', defaultWeight: 5, reps: 12, setsCount: 3 },
    ],
  },
  // 2. Upper Body
  upper_gym_newbie: {
    mainCompound: [
      { exerciseId: 'Barbell_Bench_Press_-_Medium_Grip', exerciseName: 'Barbell Bench Press (Đẩy Ngực Ngang)', primaryMuscle: 'Ngực', defaultWeight: 20, reps: 10, setsCount: 3 },
      { exerciseId: 'Wide-Grip_Lat_Pulldown', exerciseName: 'Lat Pulldown (Máy Kéo Xô)', primaryMuscle: 'Lưng xô', defaultWeight: 20, reps: 12, setsCount: 3 },
    ],
    secondaryCompound: [
      { exerciseId: 'Incline_Dumbbell_Press', exerciseName: 'Incline Dumbbell Press (Ngực Trên)', primaryMuscle: 'Ngực trên', defaultWeight: 8, reps: 10, setsCount: 3 },
      { exerciseId: 'Seated_Cable_Rows', exerciseName: 'Seated Cable Row (Chèo Lưng Máy)', primaryMuscle: 'Lưng giữa', defaultWeight: 25, reps: 12, setsCount: 3 },
    ],
    accessoryIsolation: [
      { exerciseId: 'Dumbbell_Shoulder_Press', exerciseName: 'Dumbbell Shoulder Press (Đẩy Vai)', primaryMuscle: 'Vai', defaultWeight: 6, reps: 10, setsCount: 3 },
      { exerciseId: 'Triceps_Pushdown', exerciseName: 'Triceps Pushdown (Tay Sau)', primaryMuscle: 'Tay sau', defaultWeight: 10, reps: 12, setsCount: 3 },
    ],
  },
  // 3. Lower Body
  lower_gym_newbie: {
    mainCompound: [
      { exerciseId: 'Leg_Press', exerciseName: 'Leg Press (Đạp Đùi Máy)', primaryMuscle: 'Đùi trước', defaultWeight: 40, reps: 12, setsCount: 3 },
      { exerciseId: 'Romanian_Deadlift', exerciseName: 'Romanian Deadlift (Đùi Sau & Mông)', primaryMuscle: 'Đùi sau', defaultWeight: 20, reps: 10, setsCount: 3 },
    ],
    secondaryCompound: [
      { exerciseId: 'Leg_Extensions', exerciseName: 'Leg Extension (Đá Đùi Trước Máy)', primaryMuscle: 'Đùi trước', defaultWeight: 15, reps: 12, setsCount: 3 },
      { exerciseId: 'Lying_Leg_Curls', exerciseName: 'Lying Leg Curl (Móc Đùi Sau Máy)', primaryMuscle: 'Đùi sau', defaultWeight: 15, reps: 12, setsCount: 3 },
    ],
    accessoryIsolation: [
      { exerciseId: 'Standing_Calf_Raises', exerciseName: 'Calf Raise (Nhón Bắp Chuối)', primaryMuscle: 'Bắp chân', defaultWeight: 20, reps: 15, setsCount: 3 },
      { exerciseId: 'Ab_Crunch_Machine', exerciseName: 'Machine Crunch (Gập Bụng Máy)', primaryMuscle: 'Cơ bụng', defaultWeight: 15, reps: 15, setsCount: 3 },
    ],
  },
};

// Hàm sinh giáo án thông minh tự động
export function generateSmartWorkout(config: SmartWorkoutConfig): WorkoutSession {
  // Xác định số lượng bài tập theo thời gian
  // 30 phút: 3-4 bài
  // 45 phút: 4-5 bài
  // 60 phút: 5-6 bài
  const targetExerciseCount = config.durationMinutes === 30 ? 3 : config.durationMinutes === 45 ? 4 : 5;

  // Lấy danh mục bài tập tương ứng hoặc fallback
  const poolKey = `${config.target}_${config.equipment}_${config.level}`;
  const pool =
    EXERCISE_POOL[poolKey] ||
    EXERCISE_POOL['fullbody_gym_newbie'];

  const selectedExercises: PredefinedExercise[] = [];

  // Lấy các bài Compound chính
  pool.mainCompound.forEach((ex) => {
    if (selectedExercises.length < targetExerciseCount) selectedExercises.push(ex);
  });

  // Lấy các bài Compound phụ
  pool.secondaryCompound.forEach((ex) => {
    if (selectedExercises.length < targetExerciseCount) selectedExercises.push(ex);
  });

  // Lấy các bài bổ trợ nếu còn thời lượng
  pool.accessoryIsolation.forEach((ex) => {
    if (selectedExercises.length < targetExerciseCount) selectedExercises.push(ex);
  });

  // Chuyển đổi thành WorkoutExerciseItem với SetLog
  const sessionExercises: WorkoutExerciseItem[] = selectedExercises.map((pEx) => {
    const guide = getExerciseGuide(pEx.exerciseId, pEx.exerciseName, null, pEx.primaryMuscle);
    const weight = guide.startingWeightGuide.recommendedWeightKg || pEx.defaultWeight;

    const sets: SetLog[] = Array.from({ length: pEx.setsCount }).map((_, i) => ({
      id: `smart-set-${Date.now()}-${pEx.exerciseId}-${i + 1}`,
      setNumber: i + 1,
      setType: i === 0 ? 'warmup' : 'normal',
      weightKg: i === 0 ? Math.round(weight * 0.7) : weight, // Set 1 là hiệp khởi động nhẹ
      reps: i === 0 ? 12 : pEx.reps,
      isCompleted: false,
    }));

    return {
      exerciseId: pEx.exerciseId,
      exerciseName: pEx.exerciseName,
      primaryMuscle: pEx.primaryMuscle,
      sets,
    };
  });

  const targetTitles: Record<WorkoutSplitTarget, string> = {
    fullbody: 'Toàn Thân (Full Body)',
    upper: 'Thân Trên (Upper Body)',
    lower: 'Thân Dưới & Chân Mông (Lower)',
    push: 'Đẩy (Push: Ngực - Vai - Tay Sau)',
    pull: 'Kéo (Pull: Lưng - Tay Trước)',
    core_cardio: 'Bụng & Phục Hồi (Core & Recovery)',
  };

  const title = `Lộ Trình ${targetTitles[config.target]} • ${config.durationMinutes} Phút`;

  return {
    id: `smart-session-${Date.now()}`,
    title,
    startTime: new Date().toISOString(),
    durationSeconds: 0,
    exercises: sessionExercises,
    totalVolumeKg: 0,
    totalSets: 0,
    notes: `Giáo án thông minh tối ưu cho thời lượng ${config.durationMinutes} phút. Set đầu là set khởi động làm quen đường tạ.`,
  };
}

// Gợi ý thông minh cho ngày hôm nay dựa theo thứ trong tuần
export function getTodayRecommendation(dayOfWeek?: number): {
  dayName: string;
  recommendedSplit: WorkoutSplitTarget;
  routineId: string;
  title: string;
  description: string;
  focusMuscles: string;
  suggestedDuration: number;
} {
  const day = dayOfWeek !== undefined ? dayOfWeek : 1;

  switch (day) {
    case 1: // Thứ 2
      return {
        dayName: 'Thứ Hai',
        recommendedSplit: 'fullbody',
        routineId: 'newbie-fullbody-a',
        title: 'Full Body A (Kích Hoạt Đầu Tuần)',
        description: 'Tập trung đẩy ngực, đạp đùi, kéo xô và vai với máy an toàn để khởi động tuần mới tràn đầy năng lượng.',
        focusMuscles: 'Ngực, Đùi, Lưng, Vai',
        suggestedDuration: 45,
      };
    case 3: // Thứ 4
      return {
        dayName: 'Thứ Tư',
        recommendedSplit: 'fullbody',
        routineId: 'newbie-fullbody-b',
        title: 'Full Body B (Cân Bằng Cơ Kéo & Đùi Sau)',
        description: 'Đổi gió với ngực trên, đùi sau và chèo lưng giúp cơ thể phát triển cân đối và sửa tư thế gù lưng.',
        focusMuscles: 'Ngực Trên, Đùi Sau, Lưng, Tay Trước',
        suggestedDuration: 45,
      };
    case 5: // Thứ 6
      return {
        dayName: 'Thứ Sáu',
        recommendedSplit: 'fullbody',
        routineId: 'newbie-fullbody-a',
        title: 'Full Body A (Chốt Tuần Bùng Nổ)',
        description: 'Lặp lại buổi A với tinh thần vững vàng, củng cố kỹ thuật và kích thích cơ bắp trước ngày nghỉ cuối tuần.',
        focusMuscles: 'Toàn thân căn bản',
        suggestedDuration: 45,
      };
    case 2: // Thứ 3
    case 4: // Thứ 5
      return {
        dayName: day === 2 ? 'Thứ Ba' : 'Thứ Năm',
        recommendedSplit: 'core_cardio',
        routineId: 'newbie-fullbody-b',
        title: 'Ngày Nghỉ Phục Hồi Hoặc Tập Bù',
        description: 'Hôm qua cơ bắp đã hoạt động mạnh. Hôm nay nên đi bộ nhẹ, giãn cơ hoặc tập bụng. Nếu hôm qua bận, bạn có thể tập bù buổi Full Body.',
        focusMuscles: 'Cơ Bụng, Giãn Cơ, Cardio',
        suggestedDuration: 30,
      };
    default: // Thứ 7, Chủ Nhật
      return {
        dayName: day === 6 ? 'Thứ Bảy' : 'Chủ Nhật',
        recommendedSplit: 'fullbody',
        routineId: 'newbie-fullbody-a',
        title: 'Cuối Tuần: Duy Trì Phong Độ',
        description: 'Dành 40 phút cuối tuần để xả stress, duy trì sức bền và tái tạo năng lượng cho tuần tiếp theo.',
        focusMuscles: 'Vận động toàn thân',
        suggestedDuration: 40,
      };
  }
}
