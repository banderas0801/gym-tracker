// Từ điển dịch thuật chuyên ngành Thể hình / Gym sang Tiếng Việt chuẩn

export const MUSCLE_TRANSLATIONS: Record<string, string> = {
  chest: 'Cơ ngực',
  lats: 'Lưng xô (Lats)',
  'middle back': 'Lưng giữa (Rhomboids)',
  'lower back': 'Lưng dưới',
  shoulders: 'Cơ vai',
  biceps: 'Bắp tay trước (Biceps)',
  triceps: 'Bắp tay sau (Triceps)',
  quadriceps: 'Cơ đùi trước (Quads)',
  hamstrings: 'Cơ đùi sau (Hamstrings)',
  glutes: 'Cơ mông (Glutes)',
  calves: 'Bắp chuối (Calves)',
  abdominals: 'Cơ bụng (Abs)',
  abs: 'Cơ bụng',
  traps: 'Cơ cầu vai (Traps)',
  forearms: 'Cẳng tay (Forearms)',
  neck: 'Cơ cổ',
  adductors: 'Cơ khép đùi trong',
  abductors: 'Cơ dang đùi ngoài',
};

export const EQUIPMENT_TRANSLATIONS: Record<string, string> = {
  barbell: 'Đòn tạ Olympic',
  dumbbell: 'Tạ đơn (Dumbbell)',
  cable: 'Dây cáp kéo (Cable)',
  machine: 'Máy tập chuyên dụng',
  'body only': 'Trọng lượng cơ thể (Bodyweight)',
  bodyweight: 'Trọng lượng cơ thể',
  kettlebells: 'Tạ bình vôi (Kettlebell)',
  bands: 'Dây kháng lực (Bands)',
  'foam roll': 'Con lăn foam',
  other: 'Dụng cụ khác',
  medicine_ball: 'Bóng tạ thể lực',
  exercise_ball: 'Bóng thăng bằng Swiss',
  e_z_curl_bar: 'Thanh đòn zic-zac (EZ Bar)',
};

export const CATEGORY_TRANSLATIONS: Record<string, string> = {
  strength: 'Tăng sức mạnh (Strength)',
  hypertrophy: 'Tăng cơ bắp (Hypertrophy)',
  powerlifting: 'Cử tạ sức mạnh (Powerlifting)',
  olympic_weightlifting: 'Cử tạ Olympic',
  strongman: 'Lực sĩ thể lực',
  cardio: 'Tim mạch (Cardio)',
  plyometrics: 'Bật nhảy bùng nổ',
  stretching: 'Giãn cơ (Stretching)',
};

export const LEVEL_TRANSLATIONS: Record<string, string> = {
  beginner: 'Người mới (Newbie)',
  intermediate: 'Trung cấp (6-18 tháng)',
  expert: 'Nâng cao / Chuyên nghiệp',
};

export function translateMuscle(muscle: string): string {
  if (!muscle) return '';
  const key = muscle.toLowerCase().trim();
  return MUSCLE_TRANSLATIONS[key] || muscle;
}

export function translateEquipment(eq?: string | null): string {
  if (!eq) return 'Tự do / Thể trọng';
  const key = eq.toLowerCase().trim();
  return EQUIPMENT_TRANSLATIONS[key] || eq;
}

export function translateCategory(cat?: string | null): string {
  if (!cat) return 'Thể hình';
  const key = cat.toLowerCase().trim();
  return CATEGORY_TRANSLATIONS[key] || cat;
}

export function translateLevel(lvl?: string | null): string {
  if (!lvl) return 'Tất cả cấp độ';
  const key = lvl.toLowerCase().trim();
  return LEVEL_TRANSLATIONS[key] || lvl;
}

