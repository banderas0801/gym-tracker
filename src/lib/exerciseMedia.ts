import exercisesData from '@/data/exercises.json';
import { Exercise } from '@/types/workout';

const exercisesList = exercisesData as unknown as Exercise[];

// Cache tra cứu nhanh theo ID và tên đã chuẩn hóa
const exerciseCache = new Map<string, Exercise>();

// Khởi tạo cache
exercisesList.forEach((ex) => {
  exerciseCache.set(ex.id.toLowerCase(), ex);
  exerciseCache.set(ex.name.toLowerCase(), ex);
  // Thêm phiên bản bỏ gạch dưới
  exerciseCache.set(ex.id.toLowerCase().replace(/_/g, ' '), ex);
});

export interface ExerciseMediaInfo {
  id: string;
  name: string;
  images: string[];
  startImageUrl: string | null;
  endImageUrl: string | null;
  instructions: string[];
  primaryMuscles: string[];
  secondaryMuscles: string[];
  equipment?: string | null;
  level?: string;
  category?: string;
}

// =========================================================================
// BẢNG ÁNH XẠ HÌNH ẢNH CHUẨN XÁC TUYỆT ĐỐI (CURATED EXERCISE IMAGE MAP)
// Khắc phục triệt để lỗi khớp lộn hình (vd: Butterfly -> Butt-ups, Treadmill -> Lunges)
// =========================================================================
const CURATED_EXERCISE_MEDIA_MAP: Record<string, {
  nameVi: string;
  images: string[];
  primaryMuscles: string[];
  equipment: string;
}> = {
  // --- NGỰC (CHEST) ---
  'barbell_bench_press_-_medium_grip': {
    nameVi: 'Đẩy ngực đòn ngang (Barbell Bench Press)',
    images: ['Barbell_Bench_Press_-_Medium_Grip/0.jpg', 'Barbell_Bench_Press_-_Medium_Grip/1.jpg'],
    primaryMuscles: ['chest'],
    equipment: 'barbell',
  },
  'incline_dumbbell_press': {
    nameVi: 'Đẩy ngực trên tạ đơn (Incline Dumbbell Press)',
    images: ['Incline_Dumbbell_Press/0.jpg', 'Incline_Dumbbell_Press/1.jpg'],
    primaryMuscles: ['chest'],
    equipment: 'dumbbell',
  },
  'dumbbell_flyes': {
    nameVi: 'Banh ngực tạ đơn (Dumbbell Flyes)',
    images: ['Dumbbell_Flyes/0.jpg', 'Dumbbell_Flyes/1.jpg'],
    primaryMuscles: ['chest'],
    equipment: 'dumbbell',
  },
  'butterfly': {
    nameVi: 'Ép ngực trong cánh bướm máy tạ khối (Butterfly / Pec Deck Fly)',
    images: ['Butterfly/0.jpg', 'Butterfly/1.jpg'],
    primaryMuscles: ['chest'],
    equipment: 'machine',
  },
  'pec_deck_fly': {
    nameVi: 'Ép ngực máy tạ khối (Pec Deck Fly)',
    images: ['Butterfly/0.jpg', 'Butterfly/1.jpg'],
    primaryMuscles: ['chest'],
    equipment: 'machine',
  },
  'cable_chest_press': {
    nameVi: 'Đẩy ngực máy tạ khối / cáp (Cable Chest Press)',
    images: ['Cable_Chest_Press/0.jpg', 'Cable_Chest_Press/1.jpg'],
    primaryMuscles: ['chest'],
    equipment: 'machine',
  },
  'leverage_chest_press': {
    nameVi: 'Đẩy ngực máy robot (Leverage Chest Press)',
    images: ['Leverage_Chest_Press/0.jpg', 'Leverage_Chest_Press/1.jpg'],
    primaryMuscles: ['chest'],
    equipment: 'machine',
  },
  'leverage_incline_chest_press': {
    nameVi: 'Đẩy ngực trên máy robot (Leverage Incline Press)',
    images: ['Leverage_Incline_Chest_Press/0.jpg', 'Leverage_Incline_Chest_Press/1.jpg'],
    primaryMuscles: ['chest'],
    equipment: 'machine',
  },
  'pushups': {
    nameVi: 'Hít đất chuẩn form (Push-ups)',
    images: ['Pushups/0.jpg', 'Pushups/1.jpg'],
    primaryMuscles: ['chest'],
    equipment: 'body only',
  },
  'dips_-_chest_version': {
    nameVi: 'Chống xà kép tập ngực (Chest Dips)',
    images: ['Dips_-_Chest_Version/0.jpg', 'Dips_-_Chest_Version/1.jpg'],
    primaryMuscles: ['chest'],
    equipment: 'other',
  },
  'smith_machine_bench_press': {
    nameVi: 'Đẩy ngực ngang máy Smith (Smith Bench Press)',
    images: ['Smith_Machine_Bench_Press/0.jpg', 'Smith_Machine_Bench_Press/1.jpg'],
    primaryMuscles: ['chest'],
    equipment: 'machine',
  },
  'smith_machine_incline_bench_press': {
    nameVi: 'Đẩy ngực trên máy Smith (Incline Smith Press)',
    images: ['Smith_Machine_Incline_Bench_Press/0.jpg', 'Smith_Machine_Incline_Bench_Press/1.jpg'],
    primaryMuscles: ['chest'],
    equipment: 'machine',
  },
  'cable_crossover': {
    nameVi: 'Kéo cáp ép ngực rãnh trong (Cable Crossover)',
    images: ['Cable_Crossover/0.jpg', 'Cable_Crossover/1.jpg'],
    primaryMuscles: ['chest'],
    equipment: 'cable',
  },

  // --- LƯNG XÔ (BACK & LATS) ---
  'wide-grip_lat_pulldown': {
    nameVi: 'Kéo xô rộng tay máy cáp (Lat Pulldown)',
    images: ['Wide-Grip_Lat_Pulldown/0.jpg', 'Wide-Grip_Lat_Pulldown/1.jpg'],
    primaryMuscles: ['lats'],
    equipment: 'cable',
  },
  'close-grip_front_lat_pulldown': {
    nameVi: 'Kéo xô hẹp tay máy cáp (Close-Grip Pulldown)',
    images: ['Close-Grip_Front_Lat_Pulldown/0.jpg', 'Close-Grip_Front_Lat_Pulldown/1.jpg'],
    primaryMuscles: ['lats'],
    equipment: 'cable',
  },
  'seated_cable_rows': {
    nameVi: 'Ngồi chèo thuyền kéo cáp (Seated Cable Row)',
    images: ['Seated_Cable_Rows/0.jpg', 'Seated_Cable_Rows/1.jpg'],
    primaryMuscles: ['middle back'],
    equipment: 'cable',
  },
  'bent_over_barbell_row': {
    nameVi: 'Gập người chèo tạ đòn (Bent Over Barbell Row)',
    images: ['Bent_Over_Barbell_Row/0.jpg', 'Bent_Over_Barbell_Row/1.jpg'],
    primaryMuscles: ['middle back'],
    equipment: 'barbell',
  },
  'leverage_iso_row': {
    nameVi: 'Kéo lưng xô đòn bẩy robot (Leverage Row)',
    images: ['Leverage_Iso_Row/0.jpg', 'Leverage_Iso_Row/1.jpg'],
    primaryMuscles: ['lats'],
    equipment: 'machine',
  },
  'smith_machine_bent_over_row': {
    nameVi: 'Chèo lưng với máy Smith (Smith Machine Row)',
    images: ['Smith_Machine_Bent_Over_Row/0.jpg', 'Smith_Machine_Bent_Over_Row/1.jpg'],
    primaryMuscles: ['middle back'],
    equipment: 'machine',
  },
  'barbell_deadlift': {
    nameVi: 'Kéo tạ đòn Deadlift truyền thống (Barbell Deadlift)',
    images: ['Barbell_Deadlift/0.jpg', 'Barbell_Deadlift/1.jpg'],
    primaryMuscles: ['lower back'],
    equipment: 'barbell',
  },
  'pullups': {
    nameVi: 'Hít xà đơn (Pull-ups)',
    images: ['Pullups/0.jpg', 'Pullups/1.jpg'],
    primaryMuscles: ['lats'],
    equipment: 'body only',
  },
  'face_pull': {
    nameVi: 'Kéo cáp vào mặt tập vai sau & lưng trên (Face Pull)',
    images: ['Face_Pull/0.jpg', 'Face_Pull/1.jpg'],
    primaryMuscles: ['shoulders'],
    equipment: 'cable',
  },

  // --- CHÂN, MÔNG, ĐÙI (LEGS & GLUTES) ---
  'barbell_full_squat': {
    nameVi: 'Gánh tạ đòn Squat (Barbell Full Squat)',
    images: ['Barbell_Full_Squat/0.jpg', 'Barbell_Full_Squat/1.jpg'],
    primaryMuscles: ['quadriceps'],
    equipment: 'barbell',
  },
  'leg_press': {
    nameVi: 'Đạp đùi tạ khối / máy robot (Leg Press)',
    images: ['Leg_Press/0.jpg', 'Leg_Press/1.jpg'],
    primaryMuscles: ['quadriceps'],
    equipment: 'machine',
  },
  'leg_extensions': {
    nameVi: 'Đá đùi trước máy tạ khối (Leg Extensions)',
    images: ['Leg_Extensions/0.jpg', 'Leg_Extensions/1.jpg'],
    primaryMuscles: ['quadriceps'],
    equipment: 'machine',
  },
  'lying_leg_curls': {
    nameVi: 'Nằm móc đùi sau máy tạ khối (Lying Leg Curls)',
    images: ['Lying_Leg_Curls/0.jpg', 'Lying_Leg_Curls/1.jpg'],
    primaryMuscles: ['hamstrings'],
    equipment: 'machine',
  },
  'romanian_deadlift': {
    nameVi: 'Deadlift đùi sau & mông (Romanian Deadlift)',
    images: ['Romanian_Deadlift/0.jpg', 'Romanian_Deadlift/1.jpg'],
    primaryMuscles: ['hamstrings'],
    equipment: 'barbell',
  },
  'calf_press_on_the_leg_press_machine': {
    nameVi: 'Đạp bắp chuối trên máy Leg Press (Calf Press)',
    images: ['Calf_Press_On_The_Leg_Press_Machine/0.jpg', 'Calf_Press_On_The_Leg_Press_Machine/1.jpg'],
    primaryMuscles: ['calves'],
    equipment: 'machine',
  },
  'standing_calf_raises': {
    nameVi: 'Nhón bắp chuối đứng (Standing Calf Raises)',
    images: ['Standing_Calf_Raises/0.jpg', 'Standing_Calf_Raises/1.jpg'],
    primaryMuscles: ['calves'],
    equipment: 'machine',
  },
  'dumbbell_lunges': {
    nameVi: 'Bước đổi chân chùng đùi (Dumbbell Lunges)',
    images: ['Dumbbell_Lunges/0.jpg', 'Dumbbell_Lunges/1.jpg'],
    primaryMuscles: ['quadriceps'],
    equipment: 'dumbbell',
  },
  'adductor': {
    nameVi: 'Ép đùi trong máy tạ khối (Inner Thigh Machine / Adductor)',
    images: ['Cable_Hip_Adduction/0.jpg', 'Cable_Hip_Adduction/1.jpg'],
    primaryMuscles: ['quadriceps'],
    equipment: 'machine',
  },
  'cable_hip_adduction': {
    nameVi: 'Ép đùi trong máy tạ khối (Inner Thigh Machine / Adductor)',
    images: ['Cable_Hip_Adduction/0.jpg', 'Cable_Hip_Adduction/1.jpg'],
    primaryMuscles: ['quadriceps'],
    equipment: 'machine',
  },
  'thigh_abductor': {
    nameVi: 'Banh hông mông ngoài máy tạ khối (Outer Thigh Abduction)',
    images: ['Barbell_Side_Split_Squat/0.jpg', 'Barbell_Side_Split_Squat/1.jpg'],
    primaryMuscles: ['glutes'],
    equipment: 'machine',
  },
  'smith_machine_squat': {
    nameVi: 'Gánh đùi trên máy Smith (Smith Machine Squat)',
    images: ['Smith_Machine_Squat/0.jpg', 'Smith_Machine_Squat/1.jpg'],
    primaryMuscles: ['quadriceps'],
    equipment: 'machine',
  },

  // --- VAI & TAY (SHOULDERS & ARMS) ---
  'dumbbell_shoulder_press': {
    nameVi: 'Đẩy vai tạ đơn ngồi (Dumbbell Shoulder Press)',
    images: ['Dumbbell_Shoulder_Press/0.jpg', 'Dumbbell_Shoulder_Press/1.jpg'],
    primaryMuscles: ['shoulders'],
    equipment: 'dumbbell',
  },
  'standing_dumbbell_shoulder_press': {
    nameVi: 'Đẩy vai tạ đơn đứng (Standing Shoulder Press)',
    images: ['Standing_Dumbbell_Shoulder_Press/0.jpg', 'Standing_Dumbbell_Shoulder_Press/1.jpg'],
    primaryMuscles: ['shoulders'],
    equipment: 'dumbbell',
  },
  'side_lateral_raise': {
    nameVi: 'Bay vai tạ đơn hai bên (Side Lateral Raise)',
    images: ['Side_Lateral_Raise/0.jpg', 'Side_Lateral_Raise/1.jpg'],
    primaryMuscles: ['shoulders'],
    equipment: 'dumbbell',
  },
  'leverage_shoulder_press': {
    nameVi: 'Đẩy vai máy robot đòn bẩy (Leverage Shoulder Press)',
    images: ['Leverage_Shoulder_Press/0.jpg', 'Leverage_Shoulder_Press/1.jpg'],
    primaryMuscles: ['shoulders'],
    equipment: 'machine',
  },
  'smith_machine_overhead_shoulder_press': {
    nameVi: 'Đẩy vai máy Smith (Smith Shoulder Press)',
    images: ['Smith_Machine_Overhead_Shoulder_Press/0.jpg', 'Smith_Machine_Overhead_Shoulder_Press/1.jpg'],
    primaryMuscles: ['shoulders'],
    equipment: 'machine',
  },
  'smith_machine_behind_the_back_shrug': {
    nameVi: 'Nhún cầu vai máy Smith (Smith Machine Shrugs)',
    images: ['Smith_Machine_Behind_the_Back_Shrug/0.jpg', 'Smith_Machine_Behind_the_Back_Shrug/1.jpg'],
    primaryMuscles: ['traps'],
    equipment: 'machine',
  },
  'triceps_pushdown': {
    nameVi: 'Ấn tay sau dây cáp (Triceps Pushdown)',
    images: ['Triceps_Pushdown/0.jpg', 'Triceps_Pushdown/1.jpg'],
    primaryMuscles: ['triceps'],
    equipment: 'cable',
  },
  'bench_dips': {
    nameVi: 'Chống đẩy tay sau với ghế (Bench Dips)',
    images: ['Bench_Dips/0.jpg', 'Bench_Dips/1.jpg'],
    primaryMuscles: ['triceps'],
    equipment: 'body only',
  },
  'barbell_curl': {
    nameVi: 'Cuốn bắp tay trước đòn thẳng (Barbell Curl)',
    images: ['Barbell_Curl/0.jpg', 'Barbell_Curl/1.jpg'],
    primaryMuscles: ['biceps'],
    equipment: 'barbell',
  },
  'ez-bar_curl': {
    nameVi: 'Cuốn bắp tay trước đòn cong EZ (EZ-Bar Curl)',
    images: ['EZ-Bar_Curl/0.jpg', 'EZ-Bar_Curl/1.jpg'],
    primaryMuscles: ['biceps'],
    equipment: 'e-z curl bar',
  },

  // --- CƠ BỤNG & LÕI (CORE & ABS) ---
  'crunches': {
    nameVi: 'Gập bụng cơ bản (Crunches)',
    images: ['Crunches/0.jpg', 'Crunches/1.jpg'],
    primaryMuscles: ['abdominals'],
    equipment: 'body only',
  },
  'ab_crunch_machine': {
    nameVi: 'Gập bụng tạ khối (Abdominal Crunch Machine)',
    images: ['Crunches/0.jpg', 'Crunches/1.jpg'],
    primaryMuscles: ['abdominals'],
    equipment: 'machine',
  },
  'decline_crunch': {
    nameVi: 'Gập bụng trên ghế dốc (Decline Crunch)',
    images: ['Decline_Crunch/0.jpg', 'Decline_Crunch/1.jpg'],
    primaryMuscles: ['abdominals'],
    equipment: 'body only',
  },
  'hanging_leg_raise': {
    nameVi: 'Treo người nâng chân gập bụng dưới (Hanging Leg Raise)',
    images: ['Hanging_Leg_Raise/0.jpg', 'Hanging_Leg_Raise/1.jpg'],
    primaryMuscles: ['abdominals'],
    equipment: 'body only',
  },
  'flat_bench_lying_leg_raise': {
    nameVi: 'Nằm nâng chân gập bụng dưới (Lying Leg Raise)',
    images: ['Flat_Bench_Lying_Leg_Raise/0.jpg', 'Flat_Bench_Lying_Leg_Raise/1.jpg'],
    primaryMuscles: ['abdominals'],
    equipment: 'body only',
  },
  'cable_crunch': {
    nameVi: 'Gập bụng quỳ kéo cáp (Cable Crunch)',
    images: ['Cable_Crunch/0.jpg', 'Cable_Crunch/1.jpg'],
    primaryMuscles: ['abdominals'],
    equipment: 'cable',
  },
  'ab_roller': {
    nameVi: 'Đẩy con lăn tập cơ bụng (Ab Roller)',
    images: ['Ab_Roller/0.jpg', 'Ab_Roller/1.jpg'],
    primaryMuscles: ['abdominals'],
    equipment: 'other',
  },
  'dumbbell_side_bend': {
    nameVi: 'Gập lườn tập cơ liên sườn tạ đơn (Side Bend)',
    images: ['Dumbbell_Side_Bend/0.jpg', 'Dumbbell_Side_Bend/1.jpg'],
    primaryMuscles: ['abdominals'],
    equipment: 'dumbbell',
  },
  'plank': {
    nameVi: 'Tư thế đo ván giữ cơ lõi (Plank)',
    images: ['Plank/0.jpg', 'Plank/1.jpg'],
    primaryMuscles: ['abdominals'],
    equipment: 'body only',
  },
  'torso_rotation': {
    nameVi: 'Xoay eo bụng máy tạ khối (Rotary Torso Machine)',
    images: ['Seated_Barbell_Twist/0.jpg', 'Seated_Barbell_Twist/1.jpg'],
    primaryMuscles: ['abdominals'],
    equipment: 'machine',
  },
  'cable_russian_twists': {
    nameVi: 'Xoay eo cơ bụng với cáp (Cable Russian Twists)',
    images: ['Seated_Barbell_Twist/0.jpg', 'Seated_Barbell_Twist/1.jpg'],
    primaryMuscles: ['abdominals'],
    equipment: 'cable',
  },
  'good_morning': {
    nameVi: 'Gập lưng đòn tạ (Good Morning)',
    images: ['Good_Morning/0.jpg', 'Good_Morning/1.jpg'],
    primaryMuscles: ['hamstrings'],
    equipment: 'barbell',
  },

  // --- CARDIO CHUYÊN BIỆT PHÒNG GYM ---
  'bicycling_stationary': {
    nameVi: 'Đạp xe tại chỗ phòng gym (Stationary Bike)',
    images: ['Bicycling_Stationary/0.jpg', 'Bicycling_Stationary/1.jpg'],
    primaryMuscles: ['quadriceps'],
    equipment: 'machine',
  },
  'recumbent_bike': {
    nameVi: 'Đạp xe tại chỗ phòng gym (Stationary Bike)',
    images: ['Bicycling_Stationary/0.jpg', 'Bicycling_Stationary/1.jpg'],
    primaryMuscles: ['quadriceps'],
    equipment: 'machine',
  },
  'jogging_treadmill': {
    nameVi: 'Chạy bộ máy Treadmill (Treadmill Run)',
    images: ['Jogging_Treadmill/0.jpg', 'Jogging_Treadmill/1.jpg'],
    primaryMuscles: ['quadriceps'],
    equipment: 'machine',
  },
  'walking_treadmill': {
    nameVi: 'Đi bộ dốc máy Treadmill (Incline Treadmill Walk)',
    images: ['Walking_Treadmill/0.jpg', 'Walking_Treadmill/1.jpg'],
    primaryMuscles: ['quadriceps'],
    equipment: 'machine',
  },
  'elliptical_trainer': {
    nameVi: 'Máy tập trượt tuyết Cardio (Elliptical Trainer)',
    images: ['Elliptical_Trainer/0.jpg', 'Elliptical_Trainer/1.jpg'],
    primaryMuscles: ['quadriceps'],
    equipment: 'machine',
  },
};

