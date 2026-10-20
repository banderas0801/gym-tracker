import { SubPaceDetail, TargetSub, WeekTrainingPlan, DayTrainingPlan, SupplementaryExercise } from '@/types/running';

// BÀI TẬP BỔ TRỢ CHUYÊN BIỆT CHO RUNNER (Strength & Conditioning for Half Marathon)
export const RUNNER_SUPPLEMENTARY_LOWER: SupplementaryExercise[] = [
  {
    id: 'supp-squat',
    name: 'Bodyweight Squat (Ngồi xổm đùi mông)',
    target: 'Cơ tứ đầu đùi (Quads), cơ mông lớn & gân kheo',
    setsReps: '3 hiệp × 15-20 lần',
    benefit: 'Bảo vệ khớp gối, tăng độ ổn định xương bánh chè và sức mạnh leo dốc',
    startImageUrl: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Bodyweight_Squat/0.jpg',
    endImageUrl: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Bodyweight_Squat/1.jpg',
    instructions: [
      'Đứng hai chân rộng bằng vai, mũi chân hơi chếch ra ngoài 15-30 độ.',
      'Hít sâu, đẩy hông về sau và hạ đùi xuống song song sàn nhà.',
      'Đầu gối hướng theo mũi chân, ngực giữ thẳng.',
      'Thở ra, nhấn gót chân đứng thẳng dậy, siết nhẹ mông ở đỉnh.'
    ]
  },
  {
    id: 'supp-lunges',
    name: 'Walking Lunges (Bước chùng chân)',
    target: 'Cơ đùi trước, cơ mông & thăng bằng đơn chân',
    setsReps: '3 hiệp × 12 bước mỗi chân',
    benefit: 'Tối ưu độ thăng bằng sải chân đơn lẻ (chạy bộ là chuỗi tiếp đất từng chân một)',
    startImageUrl: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Bodyweight_Walking_Lunge/0.jpg',
    endImageUrl: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Bodyweight_Walking_Lunge/1.jpg',
    instructions: [
      'Đứng thẳng, bước một chân dài về phía trước.',
      'Hạ hông xuống cho đến khi hai đầu gối gập thành góc vuông 90 độ.',
      'Gối trước không vượt quá mũi chân, gối sau gần chạm sàn.',
      'Đạp mạnh chân trước đứng dậy và bước tiếp chân kia lên.'
    ]
  },
  {
    id: 'supp-calf-raise',
    name: 'Calf Raises (Nhón gót bắp chuối đứng)',
    target: 'Cơ bắp chuối (Gastrocnemius & Soleus), gân gót Achilles',
    setsReps: '3 hiệp × 20-25 lần',
    benefit: 'Tăng độ đàn hồi gân Achilles, giảm sốc tiếp đất và chống viêm gân gót',
    startImageUrl: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Standing_Calf_Raises/0.jpg',
    endImageUrl: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Standing_Calf_Raises/1.jpg',
    instructions: [
      'Đứng trên bậc thềm hoặc sàn phẳng, hai tay vịn nhẹ tường để giữ thăng bằng.',
      'Nhấn mũi bàn chân, nhón gót chân lên cao nhất có thể.',
      'Giữ 1 giây ở điểm cao nhất để cảm nhận bắp chuối siết chặt.',
      'Hạ gót chân chậm rãi có kiểm soát xuống dưới mức thềm.'
    ]
  },
  {
    id: 'supp-tibialis',
    name: 'Tibialis Raises (Nhấc mũi chân tựa tường)',
    target: 'Cơ cẳng chân trước (Tibialis Anterior)',
    setsReps: '3 hiệp × 15-20 lần',
    benefit: 'BÀI TẬP VÀNG: Phòng ngừa & dứt điểm hội chứng đau ống đồng (Shin Splints)',
    startImageUrl: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Standing_Calf_Raises/1.jpg',
    endImageUrl: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Standing_Calf_Raises/0.jpg',
    instructions: [
      'Đứng tựa mông và lưng vào tường, hai chân đưa về phía trước cách tường 30-40cm.',
      'Giữ gót chân chạm sàn, nhấc toàn bộ mũi bàn chân và các ngón chân lên cao nhất.',
      'Cảm nhận cơ phía trước cẳng chân (ống đồng) siết căng.',
      'Hạ mũi chân xuống nhưng không chạm hẳn đất rồi nhấc tiếp ngay.'
    ]
  },
  {
    id: 'supp-glute-bridge',
    name: 'Glute Bridges (Nâng hông cây cầu)',
    target: 'Cơ mông lớn (Gluteus Maximus) & đùi sau',
    setsReps: '3 hiệp × 15 lần (giữ 2s)',
    benefit: 'Kích hoạt cơ mông phát lực đẩy sải chân về sau thay vì để đùi trước chịu tải quá mức',
    startImageUrl: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Glute_Bridge/0.jpg',
    endImageUrl: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Glute_Bridge/1.jpg',
    instructions: [
      'Nằm ngửa trên thảm, co hai đầu gối, bàn chân đặt phẳng trên sàn gần mông.',
      'Thở ra, nhấn gót chân và nâng hông lên cao cho đến khi đùi, hông và ngực tạo đường thẳng.',
      'Siết chặt cơ mông 2 giây ở vị trí cao nhất.',
      'Hít vào và hạ hông xuống từ từ.'
    ]
  },
  {
    id: 'supp-single-leg-rdl',
    name: 'Single-Leg RDL (Deadlift 1 chân)',
    target: 'Gân kheo (Hamstrings), cơ mông & thăng bằng cổ chân',
    setsReps: '3 hiệp × 10 lần mỗi bên chân',
    benefit: 'Chống chuột rút đùi sau ở nửa sau cự ly 21km và rèn cổ chân dẻo dai',
    startImageUrl: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Single_Leg_Deadlift/0.jpg',
    endImageUrl: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Single_Leg_Deadlift/1.jpg',
    instructions: [
      'Đứng trên một chân, chân còn lại hơi nhấc khỏi mặt đất.',
      'Hơi khuỵu gối chân trụ, cúi người về phía trước đồng thời đá chân sau thẳng ra sau.',
      'Giữ lưng thẳng song song với sàn, cảm nhận căng cơ đùi sau chân trụ.',
      'Dùng lực cơ mông và gân kheo kéo người đứng thẳng trở lại.'
    ]
  },
  {
    id: 'supp-clamshell',
    name: 'Clamshells (Vỏ sò mở khớp háng)',
    target: 'Cơ mông nhỡ (Gluteus Medius)',
    setsReps: '3 hiệp × 15 lần mỗi bên',
    benefit: 'Giữ xương đùi và gối thẳng trục, khắc phục triệt để lỗi sụm gối và đau dải chậu chày (IT Band)',
    startImageUrl: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Lying_Bent_Leg_Groin/0.jpg',
    endImageUrl: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Lying_Bent_Leg_Groin/1.jpg',
    instructions: [
      'Nằm nghiêng một bên, co hai đầu gối góc 90 độ, hai gót chân chụm sát nhau.',
      'Giữ hai bàn chân dính chặt, từ từ mở gối chân trên lên cao nhất có thể.',
      'Không để xương chậu bị lật ngửa ra sau.',
      'Giữ 1 giây rồi hạ gối xuống chậm.'
    ]
  }
];

