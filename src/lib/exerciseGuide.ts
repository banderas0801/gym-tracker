export interface ExerciseTechniqueGuide {
  vietnameseName: string;
  formCues: [string, string, string]; // 3 khẩu quyết cốt tử
  commonMistake: string;             // Lỗi sai phổ biến
  detailedStepsVi: string[];         // Toàn bộ hướng dẫn từng bước 100% Tiếng Việt
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

  // 1. Incline Bench Press (Đẩy ngực trên)
  if (nameLower.includes('incline') && (nameLower.includes('press') || muscleLower.includes('chest'))) {
    const isDumbbell = eqLower.includes('dumbbell') || nameLower.includes('dumbbell');
    return {
      vietnameseName: isDumbbell ? 'Đẩy Ngực Trên Tạ Đơn (Incline DB Press)' : 'Đẩy Ngực Trên Đòn Ngang (Incline Barbell Press)',
      formCues: [
        'Độ dốc ghế 30° - 45°: Không chỉnh ghế quá dốc đứng sẽ bị ăn nhiều vào vai trước thay vì ngực trên.',
        'Khóa bả vai & mở ngực: Kéo 2 xương bả vai ra sau và áp chặt lưng trên vào đệm ghế suốt bài tập.',
        'Quỹ đạo đẩy parabol: Hạ tạ chạm nhẹ phần ngực trên, đẩy tạ lên hơi hướng vào nhau nhưng không chạm tạ.'
      ],
      commonMistake: 'Chỉnh ghế dốc quá cao (>60°) hoặc ưỡn cong lưng dưới nhấc mông để biến thành đẩy ngực phẳng.',
      detailedStepsVi: [
        'Bước 1: Chỉnh độ dốc ghế khoảng 30° đến 45°. Ngồi vững chắc, 2 bàn chân đặt phẳng trên mặt sàn để làm trụ.',
        'Bước 2: Cầm tạ đưa lên trước ngực trên. Kéo 2 xương bả vai ra sau và ghì chặt xuống đệm ghế.',
        'Bước 3: Hít sâu một hơi căng lồng ngực và gồng cơ bụng. Từ từ hạ tạ xuống có kiểm soát trong 2-3 giây về hai bên ngực trên (cùi chỏ mở góc ~60° so với thân người).',
        'Bước 4: Dùng lực cơ ngực trên đẩy tạ mạnh mẽ lên cao theo hình vòng cung nhẹ đồng thời thở ra dứt khoát.',
        'Bước 5: Dừng lại 1 nhịp ở đỉnh (giữ cùi chỏ hơi cong nhẹ, không khóa cứng khớp) rồi lặp lại động tác.'
      ],
      startingWeightGuide: {
        recommendedWeightKg: isDumbbell ? 6.0 : 20.0,
        recommendedUnit: isDumbbell ? 'kg/bên' : 'kg',
        targetReps: '10 - 12 reps',
        targetRpe: 'RPE 6 - 7',
        advice: isDumbbell 
          ? 'Nên bắt đầu với tạ đơn 5kg - 7kg mỗi bên để kiểm soát thăng bằng cổ tay trên ghế dốc.' 
          : 'Dùng thanh đòn rỗng 20kg để tập làm quen cảm giác đẩy nghiêng.'
      }
    };
  }

  // 2. Bench Press / Ngực phẳng
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
      detailedStepsVi: [
        'Bước 1: Nằm ngửa trên ghế phẳng, 2 mắt gióng thẳng đứng dưới thanh đòn. Đặt 2 bàn chân phẳng trên sàn.',
        'Bước 2: Kéo 2 xương bả vai ra sau và ghì chặt xuống ghế. Nắm đòn rộng hơn vai một chút (khuỷu tay tạo góc 90° khi hạ tạ).',
        'Bước 3: Hít sâu căng lồng ngực, gồng cứng cơ bụng. Nhấc đòn ra khỏi giá và giữ thăng bằng ngay trên giữa ngực.',
        'Bước 4: Hạ thanh đòn từ từ có kiểm soát trong 2-3 giây chạm nhẹ vào phần giữa ngực/dưới xương ức.',
        'Bước 5: Dùng lực cơ ngực đẩy mạnh đòn thẳng lên vị trí ban đầu đồng thời thở ra dứt khoát. Giữ khuỷu tay hơi cong nhẹ ở đỉnh.'
      ],
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

  // 3. Leg Press (Đạp đùi máy)
  if (nameLower.includes('leg press')) {
    return {
      vietnameseName: 'Đạp Đùi Bằng Máy (Leg Press)',
      formCues: [
        'Áp sát mông và lưng: Giữ toàn bộ lưng dưới và mông luôn dính chặt vào đệm tựa, không để mông bị nhấc lên.',
        'Không khóa khớp gối: Khi đẩy bàn đạp lên cao nhất, luôn giữ đầu gối hơi chùng nhẹ, tuyệt đối không khóa thẳng khớp.',
        'Độ rộng chân: Đặt 2 bàn chân rộng bằng vai ở giữa bàn đạp, mũi chân hơi chếch ngoài 15°.'
      ],
      commonMistake: 'Hạ bàn đạp xuống quá sâu làm mông bị cuộn tròn nhấc khỏi ghế gây đè nặng lên đốt sống thắt lưng.',
      detailedStepsVi: [
        'Bước 1: Ngồi vào máy, áp lưng và mông sát vào đệm tựa. Đặt 2 bàn chân lên bàn đạp rộng bằng vai, mũi chân xoay nhẹ ra ngoài 15°.',
        'Bước 2: Hai tay nắm chặt tay cầm an toàn bên cạnh đùi để cố định thân người.',
        'Bước 3: Dùng lực bàn chân đẩy bàn đạp lên để gạt mở chốt khóa an toàn. Giữ đầu gối hơi cong nhẹ ở đỉnh.',
        'Bước 4: Hít sâu gồng cơ bụng, từ từ hạ bàn đạp xuống có kiểm soát trong 2-3 giây cho đến khi đùi và cẳng chân tạo góc khoảng 90°.',
        'Bước 5: Dồn lực vào gót chân và giữa lòng bàn chân đạp mạnh bàn đạp đẩy lên vị trí ban đầu đồng thời thở ra.'
      ],
      startingWeightGuide: {
        recommendedWeightKg: 40.0,
        recommendedUnit: 'kg',
        targetReps: '10 - 12 reps',
        targetRpe: 'RPE 6 - 7',
        advice: 'Bắt đầu với bàn đạp không hoặc lắp 2 bánh tạ 10kg mỗi bên (tổng 20-40kg) để học kiểm soát biên độ gối.'
      }
    };
  }

  // 4. Squat (Gánh tạ ngồi xổm)
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
      detailedStepsVi: [
        'Bước 1: Đặt đòn tạ lên cơ cầu vai (hoặc ôm quả tạ trước ngực nếu tập Goblet). Đứng hai chân rộng bằng vai, mũi chân mở 15°-30°.',
        'Bước 2: Hít sâu một hơi căng lồng ngực và nén chặt cơ bụng (Valsalva core brace).',
        'Bước 3: Mở gối sang hai bên và đẩy mông ra sau hạ thấp thân người xuống chậm rãi có kiểm soát.',
        'Bước 4: Ngồi xuống đến khi đùi song song hoặc thấp hơn mặt sàn một chút (giữ lưng luôn thẳng, ngực ngẩng cao).',
        'Bước 5: Dồn lực toàn bộ bàn chân đạp mạnh xuống sàn đẩy người đứng thẳng dậy đồng thời thở ra dứt khoát.'
      ],
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

  // 5. Romanian Deadlift (RDL)
  if (nameLower.includes('romanian') || nameLower.includes('rdl') || (nameLower.includes('deadlift') && (nameLower.includes('stiff') || nameLower.includes('dumbbell')))) {
    return {
      vietnameseName: 'Gập Hông Đùi Sau (Romanian Deadlift - RDL)',
      formCues: [
        'Bản lề hông (Hip Hinge): Đẩy mông ra phía sau tối đa như thể bạn đang dùng mông đóng cánh cửa.',
        'Đầu gối hơi chùng cố định: Đầu gối chỉ hơi chùng nhẹ 15° và giữ nguyên góc này, không gập gối thành Squat.',
        'Tạ trượt sát chân: Giữ thanh đòn hoặc tạ đơn luôn áp sát vào đùi và cẳng chân suốt chuyển động.'
      ],
      commonMistake: 'Cong lưng dưới khi hạ tạ hoặc ngồi xổm gập gối biến bài tập thành Squat.',
      detailedStepsVi: [
        'Bước 1: Đứng thẳng, hai chân rộng bằng hông, hai tay cầm tạ sát đùi trước. Khóa khớp vai ra sau, ngực mở rộng.',
        'Bước 2: Chùng nhẹ đầu gối (giữ cố định góc chùng này suốt bài). Hít sâu gồng chặt cơ bụng.',
        'Bước 3: Bắt đầu đẩy mông ra phía sau tối đa, nghiêng thân người về phía trước, trượt tạ dọc theo cẳng chân xuống dưới đầu gối.',
        'Bước 4: Hạ tạ cho đến khi cảm thấy cơ đùi sau và mông căng hết cỡ (thân người nghiêng góc khoảng 45° so với sàn).',
        'Bước 5: Siết cơ mông và đùi sau đẩy hông về phía trước để đứng thẳng dậy đồng thời thở ra dứt khoát.'
      ],
      startingWeightGuide: {
        recommendedWeightKg: 20.0,
        recommendedUnit: 'kg',
        targetReps: '10 - 12 reps',
        targetRpe: 'RPE 6 - 7',
        advice: 'Tập với đòn rỗng 20kg hoặc 2 quả tạ đơn 6-8kg mỗi bên để thuần thục chuyển động đẩy mông ra sau.'
      }
    };
  }

  // 6. Conventional Deadlift
  if (nameLower.includes('deadlift')) {
    return {
      vietnameseName: 'Kéo Tạ Đòn Truyền Thống (Barbell Deadlift)',
      formCues: [
        'Khoảng cách đòn: Thanh đòn luôn sát cẳng chân, cách ống đồng khoảng 2-3cm.',
        'Khóa lưng thẳng: Siết xô, ưỡn ngực, giữ cột sống thẳng tuyệt đối từ cổ đến thắt lưng.',
        'Đạp sàn bằng chân: Dùng lực bàn chân đạp mạnh xuống sàn để nhấc tạ, không kéo giật bằng lưng.'
      ],
      commonMistake: 'Cong tôm lưng dưới khi kéo tạ lên - nguy cơ thoát vị đĩa đệm rất cao.',
      detailedStepsVi: [
        'Bước 1: Đứng hai chân rộng bằng hông, thanh đòn cắt ngang giữa bàn chân (cách cẳng chân khoảng 2-3cm).',
        'Bước 2: Gập hông đẩy mông ra sau, cúi xuống nắm chặt thanh đòn (hai tay rộng bằng vai, nằm ngoài hai chân).',
        'Bước 3: Hạ mông xuống cho đến khi cẳng chân chạm nhẹ vào đòn, siết chặt cơ xô, ưỡn ngực kéo thẳng cột sống.',
        'Bước 4: Hít sâu nén chặt lồng ngực gồng bụng, dồn lực toàn bàn chân đạp mạnh xuống sàn để đẩy người và tạ lên cùng lúc.',
        'Bước 5: Đứng thẳng khóa hông (không ngửa lưng ra sau), thở ra. Sau đó đẩy hông ra sau hạ tạ chạm sàn có kiểm soát.'
      ],
      startingWeightGuide: {
        recommendedWeightKg: 30.0,
        recommendedUnit: 'kg',
        targetReps: '6 - 8 reps',
        targetRpe: 'RPE 6',
        advice: 'Lắp 2 bánh tạ nhẹ (mỗi bên 5kg vào đòn 20kg = 30kg) để tạ có độ cao chuẩn so với mặt sàn.'
      }
    };
  }

  // 7. Lat Pulldown / Pullups / Kéo xô
  if (nameLower.includes('pulldown') || nameLower.includes('pull-up') || nameLower.includes('pullup') || nameLower.includes('chin-up')) {
    const isPullup = nameLower.includes('pull-up') || nameLower.includes('pullup') || nameLower.includes('chin-up');
    return {
      vietnameseName: isPullup ? 'Hít Xà Đơn (Pull-ups)' : 'Kéo Xô Rộng Tay Bằng Máy (Lat Pulldown)',
      formCues: [
        'Kéo cùi chỏ về hông: Nghĩ về việc ép cùi chỏ xuống sườn thay vì dùng ngón tay giật tạ.',
        'Ngực ưỡn nhẹ: Hơi ngả người về sau 10°- 15°, kéo thanh xà chạm sát xương quai xanh.',
        'Nhả tạ có kiểm soát: Giữ tạ 1s ở đáy, thả lên chậm rãi trong 2-3s để kéo dãn cơ xô.'
      ],
      commonMistake: 'Ngả người quá sâu ra sau rồi lấy đà giật tạ bằng lưng dưới.',
      detailedStepsVi: [
        'Bước 1: Điều chỉnh đệm gối tì vừa khít vào đùi để thân người không bị nhấc bổng khi kéo nặng.',
        'Bước 2: Nắm thanh xà rộng hơn vai một chút (lòng bàn tay hướng ra trước), ngồi vững và khóa đùi dưới đệm.',
        'Bước 3: Hơi ưỡn ngực, nghiêng thân người nhẹ về sau khoảng 10° - 15°.',
        'Bước 4: Hít sâu, tập trung kéo hai cùi chỏ ép mạnh xuống sườn và ra sau cho đến khi thanh xà chạm sát xương quai xanh. Siết chặt cơ xô trong 1 giây.',
        'Bước 5: Từ từ nhả xà ngược lên trên trong 2-3 giây có kiểm soát cho đến khi cơ xô giãn căng hoàn toàn đồng thời thở ra.'
      ],
      startingWeightGuide: {
        recommendedWeightKg: 20.0,
        recommendedUnit: 'nấc pin',
        targetReps: '10 - 12 reps',
        targetRpe: 'RPE 7',
        advice: 'Chọn mức tạ 15-20kg (nấc 3 hoặc 4 trên máy) để cảm nhận cơ xô co bóp rõ ràng.'
      }
    };
  }

  // 8. Overhead / Shoulder Press / Đẩy vai
  if (nameLower.includes('shoulder press') || nameLower.includes('overhead') || nameLower.includes('military')) {
    const isDumbbell = eqLower.includes('dumbbell') || nameLower.includes('dumbbell');
    return {
      vietnameseName: isDumbbell ? 'Đẩy Vai Tạ Đơn (Dumbbell Shoulder Press)' : 'Đẩy Vai Đòn Ngang (Overhead Press)',
      formCues: [
        'Cố định thân người: Siết chặt mông và cơ bụng để không bị võng lưng dưới.',
        'Góc cùi chỏ chếch nhẹ 30°: Không mở cùi chỏ thẳng tắp sang 2 bên để bảo vệ khớp xoay vai.',
        'Đẩy thẳng trục: Đẩy tạ theo đường thẳng hướng thẳng lên đỉnh đầu.'
      ],
      commonMistake: 'Ưỡn ngực quá mức và ưỡn cong lưng dưới biến bài đẩy vai thành đẩy ngực trên.',
      detailedStepsVi: [
        'Bước 1: Ngồi trên ghế tựa lưng dựng đứng hoặc đứng vững hai chân rộng bằng vai. Đặt 2 quả tạ đơn ngang tầm tai.',
        'Bước 2: Lòng bàn tay hướng về phía trước, cùi chỏ hơi chếch vào trong góc 30° so với thân người (mặt phẳng bả vai).',
        'Bước 3: Gồng chặt cơ bụng và cơ mông để cố định cột sống. Hít sâu.',
        'Bước 4: Dùng lực cơ vai đẩy tạ thẳng lên trên đỉnh đầu. Dừng lại khi hai cánh tay duỗi thẳng (không để 2 quả tạ va vào nhau).',
        'Bước 5: Hạ tạ xuống từ từ trong 2-3 giây có kiểm soát về ngang tai đồng thời thở ra.'
      ],
      startingWeightGuide: {
        recommendedWeightKg: isDumbbell ? 5.0 : 15.0,
        recommendedUnit: isDumbbell ? 'kg/bên' : 'kg',
        targetReps: '10 - 12 reps',
        targetRpe: 'RPE 6 - 7',
        advice: 'Tạ đơn 4kg - 6kg mỗi bên là mức chuẩn nhất để người mới kiểm soát khớp vai an toàn.'
      }
    };
  }

  // 9. Row / Chèo xô
  if (nameLower.includes('row')) {
    const isDumbbell = eqLower.includes('dumbbell') || nameLower.includes('dumbbell');
    return {
      vietnameseName: isDumbbell ? 'Chèo Tạ Đơn 1 Tay (One-arm DB Row)' : 'Kéo Tạ Đòn Gập Người (Bent Over Barbell Row)',
      formCues: [
        'Gập hông 45°: Đẩy mông ra sau, giữ lưng thẳng song song hoặc chếch 45° so với sàn.',
        'Kéo cùi chỏ về túi quần: Đưa tạ sát người và siết chặt cơ lưng trên khi kết thúc.',
        'Cổ thẳng tự nhiên: Nhìn chéo xuống sàn 1-2 mét, không ngửa cổ nhìn thẳng lên gương.'
      ],
      commonMistake: 'Đung đưa thân trên lấy đà kéo tạ thay vì dùng cơ lưng kéo.',
      detailedStepsVi: [
        'Bước 1: Gập người tại khớp hông một góc 45° so với mặt đất, lưng thẳng tuyệt đối, ngực ưỡn nhẹ, mắt nhìn chéo xuống sàn.',
        'Bước 2: Tay cầm tạ thẳng tay tự nhiên dưới vai, lòng bàn tay hướng vào nhau hoặc hướng ra sau.',
        'Bước 3: Hít sâu gồng bụng, dùng cơ lưng kéo cùi chỏ thẳng ra sau về hướng túi quần. Giữ tạ trượt sát thân người.',
        'Bước 4: Ép chặt hai xương bả vai vào nhau ở đỉnh chuyển động và giữ 1 giây để tối đa hóa kích thích cơ lưng.',
        'Bước 5: Hạ tạ xuống chậm rãi trong 2-3 giây có kiểm soát đồng thời thở ra.'
      ],
      startingWeightGuide: {
        recommendedWeightKg: isDumbbell ? 8.0 : 20.0,
        recommendedUnit: isDumbbell ? 'kg/bên' : 'kg',
        targetReps: '10 - 12 reps',
        targetRpe: 'RPE 7',
        advice: 'Dùng tạ đơn 6-8kg và kê 1 đầu gối lên ghế phẳng sẽ giúp cô lập lưng tốt và đỡ mỏi cột sống.'
      }
    };
  }

  // 10. Bicep Curl / Tay trước
  if (nameLower.includes('curl')) {
    return {
      vietnameseName: 'Cuộn Bắp Tay Trước (Bicep Curl)',
      formCues: [
        'Cùi chỏ khóa cố định: Ép sát cùi chỏ 2 bên mạng sườn, không đưa cùi chỏ ra trước khi cuộn.',
        'Vặn cổ tay nhẹ: Khi nâng tạ lên, ngửa lòng bàn tay hướng lên trần để siết đỉnh cơ bắp tay.',
        'Hạ tạ chậm: Dành 2-3 giây để duỗi thẳng tay, không để tạ rơi tự do.'
      ],
      commonMistake: 'Đung đưa người và ưỡn lưng lấy đà để quăng tạ lên.',
      detailedStepsVi: [
        'Bước 1: Đứng thẳng, hai chân vững chắc, hai tay cầm tạ xuôi theo người, lòng bàn tay hướng ra trước.',
        'Bước 2: Ép chặt hai cùi chỏ sát mạng sườn, giữ lưng thẳng, không được lấy đà giật người.',
        'Bước 3: Hít sâu, dùng cơ bắp tay trước cuộn tạ lên phía trước ngực.',
        'Bước 4: Giữ tạ và siết cứng bắp tay trong 1 giây ở vị trí cao nhất (ngang ngực).',
        'Bước 5: Hạ tạ xuống từ từ trong 2-3 giây cho đến khi tay duỗi thẳng hoàn toàn đồng thời thở ra.'
      ],
      startingWeightGuide: {
        recommendedWeightKg: 5.0,
        recommendedUnit: 'kg/bên',
        targetReps: '10 - 12 reps',
        targetRpe: 'RPE 7 - 8',
        advice: 'Tạ đơn 4kg - 6kg mỗi bên. Nếu thấy người phải đung đưa thì lập tức hạ xuống 4kg.'
      }
    };
  }

  // 11. Triceps / Tay sau
  if (nameLower.includes('triceps') || nameLower.includes('pushdown') || nameLower.includes('dip')) {
    return {
      vietnameseName: 'Nhấn Cáp Tay Sau (Triceps Pushdown)',
      formCues: [
        'Cùi chỏ bất động: Giữ cùi chỏ ép sát thân, khớp cùi chỏ là trục quay duy nhất.',
        'Duỗi thẳng hết biên độ: Nhấn tạ xuống dưới cùng và siết cứng cơ tam đầu trong 1 giây.',
        'Kiểm soát chiều lên: Khi trả tạ lên, không để cùi chỏ bị kéo giật lên trên.'
      ],
      commonMistake: 'Đè cả trọng lượng cơ thể lên thanh đòn để nhấn tạ xuống.',
      detailedStepsVi: [
        'Bước 1: Đứng hơi gập nhẹ hông về trước, hai chân vững chắc. Nắm thanh đòn hoặc dây thừng ngang ngực.',
        'Bước 2: Ép chặt hai cùi chỏ sát vào hai bên mạng sườn. Cùi chỏ sẽ là trục xoay duy nhất và giữ cố định tuyệt đối trong suốt bài tập.',
        'Bước 3: Hít sâu, dùng cơ tam đầu (tay sau) nhấn tạ đi xuống cho đến khi cánh tay duỗi thẳng hoàn toàn.',
        'Bước 4: Siết cứng cơ tay sau ở điểm đáy trong 1 giây (nếu dùng dây thừng thì tách nhẹ hai đầu dây ra hai bên ngoài hông).',
        'Bước 5: Từ từ trả tay lên vị trí ngang ngực (góc 90°) có kiểm soát rồi thở ra.'
      ],
      startingWeightGuide: {
        recommendedWeightKg: 10.0,
        recommendedUnit: 'nấc pin',
        targetReps: '12 - 15 reps',
        targetRpe: 'RPE 7',
        advice: 'Chọn mức tạ 10kg trên dây cáp. Bài này cơ tay sau thích ứng rất nhanh với số lần 12-15 reps.'
      }
    };
  }

  // 12. Lateral Raise / Bay vai bên
  if (nameLower.includes('lateral raise') || nameLower.includes('side raise')) {
    return {
      vietnameseName: 'Bay Tạ Sang Hai Bên (Side Lateral Raise)',
      formCues: [
        'Nâng cùi chỏ lên trước: Tưởng tượng đang rót nước từ bình, cùi chỏ luôn cao hơn hoặc ngang cổ tay.',
        'Hơi đưa tạ về trước 15°: Nâng tạ trong mặt phẳng bả vai (Scapular plane), không nâng thẳng ngang hông.',
        'Không nhún vai: Giữ cầu vai thả lỏng, chỉ dùng cơ vai giữa để nhấc tạ.'
      ],
      commonMistake: 'Cầm tạ quá nặng rồi nhún vai giật người, chỉ tập vào cơ cầu vai (Traps).',
      detailedStepsVi: [
        'Bước 1: Đứng thẳng hoặc hơi nghiêng người về trước 5°, hai chân rộng bằng vai, cầm 2 quả tạ đơn nhẹ đặt ở trước đùi.',
        'Bước 2: Hơi cong nhẹ cùi chỏ (khoảng 10°- 15°) và khóa góc này cố định suốt bài tập.',
        'Bước 3: Hít sâu, dùng cơ vai giữa nâng tạ sang hai bên và hơi hướng về trước 15° (mặt phẳng bả vai) cho đến khi cánh tay song song với mặt sàn.',
        'Bước 4: Cùi chỏ luôn cao hơn hoặc ngang cổ tay ở đỉnh (tưởng tượng như đang rót nước từ hai bình). Không nhún cơ cầu vai.',
        'Bước 5: Hạ tạ xuống chậm rãi trong 2-3 giây để cơ vai chịu lực kháng đồng thời thở ra.'
      ],
      startingWeightGuide: {
        recommendedWeightKg: 3.0,
        recommendedUnit: 'kg/bên',
        targetReps: '12 - 15 reps',
        targetRpe: 'RPE 7 - 8',
        advice: 'Bắt đầu với tạ đơn 2kg - 4kg. Cơ vai bên rất nhỏ, tập tạ nhẹ với kỹ thuật chuẩn sẽ to nhanh gấp 3 lần.'
      }
    };
  }

  // 13. Face Pull (Kéo cáp mặt)
  if (nameLower.includes('face pull')) {
    return {
      vietnameseName: 'Kéo Cáp Mặt (Face Pull - Khớp Xoay Vai)',
      formCues: [
        'Kéo về ngang mắt/trán: Kéo hai đầu dây thừng thẳng về phía trán hoặc mắt, không kéo xuống ngực.',
        'Xoay cùi chỏ ra ngoài lên cao: Cùi chỏ luôn giữ cao hơn cổ tay trong toàn bộ chuyển động.',
        'Tách hai tay rộng ra: Tách hai đầu dây thừng sang hai bên để tối đa hóa chuyển động xoay ngoài của khớp vai.'
      ],
      commonMistake: 'Lấy đà ngả người ra sau và kéo dây thừng xuống ngang ngực biến thành bài kéo lưng.',
      detailedStepsVi: [
        'Bước 1: Chỉnh ròng rọc cáp ngang tầm mắt hoặc ngực trên, gắn phụ kiện dây thừng (Rope).',
        'Bước 2: Cầm hai đầu dây thừng với ngón tay cái hướng về phía sau, lùi lại 1 bước để tạo lực căng cho dây cáp.',
        'Bước 3: Hít sâu gồng cơ bụng, kéo dây thừng thẳng về phía trán/mắt đồng thời tách hai bàn tay sang hai bên.',
        'Bước 4: Siết chặt cơ vai sau và cơ lưng trên trong 1 giây ở đỉnh (cùi chỏ mở cao hơn cổ tay).',
        'Bước 5: Trả tạ về phía trước chậm rãi có kiểm soát trong 2 giây rồi thở ra.'
      ],
      startingWeightGuide: {
        recommendedWeightKg: 15.0,
        recommendedUnit: 'nấc pin',
        targetReps: '12 - 15 reps',
        targetRpe: 'RPE 7',
        advice: 'Tập nhẹ 10-15kg để kích hoạt cơ vai sau và cân bằng khớp vai sau các bài đẩy ngực nặng.'
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
    detailedStepsVi: [
      'Bước 1: Chuẩn bị tư thế đứng hoặc ngồi vững chắc, điều chỉnh mức tạ phù hợp với khả năng.',
      'Bước 2: Hít sâu một hơi căng lồng ngực và gồng chặt cơ bụng (Core) để khóa cố định cột sống.',
      'Bước 3: Thực hiện chuyển động đẩy/kéo có kiểm soát, tập trung suy nghĩ vào nhóm cơ bắp mục tiêu (Mind-Muscle Connection).',
      'Bước 4: Giữ lại 1 giây ở điểm co cơ tối đa để tối ưu kích thích tăng trưởng sợi cơ.',
      'Bước 5: Hạ tạ về tư thế ban đầu chậm rãi trong 2-3 giây đồng thời thở ra dứt khoát.'
    ],
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