export function getExerciseMedia(exerciseId: string, exerciseName?: string): ExerciseMediaInfo {
  const rawId = (exerciseId || '').trim();
  const rawName = (exerciseName || '').trim();
  const idKey = rawId.toLowerCase();
  const nameKey = rawName.toLowerCase();

  // 1. ƯU TIÊN 1: Tra cứu trong Bảng Ánh Xạ Chuẩn (Curated Image Map)
  // Đảm bảo 100% hình ảnh không bao giờ bị lấy lộn!
  const curated = CURATED_EXERCISE_MEDIA_MAP[idKey] || 
                  CURATED_EXERCISE_MEDIA_MAP[idKey.replace(/[\s\-]/g, '_')] ||
                  CURATED_EXERCISE_MEDIA_MAP[nameKey];

  if (curated) {
    const startImg = `https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/${curated.images[0]}`;
    const endImg = curated.images[1]
      ? `https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/${curated.images[1]}`
      : startImg;

    return {
      id: rawId,
      name: rawName || curated.nameVi,
      images: curated.images,
      startImageUrl: startImg,
      endImageUrl: endImg,
      instructions: [],
      primaryMuscles: curated.primaryMuscles,
      secondaryMuscles: [],
      equipment: curated.equipment,
      level: 'Mọi cấp độ',
      category: 'Strength',
    };
  }

  // 2. Tìm chính xác theo ID trong Database 876 bài tập
  let match = exerciseCache.get(idKey);

  // 3. Tìm theo Tên chính xác
  if (!match && nameKey) {
    match = exerciseCache.get(nameKey);
  }

  // 4. Tìm theo ID dạng thay thế gạch dưới
  if (!match && idKey) {
    const unslugged = idKey.replace(/_/g, ' ');
    match = exerciseCache.get(unslugged);
  }

  // 5. Tìm kiếm gần đúng AN TOÀN (CHỈ khi từ khóa đủ dài >= 5 ký tự và là substring của eName)
  // Tuyệt đối không dùng cleanSearch.includes(eName) để tránh Butterfly -> Butt-ups!
  if (!match) {
    const cleanId = idKey.replace(/[_\-\(\)]/g, ' ').trim();
    if (cleanId.length >= 5) {
      match = exercisesList.find((e) => {
        const eName = e.name.toLowerCase();
        const eId = e.id.toLowerCase();
        return eName.includes(cleanId) || eId === cleanId.replace(/\s+/g, '_');
      });
    }
  }

  const images = match?.images || [];
  const startImg = images[0]
    ? `https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/${images[0]}`
    : null;
  const endImg = images[1]
    ? `https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/${images[1]}`
    : startImg;

  return {
    id: match?.id || rawId,
    name: match?.name || rawName || rawId,
    images,
    startImageUrl: startImg,
    endImageUrl: endImg,
    instructions: match?.instructions || [],
    primaryMuscles: match?.primaryMuscles || [],
    secondaryMuscles: match?.secondaryMuscles || [],
    equipment: match?.equipment || null,
    level: match?.level || 'Mọi cấp độ',
    category: match?.category || 'Strength',
  };
}