export const RUNNER_SUPPLEMENTARY_UPPER_CORE: SupplementaryExercise[] = [
  {
    id: 'supp-plank',
    name: 'Forearm Plank (Đo sàn cẳng tay)',
    target: 'Cơ trọng tâm toàn diện (Transverse Abdominis, cơ liên sườn)',
    setsReps: '3 hiệp × 45-60 giây',
    benefit: 'Giữ trục xương sống thẳng đứng, chống hiện tượng đổ gập người về trước khi kiệt sức',
    startImageUrl: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Front_Plank/0.jpg',
    endImageUrl: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Front_Plank/1.jpg',
    instructions: [
      'Chống cẳng tay xuống sàn, khuỷu tay thẳng dưới vai, hai chân duỗi thẳng ra sau.',
      'Siết chặt bụng, mông và đùi tạo thành một đường thẳng tắp từ đầu đến gót.',
      'Không võng lưng, không nhổm mông lên cao.',
      'Duy trì nhịp thở đều qua cơ hoành, không nín thở.'
    ]
  },
  {
    id: 'supp-side-plank',
    name: 'Side Plank (Plank nghiêng sườn)',
    target: 'Cơ liên sườn (Obliques) & cơ vuông thắt lưng',
    setsReps: '3 hiệp × 30-40 giây mỗi bên',
    benefit: 'Triệt tiêu lực rung lắc vặn vẹo hông sang hai bên, tiết kiệm năng lượng sải bước',
    startImageUrl: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Side_Plank/0.jpg',
    endImageUrl: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Side_Plank/1.jpg',
    instructions: [
      'Nằm nghiêng, chống một bên cùi chỏ xuống sàn vuông góc với vai.',
      'Nâng toàn bộ hông và chân lên khỏi mặt sàn thành đường thẳng nghiêng.',
      'Tay còn lại chống hông hoặc giơ thẳng lên trần.',
      'Giữ chặt tư thế và đổi bên.'
    ]
  },
  {
    id: 'supp-pushups',
    name: 'Push-ups (Hít đất)',
    target: 'Ngực, vai trước & cơ tam đầu tay sau (Triceps)',
    setsReps: '3 hiệp × 12-15 lần',
    benefit: 'Khỏe khớp vai và lưng trên giúp duy trì nhịp đánh tay 180 nhịp/phút bền bỉ',
    startImageUrl: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Pushups/0.jpg',
    endImageUrl: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Pushups/1.jpg',
    instructions: [
      'Chống hai tay xuống sàn rộng hơn vai một chút, ngón tay hướng về phía trước.',
      'Hạ ngực xuống gần chạm sàn, khuỷu tay mở góc 45 độ so với thân.',
      'Đẩy người lên vị trí ban đầu và thở ra dứt khoát.'
    ]
  },
  {
    id: 'supp-row',
    name: 'Resistance Band / Dumbbell Row (Chèo lưng xô)',
    target: 'Cơ lưng xô (Lats) & cơ hình thoi giữa hai bả vai',
    setsReps: '3 hiệp × 12-15 lần',
    benefit: 'Mở rộng lồng ngực đón lượng oxy tối đa, chống gù vai cúi đầu khi mệt',
    startImageUrl: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Bent_Over_Two-Arm_Long_Bar_Row/0.jpg',
    endImageUrl: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Bent_Over_Two-Arm_Long_Bar_Row/1.jpg',
    instructions: [
      'Dẫm dây kháng lực hoặc cầm tạ đơn, cúi người hông gập 45 độ, lưng thẳng.',
      'Kéo cùi chỏ về phía sau sát sườn, ép chặt hai bả vai vào nhau ở đỉnh.',
      'Hạ tạ xuống từ từ có kiểm soát.'
    ]
  },
  {
    id: 'supp-bird-dog',
    name: 'Bird-Dog (Chim - Chó chéo tay chân)',
    target: 'Cơ dựng sống thắt lưng & phối hợp chéo cơ thể',
    setsReps: '3 hiệp × 12 lần mỗi bên',
    benefit: 'Rèn luyện khả năng thăng bằng và liên kết vận động chéo tay nghịch chân tự nhiên của dáng chạy',
    startImageUrl: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Birddog/0.jpg',
    endImageUrl: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Birddog/1.jpg',
    instructions: [
      'Quỳ chống hai tay và hai đầu gối vuông góc với sàn.',
      'Đồng thời vươn tay phải thẳng về trước và đá chân trái thẳng ra sau.',
      'Giữ lưng thẳng song song sàn trong 2 giây rồi thu về đổi bên.'
    ]
  },
  {
    id: 'supp-dead-bug',
    name: 'Dead Bug (Bọ chết siết bụng)',
    target: 'Cơ bụng sâu & phối hợp nhịp thở cơ hoành',
    setsReps: '3 hiệp × 12 lần mỗi bên',
    benefit: 'Bảo vệ thắt lưng và rèn kỹ năng thở sâu bằng bụng khi cơ bụng đang gồng',
    startImageUrl: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dead_Bug/0.jpg',
    endImageUrl: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dead_Bug/1.jpg',
    instructions: [
      'Nằm ngửa, giơ hai tay thẳng lên trần, hai chân co gối 90 độ lơ lửng.',
      'Dán chặt phần lưng dưới chạm sát sàn.',
      'Từ từ hạ tay phải qua đầu và duỗi chân trái thẳng ra gần sát sàn.',
      'Kéo về vị trí ban đầu rồi đổi bên đối diện.'
    ]
  }
];

export const RUNNER_SUPPLEMENTARY_MOBILITY: SupplementaryExercise[] = [
  {
    id: 'supp-hip-flexor',
    name: 'Hip Flexor Kneeling Stretch (Ép giãn cơ gập hông)',
    target: 'Cơ thắt lưng chậu (Iliopsoas & Rectus Femoris)',
    setsReps: '3 hiệp × 30 giây mỗi chân',
    benefit: 'Giải phóng khớp háng, mở rộng biên độ sải chân dài hơn mà không cần tốn thêm sức',
    startImageUrl: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/90_90_Hamstring/0.jpg',
    endImageUrl: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/90_90_Hamstring/1.jpg',
    instructions: [
      'Quỳ một chân trên thảm, chân kia bước lên phía trước tạo góc 90 độ.',
      'Đẩy nhẹ hông về phía trước, giữ lưng thẳng cho đến khi thấy căng phía trước hông chân sau.',
      'Giữ yên 30 giây hít thở sâu rồi đổi chân.'
    ]
  },
  {
    id: 'supp-pigeon-pose',
    name: 'Pigeon Pose (Tư thế chim bồ câu giãn mông)',
    target: 'Cơ hình lê (Piriformis) & cơ mông sâu',
    setsReps: '3 hiệp × 30 giây mỗi bên',
    benefit: 'Phòng ngừa chèn ép dây thần kinh tọa và giải tỏa căng cứng khớp háng sau chạy',
    startImageUrl: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Lying_Bent_Leg_Groin/0.jpg',
    endImageUrl: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Lying_Bent_Leg_Groin/1.jpg',
    instructions: [
      'Bắt đầu ở tư thế chống tay, đưa gối phải về trước đặt sau cổ tay phải, cẳng chân hướng chéo.',
      'Duỗi thẳng chân trái ra sau, úp đùi trái xuống sàn.',
      'Từ từ hạ thân người về phía trước, cảm nhận căng sâu cơ mông phải.'
    ]
  },
  {
    id: 'supp-ankle-dorsiflexion',
    name: 'Ankle Mobility Against Wall (Gập cổ chân trên tường)',
    target: 'Khớp cổ chân & gân gót Achilles',
    setsReps: '3 hiệp × 15 lần gập mỗi chân',
    benefit: 'Tăng biên độ gập cổ chân giúp tiếp đất mượt mà bằng gan bàn chân (Midfoot strike)',
    startImageUrl: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Standing_Calf_Raises/0.jpg',
    endImageUrl: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Standing_Calf_Raises/1.jpg',
    instructions: [
      'Đứng đối diện tường, cách tường khoảng 1 bàn chân.',
      'Đặt một chân lên trước, từ từ gập gối về phía trước chạm vào tường trong khi giữ gót chân dính chặt sàn.',
      'Cảm nhận độ căng gập sâu của cổ chân.'
    ]
  }
];

// Hàm lấy danh sách bài bổ trợ theo cấu hình của ngày tập
export function getSupplementaryExercises(day: DayTrainingPlan): SupplementaryExercise[] {
  if (day.supplementaryExercises && day.supplementaryExercises.length > 0) {
    return day.supplementaryExercises;
  }
  if (day.strengthFocus === 'lower') {
    return RUNNER_SUPPLEMENTARY_LOWER;
  }
  if (day.strengthFocus === 'upper') {
    return RUNNER_SUPPLEMENTARY_UPPER_CORE;
  }
  if (day.strengthFocus === 'mobility' || day.crossTraining) {
    return RUNNER_SUPPLEMENTARY_MOBILITY;
  }
  return [];
}

// 1. BẢNG SUB HM THEO MỤC TIÊU CÁ NHÂN (Chuẩn Jack Daniels & Giang Mê Chạy)
export const SUB_PACE_TABLE: Record<TargetSub, SubPaceDetail> = {
  sub130: {
    subId: 'sub130',
    label: 'Sub 1:30 (HM < 1h30m)',
    targetTime: '1:29:59',
    racePace: '4:14',
    easy: '4:45 - 4:59',
    longRun: '4:30 - 4:45',
    marathon: '4:10 - 4:16',
    tempo: '3:52 - 3:59',
    interval: '3:35 - 3:40',
    repetition: '3:25',
    vdotEquivalent: 51.5
  },
  sub145: {
    subId: 'sub145',
    label: 'Sub 1:45 (HM < 1h45m)',
    targetTime: '1:44:59',
    racePace: '4:58',
    easy: '5:20 - 5:50',
    longRun: '5:14 - 5:46',
    marathon: '4:55 - 5:05',
    tempo: '4:35 - 4:42',
    interval: '4:12 - 4:18',
    repetition: '4:03',
    vdotEquivalent: 43.5
  },
  sub200: {
    subId: 'sub200',
    label: 'Sub 2:00 (HM < 2h00m)',
    targetTime: '1:59:59',
    racePace: '5:41',
    easy: '6:32 - 7:06',
    longRun: '6:15 - 6:49',
    marathon: '5:35 - 5:45',
    tempo: '5:13 - 5:20',
    interval: '4:45 - 4:52',
    repetition: '4:32',
    vdotEquivalent: 37.5
  },
  sub215: {
    subId: 'sub215',
    label: 'Sub 2:15 (HM < 2h15m)',
    targetTime: '2:14:59',
    racePace: '6:23',
    easy: '7:16 - 7:50',
    longRun: '6:50 - 7:25',
    marathon: '6:15 - 6:25',
    tempo: '5:50 - 5:57',
    interval: '5:10 - 5:15',
    repetition: '4:54',
    vdotEquivalent: 32.5
  },
  sub230: {
    subId: 'sub230',
    label: 'Sub 2:30 (HM < 2h30m)',
    targetTime: '2:29:59',
    racePace: '7:06',
    easy: '8:05 - 8:40',
    longRun: '7:32 - 7:53',
    marathon: '7:00 - 7:10',
    tempo: '6:25 - 6:32',
    interval: '5:32 - 5:40',
    repetition: '5:21',
    vdotEquivalent: 28.5
  },
  sub245: {
    subId: 'sub245',
    label: 'Sub 2:45 (HM < 2h45m)',
    targetTime: '2:44:59',
    racePace: '7:49',
    easy: '8:54 - 9:35',
    longRun: '8:22 - 8:56',
    marathon: '7:45 - 7:55',
    tempo: '6:50 - 6:57',
    interval: '6:00 - 6:05',
    repetition: '5:45',
    vdotEquivalent: 25.5
  },
  sub300: {
    subId: 'sub300',
    label: 'Sub 3:00 (HM < 3h00m)',
    targetTime: '2:59:59',
    racePace: '8:31',
    easy: '9:42 - 10:15',
    longRun: '9:15 - 9:55',
    marathon: '8:25 - 8:35',
    tempo: '7:25 - 7:35',
    interval: '6:30 - 6:35',
    repetition: '6:05',
    vdotEquivalent: 23.0
  }
};