// Từ điển ánh xạ cụm từ hướng dẫn gym tiếng Anh phổ biến sang tiếng Việt
const PHRASE_DICTIONARY: [RegExp, string][] = [
  // Tư thế bắt đầu
  [/Lie (back )?on a flat bench/gi, 'Nằm ngửa trên ghế phẳng'],
  [/Lie (back )?on an incline bench/gi, 'Nằm ngửa trên ghế dốc lên'],
  [/Lie (back )?on a decline bench/gi, 'Nằm ngửa trên ghế dốc xuống'],
  [/Stand up with your feet (about )?shoulder-width apart/gi, 'Đứng thẳng, 2 bàn chân mở rộng bằng vai'],
  [/Stand with your feet (about )?shoulder width apart/gi, 'Đứng thẳng, 2 bàn chân mở rộng bằng vai'],
  [/Sit on a flat bench/gi, 'Ngồi trên ghế phẳng'],
  [/Sit on (the|a) machine/gi, 'Ngồi vào máy tập'],
  [/Adjust the seat/gi, 'Điều chỉnh độ cao của đệm ghế'],
  [/Adjust the leg pads?/gi, 'Điều chỉnh đệm tì chân vừa khít'],
  
  // Cầm nắm & bả vai
  [/Using a medium (width )?grip/gi, 'Nắm tay với khoảng cách vừa phải (rộng hơn vai một chút)'],
  [/Using an overhand grip/gi, 'Cầm với lòng bàn tay hướng ra ngoài (úp tay)'],
  [/Using an underhand grip/gi, 'Cầm với lòng bàn tay hướng vào trong (ngửa tay)'],
  [/Retract your shoulder blades/gi, 'Khóa và ép chặt 2 xương bả vai ra sau'],
  [/Keep your back straight/gi, 'Giữ lưng thẳng tự nhiên'],
  [/Keep your core tight/gi, 'Siết chặt cơ bụng (Core)'],
  [/Brace your core/gi, 'Gồng chặt cơ lõi và bụng'],
  [/Keep your elbows close to your torso/gi, 'Giữ 2 cùi chỏ ép sát vào thân người'],
  [/Do not lock your (knees|elbows)/gi, 'Không khóa cứng khớp (khuỷu tay/đầu gối)'],
  
  // Động tác hạ / kéo / đẩy
  [/Lift the (bar|barbell|weight) (from|off) the rack/gi, 'Nhấc thanh đòn ra khỏi giá tạ'],
  [/Inhale and begin (coming|lowering|to lower) down slowly/gi, 'Hít sâu một hơi và bắt đầu hạ tạ xuống chậm rãi'],
  [/Lower the (bar|weight|dumbbells) (slowly )?to (your )?chest/gi, 'Hạ tạ từ từ có kiểm soát chạm nhẹ vào ngực'],
  [/Push the (bar|weight|dumbbells) (back )?up/gi, 'Dùng lực đẩy tạ thẳng lên trên'],
  [/Pull the (bar|weight|handles?) (down )?towards your (upper )?chest/gi, 'Kéo thanh đòn/tay cầm xuống sát ngực trên'],
  [/Pull your elbows (down and )?back/gi, 'Kéo hai cùi chỏ ép mạnh xuống và ra sau'],
  [/Squeeze your (chest|back|lats|biceps|triceps|glutes) at the (top|peak)/gi, 'Siết chặt cơ bắp mục tiêu ở điểm co cơ cao nhất'],
  [/Hold for a second/gi, 'Giữ lại trong 1 giây để cảm nhận cơ'],
  [/Pause for a brief moment/gi, 'Giữ lại một nhịp ngắn'],
  
  // Nhịp thở & kết thúc
  [/as you exhale/gi, 'đồng thời thở ra dứt khoát'],
  [/as you inhale/gi, 'đồng thời hít sâu'],
  [/Exhale as you push/gi, 'Thở ra dứt khoát khi dùng lực đẩy'],
  [/Exhale as you pull/gi, 'Thở ra dứt khoát khi dùng lực kéo'],
  [/Inhale as you lower/gi, 'Hít sâu khi hạ tạ xuống'],
  [/Repeat for the recommended (amount|number) of repetitions/gi, 'Lặp lại động tác cho đủ số lần yêu cầu của hiệp tập'],
  [/Return to the starting position/gi, 'Từ từ đưa tạ trở về tư thế bắt đầu']
];

export function translateInstructionStep(stepText: string): string {
  if (!stepText) return '';
  let translated = stepText.trim();

  // Áp dụng từ điển cụm từ
  for (const [regex, replacement] of PHRASE_DICTIONARY) {
    translated = translated.replace(regex, replacement);
  }

  // Một số từ lẻ phổ biến
  translated = translated
    .replace(/\bdumbbells?\b/gi, 'tạ đơn')
    .replace(/\bbarbell\b/gi, 'thanh đòn')
    .replace(/\brepetitions\b/gi, 'lần lặp (reps)')
    .replace(/\breps\b/gi, 'lần (reps)')
    .replace(/\bshoulder\b/gi, 'vai')
    .replace(/\belbows?\b/gi, 'cùi chỏ')
    .replace(/\bknees?\b/gi, 'đầu gối')
    .replace(/\bchest\b/gi, 'ngực')
    .replace(/\bhands?\b/gi, 'tay')
    .replace(/\bpalms?\b/gi, 'lòng bàn tay')
    .replace(/\btorso\b/gi, 'thân người')
    .replace(/\bslowly\b/gi, 'chậm rãi có kiểm soát');

  return translated;
}

export function translateInstructions(steps?: string[]): string[] {
  if (!steps || steps.length === 0) return [];
  return steps.map((s) => translateInstructionStep(s));
}
