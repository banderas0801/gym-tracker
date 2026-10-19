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
  },
  {
    id: 'thol-tang1-day1',
    name: 'Gym Phổ Tầng 1: Day 1 - Chân Mông Đùi (Leg Day)',
    targetFocus: 'Đùi trước, đùi sau, mông, bắp chân (Selectorized)',
    level: 'Newbie',
    description: 'Giáo án Gym Phổ Tầng 1 (Duy Nguyễn THOL - Tuần 1-4). Kích hoạt nhóm cơ chân đùi an toàn với tạ khối, thuần thục nhịp thở yếm khí.',
    exercises: [
      { exerciseId: 'Leg_Press', exerciseName: 'Đạp đùi tạ khối (Leg Press)', defaultSets: 4, defaultReps: 10, suggestedWeightKg: 40 },
      { exerciseId: 'Leg_Extensions', exerciseName: 'Đá đùi trước (Leg Extension)', defaultSets: 3, defaultReps: 12, suggestedWeightKg: 20 },
      { exerciseId: 'Lying_Leg_Curls', exerciseName: 'Nằm móc đùi sau (Lying Leg Curl)', defaultSets: 3, defaultReps: 12, suggestedWeightKg: 15 },
      { exerciseId: 'Calf_Press_On_The_Leg_Press_Machine', exerciseName: 'Đạp bắp chân tạ khối (Calf Press)', defaultSets: 3, defaultReps: 12, suggestedWeightKg: 30 },
      { exerciseId: 'Adductor', exerciseName: 'Ép đùi trong (Inner Thigh Machine)', defaultSets: 2, defaultReps: 15, suggestedWeightKg: 20 },
      { exerciseId: 'Thigh_Abductor', exerciseName: 'Ép hông mông ngoài (Outer Thigh Machine)', defaultSets: 2, defaultReps: 15, suggestedWeightKg: 20 }
    ]
  },
  {
    id: 'thol-tang1-day2',
    name: 'Gym Phổ Tầng 1: Day 2 - Ngực & Cơ Bụng (Chest & Abs)',
    targetFocus: 'Ngực lớn, ngực dưới, rãnh ngực, cơ bụng thẳng & liên sườn',
    level: 'Newbie',
    description: 'Giáo án Gym Phổ Tầng 1 (Duy Nguyễn THOL). Tạ khối & Bodyweight giúp xây dựng khuôn ngực dày dặn và siết múi bụng sắc nét.',
    exercises: [
      { exerciseId: 'Cable_Chest_Press', exerciseName: 'Đẩy ngực tạ khối (Chest Press)', defaultSets: 3, defaultReps: 10, suggestedWeightKg: 25 },
      { exerciseId: 'Pushups', exerciseName: 'Hít đất chuẩn form (Push-ups)', defaultSets: 3, defaultReps: 10, suggestedWeightKg: 0 },
      { exerciseId: 'Dips_-_Chest_Version', exerciseName: 'Chống xà kép trợ lực (Dips Assistant)', defaultSets: 3, defaultReps: 10, suggestedWeightKg: 0 },
      { exerciseId: 'Butterfly', exerciseName: 'Ép ngực trong tạ khối (Pec Deck Fly)', defaultSets: 2, defaultReps: 12, suggestedWeightKg: 20 },
      { exerciseId: 'Ab_Crunch_Machine', exerciseName: 'Gập bụng tạ khối (Abdominal Crunch)', defaultSets: 3, defaultReps: 12, suggestedWeightKg: 25 },
      { exerciseId: 'Torso_Rotation', exerciseName: 'Xoay eo bụng tạ khối (Rotary Torso)', defaultSets: 2, defaultReps: 15, suggestedWeightKg: 15 }
    ]
  },
  {
    id: 'thol-tang1-day3',
    name: 'Gym Phổ Tầng 1: Day 3 - Lưng & Xô (Back & Lat)',
    targetFocus: 'Lưng xô chữ V, lưng giữa, dày lưng',
    level: 'Newbie',
    description: 'Giáo án Gym Phổ Tầng 1 (Duy Nguyễn THOL). Mở rộng độ rộng xô chữ V và độ dày cơ lưng an toàn cột sống.',
    exercises: [
      { exerciseId: 'Seated_Cable_Rows', exerciseName: 'Ngồi chèo thuyền kéo cáp (Seated Cable Row)', defaultSets: 3, defaultReps: 12, suggestedWeightKg: 25 },
      { exerciseId: 'Close-Grip_Front_Lat_Pulldown', exerciseName: 'Kéo cáp hẹp tay (Close-Grip Pulldown)', defaultSets: 3, defaultReps: 12, suggestedWeightKg: 25 },
      { exerciseId: 'Wide-Grip_Lat_Pulldown', exerciseName: 'Kéo xô rộng tay (Lat Pulldown)', defaultSets: 3, defaultReps: 12, suggestedWeightKg: 25 }
    ]
  },
  {
    id: 'thol-tang1-day4',
    name: 'Gym Phổ Tầng 1: Day 4 - Vai, Tay & Bụng (Shoulder, Arm & Abs)',
    targetFocus: 'Vai trước/giữa, bắp tay trước, cơ tay sau, bụng trên/dưới',
    level: 'Newbie',
    description: 'Giáo án Gym Phổ Tầng 1 (Duy Nguyễn THOL). Hoàn thiện cầu vai vuông, bắp tay săn chắc và phẳng bụng.',
    exercises: [
      { exerciseId: 'Dumbbell_Shoulder_Press', exerciseName: 'Đẩy vai tạ khối / robot (Shoulder Press)', defaultSets: 3, defaultReps: 10, suggestedWeightKg: 8 },
      { exerciseId: 'Triceps_Pushdown', exerciseName: 'Duỗi tay sau với cáp (Triceps Pushdown)', defaultSets: 3, defaultReps: 10, suggestedWeightKg: 15 },
      { exerciseId: 'Barbell_Curl', exerciseName: 'Cuộn bắp tay trước đòn tạ (Barbell Curl)', defaultSets: 3, defaultReps: 10, suggestedWeightKg: 10 },
      { exerciseId: 'Crunches', exerciseName: 'Gập bụng trên thảm (Floor Crunches)', defaultSets: 3, defaultReps: 12, suggestedWeightKg: 0 },
      { exerciseId: 'Flat_Bench_Lying_Leg_Raise', exerciseName: 'Nằm nâng chân tập bụng dưới (Lying Leg Raise)', defaultSets: 3, defaultReps: 12, suggestedWeightKg: 0 }
    ]
  },
  {
    id: 'thol-tang1-day5',
    name: 'Gym Phổ Tầng 1: Day 5 - Chuyên Cardio Đốt Mỡ (Cardio Day)',
    targetFocus: 'Hệ tim mạch, đốt mỡ toàn thân, hồi phục cơ',
    level: 'Newbie',
    description: 'Giáo án Gym Phổ Tầng 1 (Duy Nguyễn THOL). Đạp xe và đi bộ dốc đốt sạch mỡ thừa, tăng cường sức bền tim mạch.',
    exercises: [
      { exerciseId: 'Recumbent_Bike', exerciseName: 'Đạp xe tại chỗ đốt mỡ (Stationary Bike)', defaultSets: 1, defaultReps: 20, suggestedWeightKg: 0 },
      { exerciseId: 'Walking_Treadmill', exerciseName: 'Đi bộ dốc máy chạy bộ (Incline Treadmill Walk)', defaultSets: 1, defaultReps: 20, suggestedWeightKg: 0 }
    ]
  },

  // --- GYM PHỔ TẦNG 2 (DUY NGUYỄN THOL - TUẦN 4-8: LEVERAGE MÁY ROBOT) ---
  {
    id: 'thol-tang2-day1',
    name: 'Gym Phổ Tầng 2: Day 1 - Chân Mông Đùi (Leg Day)',
    targetFocus: 'Đùi trước, đùi sau, mông, bắp chân (Leverage Robot & Tạ Khối)',
    level: 'Newbie',
    description: 'Giáo án Gym Phổ Tầng 2 (Duy Nguyễn THOL - Tuần 4-8). Phát triển đùi mông săn chắc với máy robot đòn bẩy Plate-loaded và tạ khối cô lập.',
    exercises: [
      { exerciseId: 'Leg_Press', exerciseName: 'Đạp đùi máy robot (Leverage Leg Press)', defaultSets: 4, defaultReps: 10, suggestedWeightKg: 60 },
      { exerciseId: 'Leg_Press', exerciseName: 'Đạp đùi đòn xéo máy robot (Linear Leg Press)', defaultSets: 2, defaultReps: 10, suggestedWeightKg: 50 },
      { exerciseId: 'Dumbbell_Lunges', exerciseName: 'Bước đổi chân với tạ chuông/tạ đơn (Lunge)', defaultSets: 4, defaultReps: 10, suggestedWeightKg: 10 },
      { exerciseId: 'Lying_Leg_Curls', exerciseName: 'Nằm móc đùi sau tạ khối (Selectorized Leg Curl)', defaultSets: 3, defaultReps: 12, suggestedWeightKg: 20 },
      { exerciseId: 'Calf_Press_On_The_Leg_Press_Machine', exerciseName: 'Đạp bắp chân máy robot (Calf Press)', defaultSets: 3, defaultReps: 10, suggestedWeightKg: 40 },
      { exerciseId: 'Adductor', exerciseName: 'Ép đùi trong tạ khối (Inner Thigh Machine)', defaultSets: 2, defaultReps: 12, suggestedWeightKg: 25 },
      { exerciseId: 'Thigh_Abductor', exerciseName: 'Ép hông mông ngoài tạ khối (Outer Thigh Machine)', defaultSets: 2, defaultReps: 12, suggestedWeightKg: 25 },
      { exerciseId: 'Recumbent_Bike', exerciseName: 'Cardio đạp xe nhẹ đốt mỡ & phục hồi (Spinning Bike)', defaultSets: 1, defaultReps: 15, suggestedWeightKg: 0 }
    ]
  },
  {
    id: 'thol-tang2-day2',
    name: 'Gym Phổ Tầng 2: Day 2 - Ngực & Cơ Bụng (Chest & Abs)',
    targetFocus: 'Ngực trên, rãnh ngực, cạnh ngực, cơ bụng trên & bụng dưới',
    level: 'Newbie',
    description: 'Giáo án Gym Phổ Tầng 2 (Duy Nguyễn THOL). Tăng tải ngực với máy robot độc lập 2 bên đòn bẩy, siết cơ bụng sắc nét.',
    exercises: [
      { exerciseId: 'Leverage_Chest_Press', exerciseName: 'Đẩy ngực rộng máy robot (Leverage Wide Chest Press)', defaultSets: 2, defaultReps: 10, suggestedWeightKg: 30 },
      { exerciseId: 'Leverage_Chest_Press', exerciseName: 'Đẩy ngực máy robot đòn bẩy (Leverage Chest Press)', defaultSets: 2, defaultReps: 10, suggestedWeightKg: 30 },
      { exerciseId: 'Leverage_Incline_Chest_Press', exerciseName: 'Đẩy ngực trên máy robot (Leverage Incline Press)', defaultSets: 2, defaultReps: 10, suggestedWeightKg: 25 },
      { exerciseId: 'Dips_-_Chest_Version', exerciseName: 'Chống đẩy ngực máy robot (Leverage Seated Dips)', defaultSets: 3, defaultReps: 10, suggestedWeightKg: 20 },
      { exerciseId: 'Butterfly', exerciseName: 'Ép ngực trong cánh bướm hoàng hôn (Butterfly)', defaultSets: 2, defaultReps: 12, suggestedWeightKg: 25 },
      { exerciseId: 'Crunches', exerciseName: 'Gập bụng ghế dốc lên (Incline Crunch)', defaultSets: 3, defaultReps: 12, suggestedWeightKg: 0 },
      { exerciseId: 'Decline_Crunch', exerciseName: 'Nâng chân tập bụng dưới ghế dốc (Decline Crunch)', defaultSets: 2, defaultReps: 15, suggestedWeightKg: 0 },
      { exerciseId: 'Recumbent_Bike', exerciseName: 'Cardio đạp xe nhẹ đốt mỡ (Recumbent Bike)', defaultSets: 1, defaultReps: 15, suggestedWeightKg: 0 }
    ]
  },
  {
    id: 'thol-tang2-day3',
    name: 'Gym Phổ Tầng 2: Day 3 - Lưng & Xô (Back & Lat)',
    targetFocus: 'Lưng dày, xô chữ V, lưng giữa, phục hồi cột sống',
    level: 'Newbie',
    description: 'Giáo án Gym Phổ Tầng 2 (Duy Nguyễn THOL). Máy đòn bẩy Leverage Row tác động sâu vào từng thớ cơ lưng xô mà không mỏi lưng dưới.',
    exercises: [
      { exerciseId: 'Leverage_Iso_Row', exerciseName: 'Kéo lưng xô đòn bẩy robot (Leverage Row)', defaultSets: 3, defaultReps: 10, suggestedWeightKg: 30 },
      { exerciseId: 'Seated_Cable_Rows', exerciseName: 'Ngồi kéo lưng tạ khối (Leverage Low Row)', defaultSets: 3, defaultReps: 10, suggestedWeightKg: 30 },
      { exerciseId: 'Wide-Grip_Lat_Pulldown', exerciseName: 'Kéo xô máy đòn bẩy robot (Leverage Lat Pulldown)', defaultSets: 3, defaultReps: 10, suggestedWeightKg: 30 },
      { exerciseId: 'Recumbent_Bike', exerciseName: 'Cardio đạp xe nhẹ phục hồi (Upright Bike)', defaultSets: 1, defaultReps: 15, suggestedWeightKg: 0 }
    ]
  },
  {
    id: 'thol-tang2-day4',
    name: 'Gym Phổ Tầng 2: Day 4 - Vai, Tay & Bụng (Shoulder, Arm & Abs)',
    targetFocus: 'Cầu vai robot, bắp tay trước EZ, tay sau ghế, liên sườn & cơ lõi',
    level: 'Newbie',
    description: 'Giáo án Gym Phổ Tầng 2 (Duy Nguyễn THOL). Hoàn thiện cầu vai vuông đòn bẩy, tay săn chắc và con lăn bụng bùng nổ.',
    exercises: [
      { exerciseId: 'Leverage_Shoulder_Press', exerciseName: 'Đẩy vai máy robot đòn bẩy (Leverage Shoulder Press)', defaultSets: 3, defaultReps: 10, suggestedWeightKg: 20 },
      { exerciseId: 'Bench_Dips', exerciseName: 'Chống đẩy tay sau với ghế (Bench Dip)', defaultSets: 3, defaultReps: 10, suggestedWeightKg: 0 },
      { exerciseId: 'EZ-Bar_Curl', exerciseName: 'Cuốn bắp tay trước đòn cong (EZ Barbell Curl)', defaultSets: 3, defaultReps: 10, suggestedWeightKg: 12 },
      { exerciseId: 'Ab_Roller', exerciseName: 'Đẩy bụng tình yêu con lăn (Ab Roller)', defaultSets: 3, defaultReps: 12, suggestedWeightKg: 0 },
      { exerciseId: 'Dumbbell_Side_Bend', exerciseName: 'Gập bụng xiên với tạ chuông/tạ đơn (Side Bend)', defaultSets: 3, defaultReps: 12, suggestedWeightKg: 8 },
      { exerciseId: 'Plank', exerciseName: 'Giảm mỡ bụng bền cơ lưng (Yoga Plank)', defaultSets: 2, defaultReps: 60, suggestedWeightKg: 0 },
      { exerciseId: 'Elliptical_Trainer', exerciseName: 'Cardio trượt tuyết nhẹ (Elliptical Trainer)', defaultSets: 1, defaultReps: 15, suggestedWeightKg: 0 }
    ]
  },
  {
    id: 'thol-tang2-day5',
    name: 'Gym Phổ Tầng 2: Day 5 - Chuyên Cardio Đốt Mỡ (Cardio Day)',
    targetFocus: 'Hệ tim mạch, tăng Testosterone, đốt sạch mỡ thừa, tăng sức chịu đựng',
    level: 'Newbie',
    description: 'Giáo án Gym Phổ Tầng 2 (Duy Nguyễn THOL). Đốt mỡ bứt phá và nâng cao dung tích phổi với Treadmill chạy và đi bộ dốc.',
    exercises: [
      { exerciseId: 'Jogging_Treadmill', exerciseName: 'Chạy bộ máy chạy đốt mỡ tăng thể lực (Treadmill Run)', defaultSets: 1, defaultReps: 20, suggestedWeightKg: 0 },
      { exerciseId: 'Walking_Treadmill', exerciseName: 'Đi bộ nhanh dốc máy chạy tăng sức mạnh (Treadmill Walk)', defaultSets: 1, defaultReps: 20, suggestedWeightKg: 0 }
    ]
  },

  // --- GYM PHỔ TẦNG 3 (DUY NGUYỄN THOL - TUẦN 8-12: FREE WEIGHT & MÁY SMITH) ---
  {
    id: 'thol-tang3-day1',
    name: 'Gym Phổ Tầng 3: Day 1 - Chân Mông Đùi (Leg Day)',
    targetFocus: 'Gánh đùi Squat Smith, Lunge đùi, Romanian Deadlift mông đùi sau, bắp chân',
    level: 'Intermediate',
    description: 'Giáo án Gym Phổ Tầng 3 (Duy Nguyễn THOL - Tuần 8-12). Chuyển sang máy Smith và Free Weight, kích hoạt cơ thăng bằng và sức mạnh bộc phát.',
    exercises: [
      { exerciseId: 'Smith_Machine_Squat', exerciseName: 'Gánh đùi máy Smith (Regular Smith Machine Squats)', defaultSets: 3, defaultReps: 10, suggestedWeightKg: 40 },
      { exerciseId: 'Dumbbell_Lunges', exerciseName: 'Gánh đùi đổi chân máy Smith / Tạ đơn (Smith Lunge)', defaultSets: 3, defaultReps: 10, suggestedWeightKg: 20 },
      { exerciseId: 'Romanian_Deadlift', exerciseName: 'Tập cơ đùi sau với tạ chuông/đòn (Romanian Deadlift)', defaultSets: 4, defaultReps: 8, suggestedWeightKg: 30 },
      { exerciseId: 'Calf_Press_On_The_Leg_Press_Machine', exerciseName: 'Tập cơ bắp chân máy Smith (Smith Calf Raise)', defaultSets: 3, defaultReps: 10, suggestedWeightKg: 40 },
      { exerciseId: 'Recumbent_Bike', exerciseName: 'Cardio đạp xe nhẹ đốt mỡ & phục hồi (Spinning Bike)', defaultSets: 1, defaultReps: 15, suggestedWeightKg: 0 }
    ]
  },
  {
    id: 'thol-tang3-day2',
    name: 'Gym Phổ Tầng 3: Day 2 - Ngực & Cơ Bụng (Chest & Abs)',
    targetFocus: 'Ngực trên dốc Smith, ngực bằng Smith, chống đẩy ngực robot, rãnh ngực cáp, bụng',
    level: 'Intermediate',
    description: 'Giáo án Gym Phổ Tầng 3 (Duy Nguyễn THOL). Đẩy ngực Smith Machine Incline & Flat kết hợp dây cáp cô lập rãnh ngực sắc nét.',
    exercises: [
      { exerciseId: 'Smith_Machine_Incline_Bench_Press', exerciseName: 'Đẩy ngực trên máy Smith (Incline Smith Bench Press)', defaultSets: 3, defaultReps: 10, suggestedWeightKg: 35 },
      { exerciseId: 'Smith_Machine_Bench_Press', exerciseName: 'Đẩy ngực dưới/ngang máy Smith (Smith Bench Press)', defaultSets: 3, defaultReps: 10, suggestedWeightKg: 40 },
      { exerciseId: 'Dips_-_Chest_Version', exerciseName: 'Chống đẩy ngực máy robot (Leverage Seated Dips)', defaultSets: 3, defaultReps: 10, suggestedWeightKg: 25 },
      { exerciseId: 'Cable_Crossover', exerciseName: 'Ép ngực trong với cáp (Cable Fly)', defaultSets: 2, defaultReps: 12, suggestedWeightKg: 15 },
      { exerciseId: 'Cable_Crunch', exerciseName: 'Gập bụng trên với cáp quỳ (Cable Crunch)', defaultSets: 3, defaultReps: 12, suggestedWeightKg: 25 },
      { exerciseId: 'Hanging_Leg_Raise', exerciseName: 'Nâng gối tập bụng dưới (Vertical Knee Raise)', defaultSets: 2, defaultReps: 15, suggestedWeightKg: 0 },
      { exerciseId: 'Recumbent_Bike', exerciseName: 'Cardio đạp xe nhẹ đốt mỡ (Recumbent Bike)', defaultSets: 1, defaultReps: 15, suggestedWeightKg: 0 }
    ]
  },
  {
    id: 'thol-tang3-day3',
    name: 'Gym Phổ Tầng 3: Day 3 - Lưng & Xô (Back & Lat)',
    targetFocus: 'Chèo lưng Smith Row, lưng dưới Good Morning, cầu vai Smith Shrugs, kéo xô',
    level: 'Intermediate',
    description: 'Giáo án Gym Phổ Tầng 3 (Duy Nguyễn THOL). Xây dựng lưng vĩ đại với chèo lưng đòn Smith, gập lưng Good Morning và cầu vai săn chắc.',
    exercises: [
      { exerciseId: 'Smith_Machine_Bent_Over_Row', exerciseName: 'Tập lưng với máy Smith (Smith Machine Bent Over Row)', defaultSets: 3, defaultReps: 10, suggestedWeightKg: 35 },
      { exerciseId: 'Good_Morning', exerciseName: 'Gập lưng dưới với tạ đòn (Good Morning)', defaultSets: 2, defaultReps: 10, suggestedWeightKg: 20 },
      { exerciseId: 'Smith_Machine_Behind_the_Back_Shrug', exerciseName: 'Tập cầu vai với máy Smith (Smith Machine Shrugs)', defaultSets: 3, defaultReps: 10, suggestedWeightKg: 40 },
      { exerciseId: 'Wide-Grip_Lat_Pulldown', exerciseName: 'Kéo xô máy đòn bẩy robot (Leverage Lat Pulldown)', defaultSets: 3, defaultReps: 10, suggestedWeightKg: 35 },
      { exerciseId: 'Recumbent_Bike', exerciseName: 'Cardio đạp xe nhẹ phục hồi (Upright Bike)', defaultSets: 1, defaultReps: 15, suggestedWeightKg: 0 }
    ]
  },
  {
    id: 'thol-tang3-day4',
    name: 'Gym Phổ Tầng 3: Day 4 - Vai, Tay & Bụng (Shoulder, Arm & Abs)',
    targetFocus: 'Đẩy vai Smith, duỗi tay sau cáp, cuốn tay trước EZ, con lăn bụng, xoay eo',
    level: 'Intermediate',
    description: 'Giáo án Gym Phổ Tầng 3 (Duy Nguyễn THOL). Đẩy vai tạ đòn Smith chuẩn form, tay săn cuồn cuộn và cơ lõi thép.',
    exercises: [
      { exerciseId: 'Smith_Machine_Overhead_Shoulder_Press', exerciseName: 'Đẩy vai với máy Smith (Smith Shoulder Press)', defaultSets: 3, defaultReps: 10, suggestedWeightKg: 25 },
      { exerciseId: 'Triceps_Pushdown', exerciseName: 'Tập tay sau với cáp (Triceps Pushdown)', defaultSets: 3, defaultReps: 10, suggestedWeightKg: 20 },
      { exerciseId: 'EZ-Bar_Curl', exerciseName: 'Cuốn tay trước đòn cong (EZ Barbell Curl)', defaultSets: 3, defaultReps: 10, suggestedWeightKg: 15 },
      { exerciseId: 'Ab_Roller', exerciseName: 'Đẩy bụng tình yêu con lăn (Ab Roller)', defaultSets: 3, defaultReps: 12, suggestedWeightKg: 0 },
      { exerciseId: 'Cable_Russian_Twists', exerciseName: 'Xoay eo bụng với tạ khối / cáp (Rotary Torso)', defaultSets: 3, defaultReps: 12, suggestedWeightKg: 20 },
      { exerciseId: 'Plank', exerciseName: 'Giảm mỡ bụng bền cơ lưng (Yoga Plank)', defaultSets: 2, defaultReps: 60, suggestedWeightKg: 0 },
      { exerciseId: 'Elliptical_Trainer', exerciseName: 'Cardio nhẹ máy trượt tuyết (Elliptical Trainer)', defaultSets: 1, defaultReps: 15, suggestedWeightKg: 0 }
    ]
  },
  {
    id: 'thol-tang3-day5',
    name: 'Gym Phổ Tầng 3: Day 5 - Chuyên Cardio Đốt Mỡ (Cardio Day)',
    targetFocus: 'Hệ tim mạch, tăng Testosterone, đốt sạch mỡ thừa, tăng sức chịu đựng',
    level: 'Intermediate',
    description: 'Giáo án Gym Phổ Tầng 3 (Duy Nguyễn THOL). Chạy bộ máy Treadmill tăng cường thể lực đỉnh cao và sức bền bỉ kiên cường.',
    exercises: [
      { exerciseId: 'Jogging_Treadmill', exerciseName: 'Chạy bộ máy chạy đốt mỡ tăng thể lực (Treadmill Run)', defaultSets: 1, defaultReps: 20, suggestedWeightKg: 0 },
      { exerciseId: 'Walking_Treadmill', exerciseName: 'Đi bộ nhanh dốc máy chạy tăng sức mạnh (Treadmill Walk)', defaultSets: 1, defaultReps: 20, suggestedWeightKg: 0 }
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
    const parsed: RoutineTemplate[] = JSON.parse(raw);
    const missingDefaults = DEFAULT_ROUTINES.filter(d => !parsed.some(p => p.id === d.id));
    if (missingDefaults.length > 0) {
      const merged = [...parsed, ...missingDefaults];
      localStorage.setItem(ROUTINES_KEY, JSON.stringify(merged));
      return merged;
    }
    return parsed;
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