// 2. GIÁO ÁN TẬP LUYỆN HM (Tuần 1 - 8: Nền tảng & VO2max - Cùng Giang Mê Chạy)
export const HM_TRAINING_PLAN: WeekTrainingPlan[] = [
  {
    weekNumber: 1,
    phase: 'Giai Đoạn 1: Nền Tảng & Sức Mạnh Cơ Bắp',
    title: 'Tuần 1: Khởi Động Thể Lực & Làm Quen Nhịp Thở',
    focus: 'Xây dựng nhịp sinh học hiếu khí, làm quen sải bước và bài tập bổ trợ gym',
    quote: 'Chạy bộ là cuộc đua duy nhất mà bạn không cần phải về đích đầu tiên để trở thành người chiến thắng.',
    totalKmA: 24,
    days: [
      {
        dayOfWeek: 2,
        dayName: 'Thứ 2',
        groupA: { title: 'Nghỉ ngơi hoặc Phục hồi chủ động', distanceKm: 0, description: 'Nghỉ hoàn toàn, bơi lội hoặc đạp xe nhẹ 30 phút để thả lỏng khớp.', type: 'cross' },
        groupB: { title: 'Nghỉ ngơi hoặc Phục hồi chủ động', durationMinutes: 30, description: 'Nghỉ hoàn toàn, bơi lội hoặc đạp xe nhẹ 30 phút để thả lỏng khớp.', type: 'cross' },
        crossTraining: 'Đạp xe nhẹ 30p / Bơi lội',
        notes: 'Uống đủ nước, nạp carb sạch.'
      },
      {
        dayOfWeek: 3,
        dayName: 'Thứ 3',
        groupA: { title: '4k Easy + Bổ trợ 30p Thân trên', distanceKm: 4, description: 'Chạy 4km tốc độ Easy (E) nhẹ nhàng, trò chuyện thoải mái. Sau đó tập bổ trợ 30 phút thân trên (hít đất, kéo xô, tay sau).', type: 'easy' },
        groupB: { title: '30p Easy + Bổ trợ 30p Thân trên', durationMinutes: 30, description: 'Chạy 30 phút tốc độ Easy (E). Nếu mệt có thể đi bộ nhanh xen kẽ. Sau đó tập bổ trợ 30 phút thân trên.', type: 'easy' },
        strengthFocus: 'upper',
        notes: 'Bổ trợ thân trên giúp giữ dáng chạy thẳng và đánh tay vững vàng.'
      },
      {
        dayOfWeek: 4,
        dayName: 'Thứ 4',
        groupA: { title: '5k Easy + Sải bước Strides', distanceKm: 5, description: '5km Easy + (20s sải bước bứt tốc + 1 phút Easy) x 6 hiệp.', type: 'interval' },
        groupB: { title: '30p Easy + Sải bước Strides', durationMinutes: 30, description: '30 phút Easy + (20s sải bước bứt tốc + 1 phút Easy) x 5 hiệp.', type: 'interval' },
        notes: 'Sải bước (Strides) rèn guồng chân nhanh (Cadence > 175 spm).'
      },
      {
        dayOfWeek: 5,
        dayName: 'Thứ 5',
        groupA: { title: '4k Easy + Bổ trợ 30p Thân dưới', distanceKm: 4, description: 'Chạy 4km tốc độ Easy. Sau đó tập 30 phút bổ trợ chân mông đùi (Squat, Lunge, nhón bắp chân Calf raise).', type: 'easy' },
        groupB: { title: '30p Easy + Bổ trợ 30p Thân dưới', durationMinutes: 30, description: 'Chạy 30 phút tốc độ Easy. Sau đó tập 30 phút bổ trợ chân mông đùi.', type: 'easy' },
        strengthFocus: 'lower',
        notes: 'Tập khỏe cơ đùi và bắp chuối giúp giảm 50% nguy cơ chấn thương gối.'
      },
      {
        dayOfWeek: 6,
        dayName: 'Thứ 6',
        groupA: { title: 'Nghỉ Hoàn Toàn', distanceKm: 0, description: 'Nghỉ ngơi 100%, ngủ sớm để cơ bắp tái tạo.', type: 'rest' },
        groupB: { title: 'Nghỉ Hoàn Toàn', durationMinutes: 0, description: 'Nghỉ ngơi 100%, ngủ sớm để cơ bắp tái tạo.', type: 'rest' },
        notes: 'Ngày phục hồi thần kinh cơ.'
      },
      {
        dayOfWeek: 7,
        dayName: 'Thứ 7',
        groupA: { title: '4k Easy + Sải bước Strides', distanceKm: 4, description: '4km Easy + (20s sải bước + 1 phút Easy) x 6 hiệp.', type: 'interval' },
        groupB: { title: '30p Easy + Sải bước Strides', durationMinutes: 30, description: '30 phút Easy + (20s sải bước + 1 phút Easy) x 5 hiệp.', type: 'interval' },
        notes: 'Chạy nhẹ nhàng hít thở sâu chuẩn bị cho buổi chạy dài ngày mai.'
      },
      {
        dayOfWeek: 8,
        dayName: 'Chủ Nhật',
        groupA: { title: 'Long Run 7km (6k L + 1k E)', distanceKm: 7, description: '6km tốc độ Long Run (L) + 1km Easy hạ nhiệt. Uống từng ngụm nước nhỏ.', type: 'long_run' },
        groupB: { title: 'Long Run 70 phút Easy', durationMinutes: 70, description: 'Chạy bền 70 phút tốc độ Easy. Duy trì nhịp thở 3:3 hoặc 2:2 đều đặn.', type: 'long_run' },
        notes: 'Long run đầu tuần giúp cơ thể bắt đầu làm quen với việc đốt mỡ tích lũy.'
      }
    ]
  },
  {
    weekNumber: 2,
    phase: 'Giai Đoạn 1: Nền Tảng & Sức Mạnh Cơ Bắp',
    title: 'Tuần 2: Nâng Cao Độ Thích Nghi Gân Khớp',
    focus: 'Củng cố nền móng thể lực, duy trì đều đặn các buổi bổ trợ',
    quote: 'Không quan trọng bạn chạy chậm thế nào, bạn vẫn đang vượt xa người đang ngồi trên ghế sofa.',
    totalKmA: 25,
    days: [
      {
        dayOfWeek: 2,
        dayName: 'Thứ 2',
        groupA: { title: 'Nghỉ / Bơi / Đạp xe nhẹ 30p', distanceKm: 0, description: 'Phục hồi tích cực, giãn cơ nhẹ nhàng.', type: 'cross' },
        groupB: { title: 'Nghỉ / Bơi / Đạp xe nhẹ 30p', durationMinutes: 30, description: 'Phục hồi tích cực, giãn cơ nhẹ nhàng.', type: 'cross' }
      },
      {
        dayOfWeek: 3,
        dayName: 'Thứ 3',
        groupA: { title: '4k Easy + Bổ trợ 20p Thân trên', distanceKm: 4, description: '4km Easy + 20 phút hít đất, plank, kéo xà/cáp bổ trợ.', type: 'easy' },
        groupB: { title: '30p Easy + Bổ trợ 30p Thân trên', durationMinutes: 30, description: '30 phút Easy + 30 phút bổ trợ thân trên.', type: 'easy' },
        strengthFocus: 'upper'
      },
      {
        dayOfWeek: 4,
        dayName: 'Thứ 4',
        groupA: { title: '5k Easy + (20s sải bước + 1p E) x 6', distanceKm: 5, description: '5km Easy + 6 lần sải bước tốc độ cao.', type: 'interval' },
        groupB: { title: '30p Easy + (20s sải bước + 1p E) x 6', durationMinutes: 30, description: '30 phút Easy + 6 lần sải bước tốc độ cao.', type: 'interval' }
      },
      {
        dayOfWeek: 5,
        dayName: 'Thứ 5',
        groupA: { title: '4k Easy + Bổ trợ 30p Thân dưới', distanceKm: 4, description: '4km Easy + 30 phút Squat, Lunge, Glute bridge.', type: 'easy' },
        groupB: { title: '30p Easy + Bổ trợ 30p Thân dưới', durationMinutes: 30, description: '30 phút Easy + 30 phút bổ trợ chân mông đùi.', type: 'easy' },
        strengthFocus: 'lower'
      },
      {
        dayOfWeek: 6,
        dayName: 'Thứ 6',
        groupA: { title: 'Nghỉ Hoàn Toàn', distanceKm: 0, description: 'Nghỉ ngơi, ngủ đủ 7-8 tiếng.', type: 'rest' },
        groupB: { title: 'Nghỉ Hoàn Toàn', durationMinutes: 0, description: 'Nghỉ ngơi, ngủ đủ 7-8 tiếng.', type: 'rest' }
      },
      {
        dayOfWeek: 7,
        dayName: 'Thứ 7',
        groupA: { title: '4k Easy + (20s sải bước + 1p E) x 6', distanceKm: 4, description: '4km Easy + 6 hiệp sải bước.', type: 'interval' },
        groupB: { title: '30p Easy + (20s sải bước + 1p E) x 6', durationMinutes: 30, description: '30 phút Easy + 6 hiệp sải bước.', type: 'interval' }
      },
      {
        dayOfWeek: 8,
        dayName: 'Chủ Nhật',
        groupA: { title: 'Long Run 7km (6k L + 1k E)', distanceKm: 7, description: '6km Long Run + 1km Easy hạ nhiệt.', type: 'long_run' },
        groupB: { title: 'Long Run 70 phút Easy', durationMinutes: 70, description: '70 phút chạy Easy liên tục, kiểm soát nhịp tim Zone 2.', type: 'long_run' }
      }
    ]
  },
  {
    weekNumber: 3,
    phase: 'Giai Đoạn 1: Nền Tảng & Sức Mạnh Cơ Bắp',
    title: 'Tuần 3: Giới Thiệu Tốc Độ Marathon Pace (M)',
    focus: 'Bắt đầu đưa đoạn ngắn tốc độ thi đấu M vào bài Long Run cuối tuần',
    quote: 'Chạy bộ không chỉ là vận động chân, mà là khởi động ý chí.',
    totalKmA: 26,
    days: [
      {
        dayOfWeek: 2,
        dayName: 'Thứ 2',
        groupA: { title: 'Nghỉ / Bơi / Đạp xe nhẹ 30p', distanceKm: 0, description: 'Phục hồi, kéo giãn nhẹ các khớp.', type: 'cross' },
        groupB: { title: 'Nghỉ / Bơi / Đạp xe nhẹ 30p', durationMinutes: 30, description: 'Phục hồi, kéo giãn nhẹ các khớp.', type: 'cross' }
      },
      {
        dayOfWeek: 3,
        dayName: 'Thứ 3',
        groupA: { title: '4k Easy + Bổ trợ 30p Thân trên', distanceKm: 4, description: '4km Easy + 30 phút bổ trợ thân trên.', type: 'easy' },
        groupB: { title: '30p Easy + Bổ trợ 30p Thân trên', durationMinutes: 30, description: '30 phút Easy + 30 phút bổ trợ thân trên.', type: 'easy' },
        strengthFocus: 'upper'
      },
      {
        dayOfWeek: 4,
        dayName: 'Thứ 4',
        groupA: { title: '6k Easy + (20s sải bước + 1p E) x 6', distanceKm: 6, description: '6km Easy + 6 hiệp sải bước.', type: 'interval' },
        groupB: { title: '45p Easy + (20s sải bước + 1p E) x 6', durationMinutes: 45, description: '45 phút Easy + 6 hiệp sải bước.', type: 'interval' }
      },
      {
        dayOfWeek: 5,
        dayName: 'Thứ 5',
        groupA: { title: '4k Easy + Bổ trợ 30p Thân dưới', distanceKm: 4, description: '4km Easy + 30 phút bổ trợ chân.', type: 'easy' },
        groupB: { title: '30p Easy + Bổ trợ 30p Thân dưới', durationMinutes: 30, description: '30 phút Easy + 30 phút bổ trợ chân.', type: 'easy' },
        strengthFocus: 'lower'
      },
      {
        dayOfWeek: 6,
        dayName: 'Thứ 6',
        groupA: { title: 'Nghỉ Hoàn Toàn', distanceKm: 0, description: 'Nghỉ ngơi 100%.', type: 'rest' },
        groupB: { title: 'Nghỉ Hoàn Toàn', durationMinutes: 0, description: 'Nghỉ ngơi 100%.', type: 'rest' }
      },
      {
        dayOfWeek: 7,
        dayName: 'Thứ 7',
        groupA: { title: '4k Easy + (20s sải bước + 1p E) x 6', distanceKm: 4, description: '4km Easy + 6 hiệp sải bước.', type: 'interval' },
        groupB: { title: '30p Easy + (20s sải bước + 1p E) x 6', durationMinutes: 30, description: '30 phút Easy + 6 hiệp sải bước.', type: 'interval' }
      },
      {
        dayOfWeek: 8,
        dayName: 'Chủ Nhật',
        groupA: { title: 'Long Run 8km (6k L + 1k M + 1k E)', distanceKm: 8, description: '6km Long Run (L) + 1km tăng tốc độ Marathon (M) + 1km Easy hạ nhiệt.', type: 'long_run' },
        groupB: { title: 'Long Run 70p Easy + Sải bước x 8', durationMinutes: 70, description: '70p Easy + (20s sải bước + 1p Easy) x 8 hiệp.', type: 'long_run' },
        notes: '1km Marathon Pace giúp cơ thể làm quen với cảm giác tăng tốc khi chân đã mỏi.'
      }
    ]
  },
  {
    weekNumber: 4,
    phase: 'Giai Đoạn 1: Nền Tảng & Sức Mạnh Cơ Bắp',
    title: 'Tuần 4: Tăng Tốc Độ Thi Đấu M Lên 2KM',
    focus: 'Kéo dài thời gian chịu đựng tốc độ Marathon, hoàn thiện dáng chạy thẳng',
    quote: 'Mỗi bước chạy là một bước tiến đến phiên bản tốt hơn của chính mình.',
    totalKmA: 28,
    days: [
      {
        dayOfWeek: 2,
        dayName: 'Thứ 2',
        groupA: { title: 'Nghỉ / Bơi / Đạp xe nhẹ 30p', distanceKm: 0, description: 'Nghỉ ngơi hoặc đạp xe nhẹ 30 phút.', type: 'cross' },
        groupB: { title: 'Nghỉ / Bơi / Đạp xe nhẹ 30p', durationMinutes: 30, description: 'Nghỉ ngơi hoặc đạp xe nhẹ 30 phút.', type: 'cross' }
      },
      {
        dayOfWeek: 3,
        dayName: 'Thứ 3',
        groupA: { title: '5k Easy + Bổ trợ 30p Thân trên', distanceKm: 5, description: '5km Easy + 30 phút bổ trợ thân trên.', type: 'easy' },
        groupB: { title: '40p Easy + Bổ trợ 30p Thân trên', durationMinutes: 40, description: '40 phút Easy + 30 phút bổ trợ thân trên.', type: 'easy' },
        strengthFocus: 'upper'
      },
      {
        dayOfWeek: 4,
        dayName: 'Thứ 4',
        groupA: { title: '6k Easy + (20s sải bước + 1p E) x 6', distanceKm: 6, description: '6km Easy + 6 hiệp sải bước.', type: 'interval' },
        groupB: { title: '45p Easy + (20s sải bước + 1p E) x 6', durationMinutes: 45, description: '45 phút Easy + 6 hiệp sải bước.', type: 'interval' }
      },
      {
        dayOfWeek: 5,
        dayName: 'Thứ 5',
        groupA: { title: '5k Easy + Bổ trợ 30p Thân dưới', distanceKm: 5, description: '5km Easy + 30 phút bổ trợ thân dưới.', type: 'easy' },
        groupB: { title: '40p Easy + Bổ trợ 30p Thân dưới', durationMinutes: 40, description: '40 phút Easy + 30 phút bổ trợ thân dưới.', type: 'easy' },
        strengthFocus: 'lower'
      },
      {
        dayOfWeek: 6,
        dayName: 'Thứ 6',
        groupA: { title: 'Nghỉ Hoàn Toàn', distanceKm: 0, description: 'Nghỉ ngơi 100%.', type: 'rest' },
        groupB: { title: 'Nghỉ Hoàn Toàn', durationMinutes: 0, description: 'Nghỉ ngơi 100%.', type: 'rest' }
      },
      {
        dayOfWeek: 7,
        dayName: 'Thứ 7',
        groupA: { title: '5k Easy + (20s sải bước + 1p E) x 6', distanceKm: 5, description: '5km Easy + 6 hiệp sải bước.', type: 'interval' },
        groupB: { title: '40p Easy + (20s sải bước + 1p E) x 6', durationMinutes: 40, description: '40 phút Easy + 6 hiệp sải bước.', type: 'interval' }
      },
      {
        dayOfWeek: 8,
        dayName: 'Chủ Nhật',
        groupA: { title: 'Long Run 8km (5k L + 2k M + 1k E)', distanceKm: 8, description: '5km Long Run + 2km Marathon Pace (M) + 1km Easy hạ nhiệt.', type: 'long_run' },
        groupB: { title: 'Long Run 80p Easy + Sải bước x 8', durationMinutes: 80, description: '80p Easy + (20s sải bước + 1p Easy) x 8 hiệp.', type: 'long_run' }
      }
    ]
  },
  {
    weekNumber: 5,
    phase: 'Giai Đoạn 1: Nền Tảng & Sức Mạnh Cơ Bắp',
    title: 'Tuần 5: Bứt Phá Sải Bước & Marathon Pace 3KM',
    focus: 'Tăng số lượng sải bước lên 8 hiệp và đẩy cự ly M lên 3km ngày Chủ Nhật',
    quote: 'Bạn không cần nhanh hơn người khác, chỉ cần nhanh hơn chính bạn của ngày hôm qua.',
    totalKmA: 30,
    days: [
      {
        dayOfWeek: 2,
        dayName: 'Thứ 2',
        groupA: { title: 'Nghỉ / Bơi / Đạp xe nhẹ 30p', distanceKm: 0, description: 'Thả lỏng cơ, phục hồi năng lượng.', type: 'cross' },
        groupB: { title: 'Nghỉ / Bơi / Đạp xe nhẹ 30p', durationMinutes: 30, description: 'Thả lỏng cơ, phục hồi năng lượng.', type: 'cross' }
      },
      {
        dayOfWeek: 3,
        dayName: 'Thứ 3',
        groupA: { title: '5k Easy + Bổ trợ 30p Thân trên', distanceKm: 5, description: '5km Easy + 30 phút bổ trợ thân trên.', type: 'easy' },
        groupB: { title: '40p Easy + Bổ trợ 30p Thân trên', durationMinutes: 40, description: '40 phút Easy + 30 phút bổ trợ thân trên.', type: 'easy' },
        strengthFocus: 'upper'
      },
      {
        dayOfWeek: 4,
        dayName: 'Thứ 4',
        groupA: { title: '7k Easy + (20s sải bước + 1p E) x 8', distanceKm: 7, description: '7km Easy + 8 hiệp sải bước bùng nổ.', type: 'interval' },
        groupB: { title: '50p Easy + (20s sải bước + 1p E) x 8', durationMinutes: 50, description: '50 phút Easy + 8 hiệp sải bước bùng nổ.', type: 'interval' }
      },
      {
        dayOfWeek: 5,
        dayName: 'Thứ 5',
        groupA: { title: '5k Easy + Bổ trợ 30p Thân dưới', distanceKm: 5, description: '5km Easy + 30 phút bổ trợ thân dưới.', type: 'easy' },
        groupB: { title: '40p Easy + Bổ trợ 30p Thân dưới', durationMinutes: 40, description: '40 phút Easy + 30 phút bổ trợ thân dưới.', type: 'easy' },
        strengthFocus: 'lower'
      },
      {
        dayOfWeek: 6,
        dayName: 'Thứ 6',
        groupA: { title: 'Nghỉ Hoàn Toàn', distanceKm: 0, description: 'Nghỉ ngơi 100%.', type: 'rest' },
        groupB: { title: 'Nghỉ Hoàn Toàn', durationMinutes: 0, description: 'Nghỉ ngơi 100%.', type: 'rest' }
      },
      {
        dayOfWeek: 7,
        dayName: 'Thứ 7',
        groupA: { title: '5k Easy + (20s sải bước + 1p E) x 6', distanceKm: 5, description: '5km Easy + 6 hiệp sải bước.', type: 'interval' },
        groupB: { title: '40p Easy + (20s sải bước + 1p E) x 6', durationMinutes: 40, description: '40 phút Easy + 6 hiệp sải bước.', type: 'interval' }
      },
      {
        dayOfWeek: 8,
        dayName: 'Chủ Nhật',
        groupA: { title: 'Long Run 9km (5k L + 3k M + 1k E)', distanceKm: 9, description: '5km Long Run + 3km Marathon Pace (M) + 1km Easy hạ nhiệt.', type: 'long_run' },
        groupB: { title: 'Long Run 80p Easy + Sải bước x 8', durationMinutes: 80, description: '80p Easy + (20s sải bước + 1p Easy) x 8 hiệp.', type: 'long_run' }
      }
    ]
  },
  {
    weekNumber: 6,
    phase: 'Giai Đoạn 2: Tim Mạch, Hô Hấp, Tốc Độ & VO2max',
    title: 'Tuần 6: Khởi Đầu Bài Tập Biến Tốc VO2max (Interval)',
    focus: 'Kích hoạt công suất hấp thụ oxy tối đa với Interval 1 phút tốc độ I',
    quote: 'Thành công không đến từ tốc độ, mà đến từ sự kiên định.',
    totalKmA: 33,
    days: [
      {
        dayOfWeek: 2,
        dayName: 'Thứ 2',
        groupA: { title: 'Nghỉ / Bơi / Đạp xe / Chạy nhẹ 30p', distanceKm: 0, description: 'Khởi động tuần mới nhẹ nhàng.', type: 'cross' },
        groupB: { title: 'Nghỉ / Bơi / Đạp xe / Chạy nhẹ 30p', durationMinutes: 30, description: 'Khởi động tuần mới nhẹ nhàng.', type: 'cross' }
      },
      {
        dayOfWeek: 3,
        dayName: 'Thứ 3',
        groupA: { title: '5k Easy + 30p Linh hoạt khớp & Hồi phục cơ', distanceKm: 5, description: '5km Easy + 30 phút tập giãn cơ động và bài tập dẻo dai khớp hông, gối, cổ chân.', type: 'easy' },
        groupB: { title: '40p Easy + 30p Linh hoạt khớp', durationMinutes: 40, description: '40 phút Easy + 30 phút tập dẻo dai khớp.', type: 'easy' },
        strengthFocus: 'mobility'
      },
      {
        dayOfWeek: 4,
        dayName: 'Thứ 4',
        groupA: { title: '8km Biến Tốc: 5k E + (1p I + 1p đi bộ) x 8 + 1k E', distanceKm: 8, description: '5km khởi động Easy + 8 hiệp biến tốc VO2max (1 phút chạy hết tốc độ Interval I + 1 phút đi bộ chậm) + 1km Easy hạ nhiệt.', type: 'interval' },
        groupB: { title: 'Biến tốc VO2max (1p I + 1p đi bộ) x 8', durationMinutes: 50, description: 'Khởi động + 8 hiệp (1 phút chạy nhanh Interval + 1 phút đi bộ) + hạ nhiệt.', type: 'interval' },
        notes: 'Bài tập Interval đẩy nhịp tim lên Zone 4-5 giúp nở phổi và tăng chỉ số VO2max.'
      },
      {
        dayOfWeek: 5,
        dayName: 'Thứ 5',
        groupA: { title: '5k Easy + Bổ trợ 30p Thân dưới', distanceKm: 5, description: '5km Easy + 30 phút bổ trợ chân mông đùi.', type: 'easy' },
        groupB: { title: '40p Easy + Bổ trợ 30p Thân dưới', durationMinutes: 40, description: '40 phút Easy + 30 phút bổ trợ chân mông đùi.', type: 'easy' },
        strengthFocus: 'lower'
      },
      {
        dayOfWeek: 6,
        dayName: 'Thứ 6',
        groupA: { title: 'Nghỉ Hoàn Toàn', distanceKm: 0, description: 'Nghỉ ngơi 100%.', type: 'rest' },
        groupB: { title: 'Nghỉ Hoàn Toàn', durationMinutes: 0, description: 'Nghỉ ngơi 100%.', type: 'rest' }
      },
      {
        dayOfWeek: 7,
        dayName: 'Thứ 7',
        groupA: { title: '5k Easy Thư Giãn', distanceKm: 5, description: '5km chạy rất nhẹ nhàng giải phóng axit lactic.', type: 'recovery' },
        groupB: { title: '40p Easy Thư Giãn', durationMinutes: 40, description: '40 phút chạy rất nhẹ nhàng.', type: 'recovery' }
      },
      {
        dayOfWeek: 8,
        dayName: 'Chủ Nhật',
        groupA: { title: 'Long Run 10km (6k L + 3k M + 1k E)', distanceKm: 10, description: 'Chạm mốc 10km! 6km Long Run + 3km Marathon Pace + 1km Easy.', type: 'long_run' },
        groupB: { title: 'Long Run 85 phút', durationMinutes: 85, description: '85 phút chạy bền với cảm giác tự tin.', type: 'long_run' },
        notes: 'Nhớ mang theo nước điện giải hoặc gel nạp ở phút thứ 45.'
      }
    ]
  },
  {
    weekNumber: 7,
    phase: 'Giai Đoạn 2: Tim Mạch, Hô Hấp, Tốc Độ & VO2max',
    title: 'Tuần 7: Tăng Khối Lượng Chạy Lên 35KM & Marathon Pace 4KM',
    focus: 'Đẩy cự ly ngày thường lên 6km và kéo dài bài chạy M lên 4km',
    quote: 'Khi bạn cảm thấy muốn dừng lại, hãy nhớ lý do vì sao bạn bắt đầu.',
    totalKmA: 35,
    days: [
      {
        dayOfWeek: 2,
        dayName: 'Thứ 2',
        groupA: { title: 'Nghỉ / Bơi / Đạp xe nhẹ 30p', distanceKm: 0, description: 'Nghỉ ngơi, phục hồi tích cực.', type: 'cross' },
        groupB: { title: 'Nghỉ / Bơi / Đạp xe nhẹ 30p', durationMinutes: 30, description: 'Nghỉ ngơi, phục hồi tích cực.', type: 'cross' }
      },
      {
        dayOfWeek: 3,
        dayName: 'Thứ 3',
        groupA: { title: '6k Easy + Bổ trợ 30p Thân trên', distanceKm: 6, description: '6km Easy + 30 phút bổ trợ thân trên.', type: 'easy' },
        groupB: { title: '45p Easy + Bổ trợ 30p Thân trên', durationMinutes: 45, description: '45 phút Easy + 30 phút bổ trợ thân trên.', type: 'easy' },
        strengthFocus: 'upper'
      },
      {
        dayOfWeek: 4,
        dayName: 'Thứ 4',
        groupA: { title: '8km Biến Tốc: 5k E + (1p I + 1p đi bộ) x 8 + 1k E', distanceKm: 8, description: '5km Easy + 8 hiệp biến tốc 1 phút Interval I + 1km Easy hạ nhiệt.', type: 'interval' },
        groupB: { title: 'Biến tốc VO2max (1p I + 1p đi bộ) x 8', durationMinutes: 50, description: '8 hiệp Interval 1 phút bứt tốc.', type: 'interval' }
      },
      {
        dayOfWeek: 5,
        dayName: 'Thứ 5',
        groupA: { title: '6k Easy + Bổ trợ 30p Thân dưới', distanceKm: 6, description: '6km Easy + 30 phút bổ trợ chân mông đùi.', type: 'easy' },
        groupB: { title: '45p Easy + Bổ trợ 30p Thân dưới', durationMinutes: 45, description: '45 phút Easy + 30 phút bổ trợ chân mông đùi.', type: 'easy' },
        strengthFocus: 'lower'
      },
      {
        dayOfWeek: 6,
        dayName: 'Thứ 6',
        groupA: { title: 'Nghỉ Hoàn Toàn', distanceKm: 0, description: 'Nghỉ ngơi 100%.', type: 'rest' },
        groupB: { title: 'Nghỉ Hoàn Toàn', durationMinutes: 0, description: 'Nghỉ ngơi 100%.', type: 'rest' }
      },
      {
        dayOfWeek: 7,
        dayName: 'Thứ 7',
        groupA: { title: '5k Easy Thư Giãn', distanceKm: 5, description: '5km chạy nhẹ nhịp tim Zone 2.', type: 'recovery' },
        groupB: { title: '40p Easy Thư Giãn', durationMinutes: 40, description: '40 phút chạy nhẹ nhịp tim Zone 2.', type: 'recovery' }
      },
      {
        dayOfWeek: 8,
        dayName: 'Chủ Nhật',
        groupA: { title: 'Long Run 10km (5k L + 4k M + 1k E)', distanceKm: 10, description: '5km Long Run + 4km Marathon Pace (M) tốc độ thi đấu + 1km Easy hạ nhiệt.', type: 'long_run' },
        groupB: { title: 'Long Run 90 phút', durationMinutes: 90, description: '90 phút chạy dài bền bỉ.', type: 'long_run' },
        notes: '4km Marathon Pace mô phỏng chính xác cảm giác duy trì tốc độ race ở nửa sau quãng đường.'
      }
    ]
  },
  {
    weekNumber: 8,
    phase: 'Giai Đoạn 2: Tim Mạch, Hô Hấp, Tốc Độ & VO2max',
    title: 'Tuần 8: Đỉnh Cao Khối Lượng 37KM & Interval 200M Nước Rút',
    focus: 'Chuyển sang biến tốc 200m nước rút bùng nổ và chạm mốc Long Run 11km',
    quote: 'Chạy bộ là nơi cơ thể mệt, nhưng tâm trí mạnh mẽ.',
    totalKmA: 37,
    days: [
      {
        dayOfWeek: 2,
        dayName: 'Thứ 2',
        groupA: { title: 'Nghỉ / Bơi / Đạp xe nhẹ 30p', distanceKm: 0, description: 'Nghỉ ngơi, phục hồi tích cực.', type: 'cross' },
        groupB: { title: 'Nghỉ / Bơi / Đạp xe nhẹ 30p', durationMinutes: 30, description: 'Nghỉ ngơi, phục hồi tích cực.', type: 'cross' }
      },
      {
        dayOfWeek: 3,
        dayName: 'Thứ 3',
        groupA: { title: '6k Easy + Bổ trợ 30p Thân trên', distanceKm: 6, description: '6km Easy + 30 phút bổ trợ thân trên.', type: 'easy' },
        groupB: { title: '45p Easy + Bổ trợ 30p Thân trên', durationMinutes: 45, description: '45 phút Easy + 30 phút bổ trợ thân trên.', type: 'easy' },
        strengthFocus: 'upper'
      },
      {
        dayOfWeek: 4,
        dayName: 'Thứ 4',
        groupA: { title: '8km Biến Tốc: 6k E + (200m I + 1p đi bộ) x 8 + 1k E', distanceKm: 8, description: '6km khởi động Easy + 8 lần bứt tốc 200m nước rút Interval (I) kèm 1 phút đi bộ chậm + 1km Easy hạ nhiệt.', type: 'interval' },
        groupB: { title: 'Biến tốc 200m I x 8 hiệp', durationMinutes: 50, description: 'Khởi động + 8 lần bứt tốc 200m Interval + 1p đi bộ + hạ nhiệt.', type: 'interval' },
        notes: '200m nước rút kích hoạt tối đa sợi cơ co rút nhanh (Fast-twitch fibers).'
      },
      {
        dayOfWeek: 5,
        dayName: 'Thứ 5',
        groupA: { title: '6k Easy + Bổ trợ 30p Thân dưới', distanceKm: 6, description: '6km Easy + 30 phút bổ trợ chân.', type: 'easy' },
        groupB: { title: '45p Easy + Bổ trợ 30p Thân dưới', durationMinutes: 45, description: '45 phút Easy + 30 phút bổ trợ chân.', type: 'easy' },
        strengthFocus: 'lower'
      },
      {
        dayOfWeek: 6,
        dayName: 'Thứ 6',
        groupA: { title: 'Nghỉ Hoàn Toàn', distanceKm: 0, description: 'Nghỉ ngơi 100%.', type: 'rest' },
        groupB: { title: 'Nghỉ Hoàn Toàn', durationMinutes: 0, description: 'Nghỉ ngơi 100%.', type: 'rest' }
      },
      {
        dayOfWeek: 7,
        dayName: 'Thứ 7',
        groupA: { title: '5k Easy Thư Giãn', distanceKm: 5, description: '5km chạy nhẹ chuẩn bị cho Long Run 11km.', type: 'recovery' },
        groupB: { title: '40p Easy Thư Giãn', durationMinutes: 40, description: '40 phút chạy nhẹ.', type: 'recovery' }
      },
      {
        dayOfWeek: 8,
        dayName: 'Chủ Nhật',
        groupA: { title: 'Long Run 11km (6k L + 4k M + 1k E)', distanceKm: 11, description: 'Đỉnh cao Tuần 8! 6km Long Run (L) + 4km Marathon Pace (M) + 1km Easy hạ nhiệt.', type: 'long_run' },
        groupB: { title: 'Long Run 95 phút', durationMinutes: 95, description: '95 phút chạy dài thử thách ý chí.', type: 'long_run' },
        notes: 'Hoàn thành mốc 11km khẳng định thể lực của bạn đã sẵn sàng cho nửa sau lộ trình 21km!'
      }
    ]
  }
];

