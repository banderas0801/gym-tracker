export interface ExerciseTechniqueGuide {
  vietnameseName: string;
  formCues: [string, string, string]; // 3 khẩu quyết cốt tử
  commonMistake: string;             // Lỗi sai phổ biến
  startingWeightGuide: {
    recommendedWeightKg: number;
    recommendedUnit: 'kg' | 'kg/bên' | 'nấc pin';
    targetReps: string;
    targetRpe: string;
    advice: string;
  };
}

export function getExerciseGuide(
  exerciseId: string,
  exerciseName: string,
  equipment?: string | null,
  primaryMuscle?: string
): ExerciseTechniqueGuide {
  const nameLower = (exerciseName || '').toLowerCase();
  const eqLower = (equipment || '').toLowerCase();
  const muscleLower = (primaryMuscle || '').toLowerCase();

  // 1. Bench Press / Ngực
  if (nameLower.includes('bench press') || (muscleLower.includes('chest') && nameLower.includes('press'))) {
    const isDumbbell = eqLower.includes('dumbbell') || nameLower.includes('dumbbell');
    return {
      vietnameseName: isDumbbell ? 'Đẩy Ngực Tạ Đơn (Dumbbell Press)' : 'Đẩy Ngực Đòn Ngang (Bench Press)',
      formCues: [
        'Khóa bả vai: Kéo 2 xương bả vai ra sau và hạ xuống, áp chặt lưng trên vào ghế.',
        'Góc cùi chỏ 45°- 75°: Không mở bè cùi chỏ vuông góc 90° để tránh rách khớp vai.',
        'Hít thở & Nhịp độ: Hít sâu gồng bụng khi hạ tạ chậm (2s), thở ra dứt khoát khi đẩy lên (1s).'
      ],
      commonMistake: 'Nhấc mông khỏi ghế và duỗi thẳng khớp cùi chỏ khóa khớp đột ngột.',
      startingWeightGuide: {
        recommendedWeightKg: isDumbbell ? 6.0 : 20.0,
        recommendedUnit: isDumbbell ? 'kg/bên' : 'kg',
        targetReps: '10 - 12 reps',
        targetRpe: 'RPE 6 - 7',
        advice: isDumbbell 
          ? 'Người mới nên bắt đầu với tạ đơn 5kg - 7kg mỗi bên để kiểm soát thăng bằng cổ tay.' 
          : 'Bắt đầu với thanh đòn Olympic rỗng 20kg (chưa lắp bánh tạ) để học cảm nhận quỹ đạo tạ.'
      }
    };
  }

  // 2. Squat / Chân
  if (nameLower.includes('squat')) {
    const isDumbbell = eqLower.includes('dumbbell') || nameLower.includes('goblet');
    return {
      vietnameseName: isDumbbell ? 'Ngồi Xổm Goblet (Goblet Squat)' : 'Gánh Tạ Ngồi Xổm (Barbell Squat)',
      formCues: [
        'Thế chân: Hai chân rộng bằng vai, mũi chân xoay nhẹ ra ngoài 15° - 30°.',
        'Đầu gối hướng theo mũi chân: Mở gối ra ngoài khi hạ mông, không để đầu gối chụm vào trong.',
        'Cột sống trung tính: Giữ ngực cao, siết chặt cơ bụng (Core) trong suốt chuyển động.'
      ],
      commonMistake: 'Nhón gót chân lên khi ngồi xuống hoặc cong gập lưng dưới (Butt wink).',
      startingWeightGuide: {
        recommendedWeightKg: isDumbbell ? 8.0 : 20.0,
        recommendedUnit: isDumbbell ? 'kg' : 'kg',
        targetReps: '8 - 10 reps',
        targetRpe: 'RPE 6',
        advice: isDumbbell
          ? 'Tập bài Goblet Squat ôm quả tạ đơn 6-8kg trước ngực giúp lưng luôn thẳng tự nhiên.'
          : 'Tập với đòn không 20kg để tập cảm giác dồn trọng tâm vào giữa lòng bàn chân.'
      }
    };
  }

  // 3. Deadlift / Lưng đùi
  if (nameLower.includes('deadlift')) {
    return {
      vietnameseName: 'Kéo Tạ Đòn (Deadlift)',
      formCues: [
        'Khoảng cách đòn: Thanh đòn luôn sát cẳng chân, cách ống đồng khoảng 2-3cm.',
        'Khóa lưng thẳng: Siết xô, ưỡn ngực, giữ cột sống thẳng tuyệt đối từ cổ đến thắt lưng.',
        'Đạp sàn bằng chân: Dùng lực bàn chân đạp mạnh xuống sàn để nhấc tạ, không kéo giật bằng lưng.'
      ],
      commonMistake: 'Cong tôm lưng dưới khi kéo tạ lên - nguy cơ thoát vị đĩa đệm rất cao.',
      startingWeightGuide: {
        recommendedWeightKg: 30.0,
        recommendedUnit: 'kg',
        targetReps: '6 - 8 reps',
        targetRpe: 'RPE 6',
        advice: 'Lắp 2 bánh tạ nhẹ (mỗi bên 5kg vào đòn 20kg = 30kg) để tạ có độ cao chuẩn so với mặt sàn.'
      }
    };
  }

  // 4. Lat Pulldown / Pullups / Kéo xô
  if (nameLower.includes('pulldown') || nameLower.includes('pull-up') || nameLower.includes('chin-up')) {
    return {
      vietnameseName: 'Kéo Xô Rộng Tay (Lat Pulldown)',
      formCues: [
        'Kéo cùi chỏ về hông: Nghĩ về việc ép cùi chỏ xuống sườn thay vì dùng ngón tay giật tạ.',
        'Ngực ưỡn nhẹ: Hơi ngả người về sau 10°- 15°, kéo thanh xà chạm sát xương quai xanh.',
        'Nhả tạ có kiểm soát: Giữ tạ 1s ở đáy, thả lên chậm rãi trong 2-3s để kéo dãn cơ xô.'
      ],
      commonMistake: 'Ngả người quá sâu ra sau rồi lấy đà giật tạ bằng lưng dưới.',
      startingWeightGuide: {
        recommendedWeightKg: 20.0,
        recommendedUnit: 'nấc pin',
        targetReps: '10 - 12 reps',
        targetRpe: 'RPE 7',
        advice: 'Chọn mức tạ 15-20kg (nấc 3 hoặc 4 trên máy) để cảm nhận cơ xô co bóp rõ ràng.'
      }
    };
  }

  // 5. Overhead / Shoulder Press / Đẩy vai
  if (nameLower.includes('shoulder press') || nameLower.includes('overhead') || nameLower.includes('military')) {
    const isDumbbell = eqLower.includes('dumbbell');
    return {
      vietnameseName: isDumbbell ? 'Đẩy Vai Tạ Đơn (Dumbbell Shoulder Press)' : 'Đẩy Vai Qua Đầu (Overhead Press)',
      formCues: [
        'Cố định thân người: Siết chặt mông và cơ bụng để không bị võng lưng dưới.',
        'Góc cùi chỏ chếch nhẹ 30°: Không mở cùi chỏ thẳng tắp sang 2 bên để bảo vệ khớp xoay vai.',
        'Đẩy thẳng trục: Đẩy tạ theo đường thẳng hướng thẳng lên đỉnh đầu.'
      ],
      commonMistake: 'Ưỡn ngực quá mức và ưỡn cong lưng dưới biến bài đẩy vai thành đẩy ngực trên.',
      startingWeightGuide: {
        recommendedWeightKg: isDumbbell ? 5.0 : 15.0,
        recommendedUnit: isDumbbell ? 'kg/bên' : 'kg',
        targetReps: '10 - 12 reps',
        targetRpe: 'RPE 6 - 7',
        advice: 'Tạ đơn 4kg - 6kg mỗi bên là mức chuẩn nhất để người mới kiểm soát khớp vai an toàn.'
      }
    };
  }

  // 6. Row / Chèo xô
  if (nameLower.includes('row')) {
    const isDumbbell = eqLower.includes('dumbbell');
    return {
      vietnameseName: isDumbbell ? 'Chèo Tạ Đơn 1 Tay (One-arm DB Row)' : 'Kéo Tạ Đòn Gập Người (Bent Over Row)',
      formCues: [
        'Gập hông 45°: Đẩy mông ra sau, giữ lưng thẳng song song hoặc chếch 45° so với sàn.',
        'Kéo cùi chỏ về túi quần: Đưa tạ sát người và siết chặt cơ lưng trên khi kết thúc.',
        'Cổ thẳng tự nhiên: Nhìn chéo xuống sàn 1-2 mét, không ngửa cổ nhìn thẳng lên gương.'
      ],
      commonMistake: 'Đung đưa thân trên lấy đà kéo tạ thay vì dùng cơ lưng kéo.',
      startingWeightGuide: {
        recommendedWeightKg: isDumbbell ? 8.0 : 20.0,
        recommendedUnit: isDumbbell ? 'kg/bên' : 'kg',
        targetReps: '10 - 12 reps',
        targetRpe: 'RPE 7',
        advice: 'Dùng tạ đơn 6-8kg và kê 1 đầu gối lên ghế phẳng sẽ giúp cô lập lưng tốt và đỡ mỏi cột sống.'
      }
    };
  }

  // 7. Bicep Curl / Tay trước
  if (nameLower.includes('curl')) {
    return {
      vietnameseName: 'Cuộn Tay Trước (Bicep Curl)',
      formCues: [
        'Cùi chỏ khóa cố định: Ép sát cùi chỏ 2 bên mạng sườn, không đưa cùi chỏ ra trước khi cuộn.',
        'Vặn cổ tay nhẹ: Khi nâng tạ lên, ngửa lòng bàn tay hướng lên trần để siết đỉnh cơ bắp tay.',
        'Hạ tạ chậm: Dành 2-3 giây để duỗi thẳng tay, không để tạ rơi tự do.'
      ],
      commonMistake: 'Đung đưa người và ưỡn lưng lấy đà để quăng tạ lên.',
      startingWeightGuide: {
        recommendedWeightKg: 5.0,
        recommendedUnit: 'kg/bên',
        targetReps: '10 - 12 reps',
        targetRpe: 'RPE 7 - 8',
        advice: 'Tạ đơn 4kg - 6kg mỗi bên. Nếu thấy người phải đung đưa thì lập tức hạ xuống 4kg.'
      }
    };
  }

  // 8. Triceps / Tay sau
  if (nameLower.includes('triceps') || nameLower.includes('pushdown') || nameLower.includes('dip')) {
    return {
      vietnameseName: 'Nhấn Cáp Tay Sau (Triceps Pushdown)',
      formCues: [
        'Cùi chỏ bất động: Giữ cùi chỏ ép sát thân, khớp cùi chỏ là trục quay duy nhất.',
        'Duỗi thẳng hết biên độ: Nhấn tạ xuống dưới cùng và siết cứng cơ tam đầu trong 1 giây.',
        'Kiểm soát chiều lên: Khi trả tạ lên, không để cùi chỏ bị kéo giật lên trên.'
      ],
      commonMistake: 'Đè cả trọng lượng cơ thể lên thanh đòn để nhấn tạ xuống.',
      startingWeightGuide: {
        recommendedWeightKg: 10.0,
        recommendedUnit: 'nấc pin',
        targetReps: '12 - 15 reps',
        targetRpe: 'RPE 7',
        advice: 'Chọn mức tạ 10kg trên dây cáp. Bài này cơ tay sau thích ứng rất nhanh với số lần 12-15 reps.'
      }
    };
  }

  // 9. Lateral Raise / Bay vai bên
  if (nameLower.includes('lateral raise') || nameLower.includes('side raise')) {
    return {
      vietnameseName: 'Bay Tạ Sang Hai Bên (Lateral Raise)',
      formCues: [
        'Nâng cùi chỏ lên trước: Tưởng tượng đang rót nước từ bình, cùi chỏ luôn cao hơn hoặc ngang cổ tay.',
        'Hơi đưa tạ về trước 15°: Nâng tạ trong mặt phẳng bả vai (Scapular plane), không nâng thẳng ngang hông.',
        'Không nhún vai: Giữ cầu vai thả lỏng, chỉ dùng cơ vai giữa để nhấc tạ.'
      ],
      commonMistake: 'Cầm tạ quá nặng rồi nhún vai giật người, chỉ tập vào cơ cầu vai (Traps).',
      startingWeightGuide: {
        recommendedWeightKg: 3.0,
        recommendedUnit: 'kg/bên',
        targetReps: '12 - 15 reps',
        targetRpe: 'RPE 7 - 8',
        advice: 'Bắt đầu với tạ đơn 2kg - 4kg. Cơ vai bên rất nhỏ, tập tạ nhẹ với kỹ thuật chuẩn sẽ to nhanh gấp 3 lần.'
      }
    };
  }

  // Default Fallback
  const isDumbbell = eqLower.includes('dumbbell');
  const isBarbell = eqLower.includes('barbell');
  const isMachine = eqLower.includes('machine') || eqLower.includes('cable');

  return {
    vietnameseName: exerciseName,
    formCues: [
      'Tư thế vững chắc: Gồng cơ lõi (Core/Bụng) và đứng/ngồi thăng bằng trước khi bắt đầu chuyển động.',
      'Kiểm soát nhịp độ: Hạ tạ có kiểm soát trong 2 giây, không thả tạ rơi tự do để bảo vệ khớp.',
      'Hít thở đúng nhịp: Hít sâu khi vào pha hạ tạ dãn cơ, thở ra dứt khoát khi dùng lực đẩy/kéo tạ.'
    ],
    commonMistake: 'Tập quá nhanh và dùng đà cơ thể thay vì để cơ bắp mục tiêu thực hiện chuyển động.',
    startingWeightGuide: {
      recommendedWeightKg: isBarbell ? 20.0 : isDumbbell ? 5.0 : isMachine ? 15.0 : 0,
      recommendedUnit: isBarbell ? 'kg' : isDumbbell ? 'kg/bên' : isMachine ? 'nấc pin' : 'kg',
      targetReps: '10 - 12 reps',
      targetRpe: 'RPE 6 - 7',
      advice: isBarbell
        ? 'Dùng thanh đòn rỗng 20kg để cảm nhận đường đi của bài tập trong buổi đầu tiên.'
        : isDumbbell
        ? 'Bắt đầu với tạ đơn nhẹ 4kg - 6kg mỗi bên để làm quen cổ tay.'
        : 'Bắt đầu với mức tạ nhẹ 10-15kg trên máy để điều chỉnh ghế ngồi cho chuẩn vị trí khớp.'
    }
  };
}