// 3. TOÀN BỘ CẨM NANG & KIẾN THỨC CHẠY BỘ (6 CHƯƠNG + PHỤ LỤC)
export interface RunningChapter {
  id: string;
  chapterNumber: string;
  title: string;
  iconName: string;
  summary: string;
  sections: {
    heading: string;
    content: string[];
    tips?: string[];
    badge?: string;
  }[];
}

export const RUNNING_KNOWLEDGE_CHAPTERS: RunningChapter[] = [
  {
    id: 'chap-1',
    chapterNumber: 'CHƯƠNG I',
    title: 'Tổng Quan Về Chạy Bộ',
    iconName: 'Compass',
    summary: 'Lịch sử phát triển, giải phẫu sinh học con người và các hình thức chạy bộ kinh điển.',
    sections: [
      {
        heading: '1. Lịch sử chạy bộ qua các thời kỳ',
        content: [
          'Đi từ nhu cầu "chạy vì miếng ăn" (săn mồi, chạy trốn dã thú thời cổ đại).',
          'Sự kiện lịch sử Pheidippides chạy liên tục 42km từ bãi chiến trường Marathon về thành Athens năm 490 TCN để báo tin chiến thắng rồi kiệt sức trút hơi thở cuối cùng — nguồn gốc của cự ly Marathon hiện đại.',
          'Thời Trung Đại: nghề người đưa thư/tin tức bằng chân trần.',
          'Thời Hiện Đại: Thế vận hội Olympic 1896, giải Boston Marathon 1897, làn sóng chạy bộ bùng nổ thập niên 1960–1970 với huyền thoại Bill Bowerman (sáng lập Nike). Ngày nay, chạy bộ là phong cách sống vì sức khỏe, giảm stress và chinh phục huy chương finisher.'
        ]
      },
      {
        heading: '2. Giá trị lợi ích vàng của chạy bộ',
        content: [
          'Về Thể Chất: Tim khỏe, dung tích phổi tăng; cơ chân mông săn chắc (chạy bền đường dài không làm to bắp chân như lời đồn, mà làm cơ thon gọn, săn chắc); đốt mỡ giảm cân hiệu quả (đốt 500 – 1000 Calo mỗi giờ chạy); tăng đề kháng hệ miễn dịch, ít ốm vặt và ngủ sâu giấc hơn.',
          'Về Tinh Thần & Tuổi Thọ: Não bộ giải phóng hormone hạnh phúc Endorphin giúp xả sạch stress công việc (Runner’s High); các nghiên cứu y khoa quốc tế chứng minh người chạy bộ thường xuyên có tuổi thọ cao hơn người ít vận động từ 3 đến 6 năm.'
        ]
      },
      {
        heading: '3. Con người có phù hợp với chạy bộ?',
        content: [
          'Cấu trúc giải phẫu bàn chân con người có 26 xương, 33 khớp và hơn 100 dây chằng, kết hợp cơ đùi, bắp chuối và gân gót Achilles hoạt động như một hệ thống lò xo giảm chấn tuyệt vời.',
          'Lưu ý y tế: Người có vấn đề thoái hóa khớp gối nặng, thoát vị đĩa đệm cấp tính hoặc bệnh lý tim mạch bẩm sinh cần tham khảo ý kiến bác sĩ trước khi bắt đầu lộ trình tăng cự ly.'
        ],
        badge: 'Y học thể thao'
      },
      {
        heading: '4. Các hình thức chạy bộ phổ biến',
        content: [
          'Easy Run (Chạy nhẹ E): Chiếm 75-80% khối lượng, chạy ở nhịp tim Zone 2 trò chuyện được, giúp xây dựng mao mạch tế bào và phục hồi.',
          'Long Run (Chạy dài L): Chạy cự ly dài nhất trong tuần (Chủ Nhật) nhằm rèn luyện sức bền chuyển hóa chất béo và ý chí kiên định.',
          'Interval Run (Chạy biến tốc I): Xen kẽ các đoạn bứt tốc cực nhanh và đi bộ thả lỏng (VD: 1 phút nhanh + 1 phút đi bộ x 8 hiệp) giúp nâng chỉ số VO2max.',
          'Tempo Run (Chạy ngưỡng T): Chạy ở tốc độ nhanh vừa phải duy trì liên tục 20-40 phút để nâng ngưỡng chịu đựng axit lactic cơ bắp.',
          'Recovery Run (Chạy phục hồi): Chạy cự ly ngắn, tốc độ rất chậm sau ngày tập nặng để thúc đẩy tuần hoàn máu đào thải mỏi cơ.',
          'Fartlek (Biến tốc ngẫu hứng): Thay đổi tốc độ tự do theo địa hình hoặc cảm hứng.',
          'Trail Run (Chạy địa hình): Chạy trên đường mòn, băng rừng vượt núi tự nhiên.'
        ]
      }
    ]
  },
  {
    id: 'chap-2',
    chapterNumber: 'CHƯƠNG II',
    title: 'Kỹ Thuật Chạy Bộ Chuẩn Y Khoa',
    iconName: 'Footprints',
    summary: 'Kỹ thuật tiếp đất, đánh tay, tư thế thân người và nhịp thở cơ hoành giảm chấn thương.',
    sections: [
      {
        heading: '1. Cách đáp chân tiếp đất (Footstrike)',
        content: [
          'Đáp gót (Heel Strike): Rất phổ biến ở người mới nhưng tạo lực phanh cản trở và dội phản lực trực tiếp lên khớp gối và cột sống.',
          'Đáp lòng bàn chân (Midfoot Strike) — TỐI ƯU NHẤT: Chân tiếp đất bằng toàn bộ phần giữa bàn chân, phân bổ lực đều, hệ cơ gân hấp thụ xung lực hoàn hảo, là lựa chọn an toàn số 1 cho chạy đường dài Half & Full Marathon.',
          'Đáp mũi chân (Forefoot Strike): Thường dùng trong cự ly ngắn nước rút (Sprint), dễ gây mỏi căng bắp chân và gân Achilles nếu chạy cự ly dài.'
        ],
        tips: [
          'Bí kíp sửa tiếp đất: Giảm độ dài sải chân, luôn tiếp đất ngay dưới trọng tâm cơ thể (không vươn chân quá xa về phía trước).',
          'Tăng guồng chân (Cadence): Mục tiêu 170 – 180 bước/phút để chân vừa chạm đất là rút lên ngay.'
        ],
        badge: 'Cốt lõi'
      },
      {
        heading: '2. Cách đánh tay tiết kiệm năng lượng',
        content: [
          'Đánh tay đúng kỹ thuật giúp tiết kiệm từ 3% đến 13% năng lượng tiêu hao trên đường chạy.',
          'Khuỷu tay gập góc vuông khoảng 90 độ, thả lỏng cơ vai hoàn toàn.',
          'Biên độ đánh tay: Theo hướng thẳng trước - sau, từ ngang hông đến ngang ngực (tuyệt đối không vung tay chéo qua giữa ngực vì sẽ làm xoắn thân người lãng phí sức).',
          'Bàn tay nắm hờ tự nhiên như đang cầm một quả trứng gà, không gồng chặt nắm đấm.'
        ]
      },
      {
        heading: '3. Thân người và đầu',
        content: [
          'Đầu giữ thẳng trên trục vai, mắt nhìn về phía trước từ 10 đến 20 mét (không cúi gằm nhìn chân làm mỏi đốt sống cổ).',
          'Lưng thẳng tự nhiên, toàn bộ thân người hơi đổ nhẹ về phía trước từ 5 đến 10 độ (đổ người từ mắt cá chân, không gập người ở thắt lưng). Trọng lực sẽ tự động kéo bạn lao về phía trước một cách tự nhiên.',
          'Siết nhẹ cơ lõi (Core/Plank) để khung xương chậu không bị lắc lư.'
        ]
      },
      {
        heading: '4. Kỹ thuật hít thở cơ hoành',
        content: [
          'Thở bằng cơ hoành (thở bụng): Khi hít vào phình bụng dưới ra để cơ hoành hạ xuống hút tối đa oxy vào đáy phổi; khi thở ra hóp bụng lại đẩy khí CO2 cặn bã ra ngoài.',
          'Hít bằng mũi hay miệng: Khi chạy nhẹ Easy thì hít mũi thở miệng; khi chạy cường độ cao (Tempo, Interval) thì mở hé miệng kết hợp hít thở cả mũi và miệng để đón lượng oxy dồi dào nhất.',
          'Nhịp thở theo bước chân: Nhịp 3:3 (3 bước hít - 3 bước thở) cho chạy nhẹ; nhịp 2:2 cho tốc độ Marathon/Tempo.'
        ]
      }
    ]
  },
  {
    id: 'chap-3',
    chapterNumber: 'CHƯƠNG III',
    title: 'Dụng Cụ & Trang Thiết Bị',
    iconName: 'ShieldCheck',
    summary: 'Chọn giày theo cự ly, trang phục chống chafing và thiết bị đồng hồ/phần mềm.',
    sections: [
      {
        heading: '1. Trang phục và phụ kiện chống phồng rộp',
        content: [
          'Áo & Quần: Tuyệt đối tránh chất liệu Cotton 100% (vì thấm hút mồ hôi giữ nước làm áo nặng trĩu và cọ xát gây rát da chafing). Chọn sợi thể thao nhân tạo Quick-Dry (Polyester, Spandex, Nylon) siêu nhẹ, thoáng khí.',
          'Tất/Vớ chạy bộ: Chọn tất chuyên dụng dệt liền không có đường may gồ ghề ở ngón chân, vải thoát ẩm để chống rộp nước (blisters).',
          'Phụ kiện: Mũ lưỡi trai thoáng khí che nắng, kính râm thể thao chống chói và bụi mịn bảo vệ mắt.'
        ]
      },
      {
        heading: '2. Phân loại giày chạy bộ (Running Shoes)',
        content: [
          'Dòng chạy êm ái, bảo vệ khớp hàng ngày (Daily Trainer / Long Run): Nike Invincible Run, Hoka Clifton, Asics Gel-Nimbus, Brooks Ghost — đệm bọt dày, độ nảy êm ái, thích hợp người mới và chạy dài.',
          'Dòng thi đấu tốc độ cao có đĩa đệm Carbon (Race Shoes): Nike Vaporfly / Alphafly, Adidas Adios Pro, Asics Metaspeed, Saucony Endorphin Pro — siêu nhẹ, trợ lực đẩy bùng nổ cho ngày thi đấu săn Sub PR.',
          'Dòng đa năng, bền bỉ: Asics Novablast, Nike Air Zoom Pegasus, Saucony Ride.'
        ]
      },
      {
        heading: '3. Thiết bị & Phần mềm theo dõi',
        content: [
          'Đồng hồ thể thao GPS: Đo chính xác Pace thời gian thực, nhịp tim (HR), quãng đường và nhịp bước chân Cadence (Garmin, Coros, Mibro, Apple Watch).',
          'Hệ sinh thái Strava: Mạng xã hội chạy bộ lớn nhất thế giới kết nối cộng đồng, lưu trữ bản đồ vệ tinh GPS và kỷ lục cá nhân.'
        ]
      }
    ]
  },
  {
    id: 'chap-4',
    chapterNumber: 'CHƯƠNG IV',
    title: 'Các Bài Tập & Khởi Động - Bổ Trợ',
    iconName: 'Dumbbell',
    summary: 'Khởi động động 5 phút, giãn cơ tĩnh sau chạy và 5 bài gym bổ trợ then chốt cho runner.',
    sections: [
      {
        heading: '1. Bài khởi động động (5–10 phút trước khi chạy)',
        content: [
          'Đá chân trước/sau và xoay khớp hông (Leg Swings): Bôi trơn ổ khớp háng.',
          'Chạy gót chạm mông (Butt Kicks): Kích hoạt nhóm cơ đùi trước và khớp gối.',
          'Chạy nâng cao đùi (High Knees): Kích hoạt cơ gấp hông (Hip flexors) và cơ lõi.',
          'Bước nhỏ sải bước tại chỗ (Ankling & Skipping Drills): Đánh thức gân gót Achilles và khớp cổ chân.',
          'Lưu ý: Tuyệt đối không ép dẻo kéo giãn tĩnh quá lâu trước khi chạy vì làm giảm sức căng cơ bắp.'
        ]
      },
      {
        heading: '2. Bài giãn cơ tĩnh (5–10 phút sau khi chạy)',
        content: [
          'Kéo giãn cơ đùi trước (Standing Quad Stretch): Đứng 1 chân, tay kéo cổ chân ra sau sát mông giữ 20-30s.',
          'Kéo giãn cơ đùi sau (Hamstring Stretch): Đặt gót chân phía trước, gập người từ hông chạm mũi chân.',
          'Kéo giãn bắp chuối (Calf Stretch): Tựa tay vào tường, chân sau duỗi thẳng ép gót chân sát mặt đất.',
          'Giãn cơ đùi trong hình cánh bướm (Butterfly Stretch): Ngồi ép hai lòng bàn chân vào nhau mở gối.',
          'Tác dụng: Thúc đẩy lưu thông máu, loại bỏ axit lactic ứ đọng, tránh đau nhức ê ẩm ngày hôm sau.'
        ]
      },
      {
        heading: '3. Các bài tập Gym bổ trợ sức mạnh (Strength Training for Runners)',
        content: [
          'Plank: Tăng cường độ vững chắc cơ lõi bụng lưng, giữ người thẳng suốt 21km không bị gù sụp lưng.',
          'Squat: Xây dựng sức mạnh đùi trước và mông, giúp khớp gối chịu lực bền bỉ.',
          'Walking Lunge: Tăng thăng bằng từng chân độc lập, khắc phục lệch cơ trái/phải.',
          'Calf Raises (Nhón bắp chân): Củng cố gân Achilles và cơ bắp chuối, phòng tránh chuột rút hiệu quả.',
          'Glute Bridges (Nâng mông cây cầu): Đánh thức cơ mông lớn, giảm gánh nặng dội lên thắt lưng dưới.'
        ],
        badge: 'Đặc biệt cho Gymer'
      }
    ]
  },
  {
    id: 'chap-5',
    chapterNumber: 'CHƯƠNG V',
    title: 'Dinh Dưỡng & Tiếp Nước Điện Giải',
    iconName: 'Zap',
    summary: 'Carb, Protein, Gel năng lượng, viên muối chống chuột rút và chiến lược ăn uống ngày race.',
    sections: [
      {
        heading: '1. Carb — Nhiên liệu vàng số 1',
        content: [
          'Carb phức hợp / hấp thu chậm: Khoai lang, yến mạch, gạo lứt, bánh mì đen nguyên cám nạp vào các bữa chính hàng ngày để tích trữ Glycogen đầy ắp trong gan và cơ bắp.',
          'Carb đơn giản / hấp thu nhanh: Chuối chín, mật ong, bánh mì trắng, nước đường Isotonic dùng trước khi chạy 30-60 phút hoặc ngay trên đường chạy dài để bổ sung năng lượng tức thì.'
        ]
      },
      {
        heading: '2. Protein, Chất béo tốt và Vi chất',
        content: [
          'Protein (Đạm phục hồi): Ức gà, trứng, cá hồi, thịt bò, Whey Protein nạp trong khung giờ vàng 30 – 60 phút sau buổi chạy để hàn gắn các vi tổn thương sợi cơ.',
          'Chất béo tốt: Quả bơ, dầu oliu, hạnh nhân, hạt óc chó giúp kháng viêm khớp và cung cấp năng lượng hiếu khí bền bỉ.',
          'Vi chất thiết yếu: Canxi & Vitamin D (chắc xương), Omega-3 (giảm viêm), Magie & Sắt (ngăn ngừa co thắt chuột rút cơ).'
        ]
      },
      {
        heading: '3. Chiến lược bù nước & Điện giải (Hydration)',
        content: [
          'Trước khi chạy 1-2 tiếng: Uống từ 300ml đến 500ml nước lọc.',
          'Trong khi chạy: Cứ mỗi 20-25 phút hoặc sau mỗi 3km, uống từng ngụm nhỏ (100ml - 150ml). Tuyệt đối không đợi khát khô cổ mới uống vì khi đó cơ thể đã mất 2% trọng lượng nước, giảm 15% hiệu suất.',
          'Gel năng lượng & Viên muối: Với các bài chạy dài trên 60 phút, cần nạp 1 gói Energy Gel mỗi 40-45 phút kèm nước lọc, bổ sung viên muối điện giải (Natri, Kali, Magie) để tránh "đụng tường" (sập nguồn).'
        ],
        badge: 'Chống đụng tường'
      }
    ]
  },
  {
    id: 'chap-6',
    chapterNumber: 'CHƯƠNG VI',
    title: 'Nguyên Tắc An Toàn & Xử Lý Chấn Thương',
    iconName: 'HeartPulse',
    summary: 'Quy tắc 10%, nguyên tắc 80/20, xử lý lật sơ mi, đau khớp gối và chuột rút.',
    sections: [
      {
        heading: '1. Hai quy tắc vàng kiểm soát khối lượng',
        content: [
          'Quy tắc 10% (10% Rule): Tổng quãng đường chạy tích lũy giữa 2 tuần liên tiếp không được tăng quá 10%. (Ví dụ: Tuần này chạy 20km thì tuần sau tối đa 22km).',
          'Nguyên tắc 80/20: Dành 80% thời gian chạy ở cường độ nhẹ nhàng thoải mái (Easy Pace), chỉ dành 20% cho các bài chạy tốc độ cao (Interval/Tempo). Chạy chậm chính là bí quyết để chạy nhanh!'
        ]
      },
      {
        heading: '2. Nhận biết và xử lý chấn thương phổ biến',
        content: [
          'Lật sơ mi mắt cá chân (Ankle Sprain): Do sụp ổ gà, hụt chân. Xử lý chuẩn phác đồ R.I.C.E: Rest (Nghỉ), Ice (Chườm đá lạnh 15 phút), Compression (Băng ép nhẹ), Elevation (Gác cao chân).',
          'Đau khớp gối bánh chè (Runner’s Knee): Đau âm ỉ quanh xương bánh chè do tăng khối lượng quá vội hoặc cơ đùi yếu. Xử lý: Giảm ngay km, chườm lạnh, tập tăng cường cơ đùi trước (Quad) và dải chậu chày (IT Band).',
          'Chuột rút (Muscle Cramps): Co cứng cơ đột ngột do thiếu muối điện giải hoặc cơ bắp quá tải. Xử lý: Dừng lại ngay, kéo giãn nhẹ nhàng cơ bị rút theo chiều ngược lại, uống nước điện giải và xoa bóp làm ấm cơ.'
        ]
      }
    ]
  },
  {
    id: 'appendix',
    chapterNumber: 'PHỤ LỤC',
    title: 'Từ Điển Thuật Ngữ Runner Chuyên Nghiệp',
    iconName: 'BookOpen',
    summary: 'Giải thích chi tiết các chỉ số đo lường, cự ly và thuật ngữ ngày đi race.',
    sections: [
      {
        heading: '1. Các chỉ số đo lường',
        content: [
          'Pace: Tốc độ chạy tính bằng số phút để hoàn thành 1km (VD: Pace 5:30 có nghĩa là chạy 1km hết 5 phút 30 giây). Số càng nhỏ thì chạy càng nhanh.',
          'Cadence: Số bước chân mỗi phút (SPM - Steps Per Minute). Chuẩn tối ưu giảm chấn thương là 175 - 185 SPM.',
          'Heart Rate (HR): Nhịp tim đập mỗi phút (BPM), chia thành 5 vùng: Zone 1 (Phục hồi <60%), Zone 2 (Hiếu khí đốt mỡ 60-70%), Zone 3 (Sức bền 70-80%), Zone 4 (Ngưỡng kỵ khí 80-90%), Zone 5 (Cực đại 90-100%).',
          'VO2 Max: Dung tích tiêu thụ oxy tối đa trong 1 phút trên mỗi kg thể trọng (ml/kg/min) — chỉ số phản ánh đẳng cấp thể lực hiếu khí của bạn.'
        ]
      },
      {
        heading: '2. Các cự ly thi đấu tiêu chuẩn',
        content: [
          '5K (5km): Cự ly nhập môn phổ biến.',
          '10K (10km): Thử thách cự ly trung bình.',
          'Half Marathon (HM - 21.0975km): Cự ly bán marathon chuẩn Olympic.',
          'Full Marathon (FM - 42.195km): Đỉnh cao cự ly marathon kinh điển.',
          'Ultra Marathon: Bất kỳ cự ly nào dài hơn 42.195km (50km, 70km, 100km, 160km).'
        ]
      },
      {
        heading: '3. Thuật ngữ ngày hội đua (Race Day)',
        content: [
          'Bib: Số báo danh thi đấu đeo trước bụng, mặt sau gắn chip điện tử tính giờ tự động (Timing Chip).',
          'Pacer: Người dẫn tốc độ cầm cờ có ghi mốc thời gian (VD: Pacer 2:00, 2:15) giúp runner duy trì đều pace về đích đúng mục tiêu.',
          'COT (Cut-off Time): Thời gian giới hạn tối đa của ban tổ chức tại các trạm kiểm soát hoặc vạch đích.',
          'DNF (Did Not Finish): Không hoàn thành cuộc đua do chấn thương, quá COT hoặc bỏ cuộc.',
          'Gun Time: Thời gian tính từ phát súng xuất phát của giải đấu.',
          'Chip Time (Net Time): Thời gian thực tế tính từ lúc chân bạn dẫm qua thảm từ vạch xuất phát đến khi dẫm qua thảm vạch đích (đây là thành tích cá nhân chính thức của bạn).'
        ]
      }
    ]
  }
];

// 4. HÀM TÍNH TOÁN VDOT & QUY ĐỔI MỤC TIÊU SUB HM
export function calculateVDOT(distanceKm: number, timeSeconds: number): number {
  if (distanceKm <= 0 || timeSeconds <= 0) return 30;
  const timeMinutes = timeSeconds / 60;
  const velocityMetersPerMin = (distanceKm * 1000) / timeMinutes;

  // Công thức Jack Daniels VO2 cost:
  // VO2 = -4.60 + 0.182258 * v + 0.000104 * v^2
  const vo2Cost = -4.60 + 0.182258 * velocityMetersPerMin + 0.000104 * Math.pow(velocityMetersPerMin, 2);

  // Tỷ lệ %VO2max theo thời gian duy trì:
  // drop = 0.8 + 0.1894393 * exp(-0.012778 * t) + 0.2989558 * exp(-0.1932605 * t)
  const percentMax = 0.8 + 0.1894393 * Math.exp(-0.012778 * timeMinutes) + 0.2989558 * Math.exp(-0.1932605 * timeMinutes);

  const vdot = vo2Cost / percentMax;
  return Math.round(vdot * 10) / 10;
}

export function suggestSubFromVDOT(vdot: number): TargetSub {
  if (vdot >= 50) return 'sub130';
  if (vdot >= 42) return 'sub145';
  if (vdot >= 36) return 'sub200';
  if (vdot >= 31) return 'sub215';
  if (vdot >= 27) return 'sub230';
  if (vdot >= 24) return 'sub245';
  return 'sub300';
}

export function formatSecondsToTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export function formatPace(paceSeconds: number): string {
  if (!isFinite(paceSeconds) || paceSeconds <= 0 || paceSeconds > 1200) return '--:--';
  const m = Math.floor(paceSeconds / 60);
  const s = Math.round(paceSeconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}
