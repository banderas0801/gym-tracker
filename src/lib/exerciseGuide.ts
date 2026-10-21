export interface ExerciseTechniqueGuide {
  vietnameseName: string;
  formCues: [string, string, string]; // 3 khẩu quyết cốt tử
  commonMistake: string;             // Lỗi sai phổ biến
  detailedStepsVi?: string[];        // Hướng dẫn từng bước đặc thù
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
  const idLower = (exerciseId || '').toLowerCase();
  const eqLower = (equipment || '').toLowerCase();
  const muscleLower = (primaryMuscle || '').toLowerCase();
  const searchKey = `${idLower} ${nameLower}`;

  // =========================================================================
  // 1. CHÂN & ĐÙI: NẰM MÓC ĐÙI SAU (LEG CURL)
  // Ưu tiên kiểm tra trước "curl" bắp tay để tránh bắt nhầm thành bicep curl!
  // =========================================================================
  if (searchKey.includes('leg curl') || searchKey.includes('leg_curl') || searchKey.includes('móc đùi') || (searchKey.includes('curl') && muscleLower.includes('hamstring'))) {
    return {
      vietnameseName: 'Nằm Móc Đùi Sau Bằng Máy (Lying Leg Curls)',
      formCues: [
        'Tì hông sát đệm: Ép chặt hông và xương mu xuống đệm, không nhấc mông lên khi móc tạ.',
        'Đệm tì sau mắt cá chân: Đặt thanh đệm ngay phía trên gót chân/gân Achilles, không để trượt lên bắp chuối.',
        'Móc dứt khoát - hạ chậm: Móc tạ lên chạm gần mông trong 1s, hạ tạ duỗi chân chậm trong 2-3s có kiểm soát.'
      ],
      commonMistake: 'Nhấc mông và cong võng thắt lưng để lấy đà móc tạ nặng gây áp lực nguy hiểm lên cột sống.',
      detailedStepsVi: [
        'Bước 1: Nằm sấp lên máy tập, điều chỉnh thanh đệm tròn tì vừa vặn ngay phía sau mắt cá chân.',
        'Bước 2: Hai tay nắm chặt tay cầm phía trước, ép chặt hông và xương mu xuống mặt đệm.',
        'Bước 3: Hít sâu, dùng cơ đùi sau móc mạnh cẳng chân lên phía mông cho đến khi cơ đùi sau co bóp tối đa.',
        'Bước 4: Giữ căng cơ đùi sau 1 nhịp ở vị trí cao nhất.',
        'Bước 5: Từ từ duỗi chân hạ tạ xuống trong 2-3 giây có kiểm soát (không để tạ chạm đáy thả lỏng) đồng thời thở ra.'
      ],
      startingWeightGuide: {
        recommendedWeightKg: 15.0,
        recommendedUnit: 'nấc pin',
        targetReps: '10 - 12 reps',
        targetRpe: 'RPE 7',
        advice: 'Bắt đầu với 10-15kg (nấc 2-3 trên máy) để làm quen cảm giác siết cơ đùi sau mà không bị nhấc mông.'
      }
    };
  }

  // =========================================================================
  // 2. CHÂN & ĐÙI: ĐÁ ĐÙI TRƯỚC (LEG EXTENSION)
  // =========================================================================
  if (searchKey.includes('leg extension') || searchKey.includes('leg_extension') || searchKey.includes('đá đùi')) {
    return {
      vietnameseName: 'Đá Đùi Trước Bằng Máy (Leg Extensions)',
      formCues: [
        'Lưng tựa sát ghế: Chỉnh tựa lưng sao cho khớp gối thẳng hàng với trục quay tròn của máy.',
        'Đệm tì trên cổ chân: Thanh đệm tròn đặt ngay trên mu bàn chân/cổ chân, mũi chân hướng thẳng lên trần.',
        'Khóa đỉnh co cơ: Đá tạ lên và siết cứng cơ đùi trước trong 1 giây ở đỉnh, hạ xuống chậm trong 2s.'
      ],
      commonMistake: 'Dùng đà giật mạnh và để tạ rơi sập xuống làm giật khớp gối đột ngột.',
      detailedStepsVi: [
        'Bước 1: Ngồi vào máy, chỉnh tựa lưng áp sát lưng, khớp gối trùng với trục quay tròn của máy.',
        'Bước 2: Đặt cẳng chân sau đệm tròn (đệm tì ở phần thấp nhất của cẳng chân ngay trên cổ chân).',
        'Bước 3: Nắm chặt tay cầm hai bên hông để giữ mông không bị nhấc khỏi đệm ngồi.',
        'Bước 4: Hít sâu, dùng cơ tứ đầu (đùi trước) đá cẳng chân lên cao cho đến khi chân duỗi thẳng gần như song song sàn.',
        'Bước 5: Siết cứng đùi trước trong 1 giây ở đỉnh rồi từ từ hạ xuống có kiểm soát trong 2-3 giây đồng thời thở ra.'
      ],
      startingWeightGuide: {
        recommendedWeightKg: 20.0,
        recommendedUnit: 'nấc pin',
        targetReps: '12 - 15 reps',
        targetRpe: 'RPE 7',
        advice: 'Tập mức tạ 15-20kg để tập trung siết cứng đùi trước ở điểm cao nhất trong 1 giây.'
      }
    };
  }

  // =========================================================================
  // 3. CHÂN & ĐÙI: BẮP CHUỐI (CALF RAISE / CALF PRESS)
  // =========================================================================
  if (searchKey.includes('calf') || searchKey.includes('bắp chân') || searchKey.includes('bắp chuối')) {
    return {
      vietnameseName: 'Nhón / Đạp Bắp Chuối (Calf Press / Calf Raise)',
      formCues: [
        'Đặt mũi chân 1/3 bàn chân: Chỉ đặt phần đệm trước của bàn chân lên gờ bàn đạp, gót chân thả tự do ngoài không trung.',
        'Nhón cao hết cỡ: Nhón mũi chân đẩy gót chân lên cao nhất có thể và giữ siết cơ bắp chuối 1-2s.',
        'Hạ gót sâu để kéo dãn: Hạ gót chân xuống thấp hơn mặt gờ để cơ bắp chuối được kéo dãn tối đa trước lần đạp tiếp theo.'
      ],
      commonMistake: 'Nhún gót bập bênh liên tục theo quán tính mà không kéo dãn đáy và siết đỉnh.',
      detailedStepsVi: [
        'Bước 1: Đặt 1/3 đệm trước của bàn chân lên bàn đạp máy Leg Press hoặc bục đứng nhón bắp chân.',
        'Bước 2: Giữ đầu gối gần như thẳng (chỉ hơi chùng 5° để bảo vệ khớp gối, không co duỗi gối trong bài này).',
        'Bước 3: Hít sâu, hạ gót chân xuống sâu tối đa có kiểm soát để kéo dãn toàn bộ gân gót và cơ bắp chuối trong 2 giây.',
        'Bước 4: Dồn lực vào các ngón chân nhón mạnh mẽ đẩy gót chân lên cao hết biên độ có thể.',
        'Bước 5: Siết cứng cơ bắp chuối ở điểm cao nhất trong 1-2 giây rồi thở ra dứt khoát.'
      ],
      startingWeightGuide: {
        recommendedWeightKg: 30.0,
        recommendedUnit: 'kg',
        targetReps: '12 - 15 reps',
        targetRpe: 'RPE 8',
        advice: 'Bắp chuối là nhóm cơ chịu tải cao hàng ngày, nên tập với số reps 12-15 và siết đỉnh 2 giây.'
      }
    };
  }

  // =========================================================================
  // 4. CHÂN & HÔNG: ÉP ĐÙI TRONG (ADDUCTOR / CABLE HIP ADDUCTION)
  // =========================================================================
  if (searchKey.includes('adductor') || searchKey.includes('adduction') || searchKey.includes('đùi trong')) {
    return {
      vietnameseName: 'Ép Đùi Trong Máy Tạ Khối (Inner Thigh Machine / Adductor)',
      formCues: [
        'Lưng áp sát ghế: Ngồi thẳng lưng, hai tay nắm chặt tay cầm hai bên sườn.',
        'Ép dứt khoát - giữ đỉnh 1s: Dùng cơ đùi trong ép hai chân khép sát lại với nhau, giữ 1 nhịp co cơ.',
        'Mở chân có kiểm soát: Trả chân mở ra từ từ trong 2-3s đến biên độ thoải mái, không để tạ va chạm mạnh.'
      ],
      commonMistake: 'Dùng đà quăng chân hoặc để tạ kéo giật mở háng quá rộng gây nguy cơ rách cơ khép đùi.',
      detailedStepsVi: [
        'Bước 1: Ngồi vào máy, chỉnh cần gạt mở rộng hai đệm đùi ra ngoài ở biên độ vừa sức với khớp háng của bạn.',
        'Bước 2: Áp sát lưng vào đệm tựa, hai tay nắm chặt tay cầm hai bên để cố định thân người.',
        'Bước 3: Hít sâu gồng bụng, dùng sức mạnh nhóm cơ khép đùi trong ép hai chân lại gần nhau cho đến khi chạm nhau.',
        'Bước 4: Siết chặt cơ đùi trong trong 1 giây ở điểm chạm.',
        'Bước 5: Từ từ mở hai chân ra ngoài trong 2-3 giây có kiểm soát cho đến khi đùi trong căng vừa phải đồng thời thở ra.'
      ],
      startingWeightGuide: {
        recommendedWeightKg: 20.0,
        recommendedUnit: 'nấc pin',
        targetReps: '12 - 15 reps',
        targetRpe: 'RPE 7',
        advice: 'Bắt đầu nhẹ 15-20kg để khớp háng dẻo dai và cơ khép đùi thích nghi dần.'
      }
    };
  }

  // =========================================================================
  // 5. CHÂN & HÔNG: BANH HÔNG MÔNG NGOÀI (ABDUCTOR / THIGH ABDUCTOR)
  // =========================================================================
  if (searchKey.includes('abductor') || searchKey.includes('abduction') || searchKey.includes('mông ngoài') || searchKey.includes('hông mông')) {
    return {
      vietnameseName: 'Banh Hông Mông Ngoài Máy Tạ Khối (Outer Thigh Machine / Abductor)',
      formCues: [
        'Hơi nghiêng người về trước 15°: Đổ nhẹ thân trên về trước giúp cơ mông nhỡ (Gluteus Medius) kích hoạt sâu hơn.',
        'Banh chân tối đa: Dùng lực cạnh ngoài đùi và hông đẩy mở hai chân sang hai bên rộng nhất có thể.',
        'Giữ căng 1s ở đỉnh: Dừng lại 1 nhịp khi hai chân mở rộng nhất rồi mới khép lại chậm rãi.'
      ],
      commonMistake: 'Tập quá nhanh và để bánh tạ rơi tự do đập lách cách làm mất áp lực liên tục lên cơ mông.',
      detailedStepsVi: [
        'Bước 1: Ngồi vào máy, chỉnh hai đệm tì vào mặt ngoài của đầu gối/đùi.',
        'Bước 2: Hai bàn chân đặt vững trên giá đỡ, lưng thẳng hoặc hơi cúi nhẹ thân trên về trước.',
        'Bước 3: Hít sâu, dùng sức cơ mông ngoài đẩy mở rộng hai chân sang hai bên tối đa.',
        'Bước 4: Giữ nguyên vị trí mở rộng trong 1 giây để cảm nhận cơ mông co thắt căng cứng.',
        'Bước 5: Khép chân lại từ từ trong 2-3 giây có kiểm soát đồng thời thở ra.'
      ],
      startingWeightGuide: {
        recommendedWeightKg: 20.0,
        recommendedUnit: 'nấc pin',
        targetReps: '12 - 15 reps',
        targetRpe: 'RPE 7',
        advice: 'Bài này rất hiệu quả để làm đầy hõm mông và thon gọn đùi ngoài.'
      }
    };
  }

  // =========================================================================
  // 6. CHÂN & ĐÙI: CHÙNG CHÂN BƯỚC (LUNGES)
  // =========================================================================
  if (searchKey.includes('lunge')) {
    return {
      vietnameseName: 'Bước Chùng Chân Đổi Chân (Dumbbell Lunges)',
      formCues: [
        'Góc 90° ở cả 2 gối: Khi hạ chân xuống, cả gối trước và gối sau đều tạo góc vuông khoảng 90°.',
        'Đầu gối không vượt quá mũi chân: Giữ cẳng chân trước gần như vuông góc với sàn.',
        'Thân người thẳng đứng: Giữ ngực cao, siết cơ lõi, không đổ gập thân trên về trước.'
      ],
      commonMistake: 'Bước chân quá ngắn làm gối trước chồm ra quá mũi chân gây đau khớp gối.',
      detailedStepsVi: [
        'Bước 1: Đứng thẳng, hai chân khép nhẹ, hai tay cầm hai quả tạ đơn buông dọc theo thân người.',
        'Bước 2: Bước một chân lớn về phía trước khoảng 60-90cm.',
        'Bước 3: Hít sâu, hạ thấp trọng tâm thân người thẳng đứng xuống cho đến khi cả hai đầu gối tạo góc 90° (gối sau cách sàn 2-3cm).',
        'Bước 4: Dồn lực vào gót chân trước đạp mạnh xuống sàn để đẩy người đứng thẳng trở về vị trí xuất phát.',
        'Bước 5: Thở ra dứt khoát rồi đổi chân lặp lại.'
      ],
      startingWeightGuide: {
        recommendedWeightKg: 6.0,
        recommendedUnit: 'kg/bên',
        targetReps: '10 reps/bên',
        targetRpe: 'RPE 7',
        advice: 'Tập không tạ hoặc tạ đơn 4-6kg mỗi bên để rèn luyện thăng bằng trước.'
      }
    };
  }

  // =========================================================================
  // 7. NGỰC: ÉP NGỰC CÁNH BƯỚM / CÁP (BUTTERFLY / PEC DECK / CABLE CROSSOVER)
  // =========================================================================
  if (searchKey.includes('butterfly') || searchKey.includes('pec deck') || searchKey.includes('pec_deck') || searchKey.includes('crossover') || searchKey.includes('ép ngực')) {
    return {
      vietnameseName: 'Ép Ngực Trong Cánh Bướm (Butterfly / Pec Deck / Cable Fly)',
      formCues: [
        'Khóa bả vai mở ngực: Ép hai xương bả vai ra sau áp sát lưng ghế, ưỡn ngực cao suốt bài tập.',
        'Cùi chỏ hơi cong nhẹ: Giữ góc cong cùi chỏ cố định (khoảng 15°), không co duỗi cánh tay khi ép.',
        'Chạm nhẹ ở đỉnh ép: Ép hai tay vào nhau tập trung siết chặt rãnh ngực trong 1 giây, mở ra chậm 2-3s.'
      ],
      commonMistake: 'Gồng vai rụt cổ đẩy tay về trước biến thành bài đẩy vai trước thay vì ép cơ ngực.',
      detailedStepsVi: [
        'Bước 1: Điều chỉnh chiều cao ghế ngồi sao cho tay cầm ngang tầm giữa ngực.',
        'Bước 2: Ngồi áp sát lưng và đầu vào đệm, kéo bả vai ra sau và ưỡn cao lồng ngực.',
        'Bước 3: Đặt cẳng tay/bàn tay vào tay nắm, giữ cùi chỏ hơi cong nhẹ góc cố định.',
        'Bước 4: Hít sâu, dùng cơ ngực ép hai cánh tay vào nhau ở trước mặt cho đến khi chạm nhẹ hoặc gần nhau. Siết cứng ngực trong 1 giây.',
        'Bước 5: Mở rộng hai tay sang hai bên từ từ trong 2-3 giây để ngực dãn căng hết mức có kiểm soát đồng thời thở ra.'
      ],
      startingWeightGuide: {
        recommendedWeightKg: 20.0,
        recommendedUnit: 'nấc pin',
        targetReps: '12 - 15 reps',
        targetRpe: 'RPE 7 - 8',
        advice: 'Chọn mức tạ 15-20kg trên máy tạ khối. Tập trung vào cảm giác kéo dãn ngực và siết rãnh ngực giữa.'
      }
    };
  }

  // =========================================================================
  // 8. NGỰC: CHỐNG XÀ KÉP TẬP NGỰC (DIPS CHEST VERSION)
  // Ưu tiên kiểm tra trước triceps pushdown!
  // =========================================================================
  if (searchKey.includes('dips') && (searchKey.includes('chest') || muscleLower.includes('chest') || searchKey.includes('xà kép'))) {
    return {
      vietnameseName: 'Chống Xà Kép Tập Ngực (Chest Dips)',
      formCues: [
        'Nghiêng người về trước 30°: Đổ nhẹ thân trên về trước, co gối ra sau để lực ăn tối đa vào ngực dưới.',
        'Cùi chỏ mở nhẹ 45°: Khi hạ người, mở cùi chỏ chếch sang hai bên, không ép sát sườn (sẽ bị ăn vào tay sau).',
        'Hạ người vừa phải: Hạ cho đến khi bắp tay song song sàn (khuỷu tay góc 90°), không hạ quá sâu để bảo vệ khớp vai.'
      ],
      commonMistake: 'Thân người thẳng đứng vuông góc sàn làm toàn bộ áp lực dồn vào cơ tay sau thay vì cơ ngực.',
      detailedStepsVi: [
        'Bước 1: Nắm hai thanh xà kép (hoặc ngồi vào máy Dips trợ lực), nâng người lên thẳng tay.',
        'Bước 2: Nghiêng thân trên về phía trước khoảng 30 độ, hơi gập gối bắt chéo chân ra sau.',
        'Bước 3: Hít sâu, từ từ gập khuỷu tay hạ người xuống chậm rãi cho đến khi góc cùi chỏ đạt khoảng 90° và ngực dưới căng rõ rệt.',
        'Bước 4: Dùng lực cơ ngực dưới và cơ tam đầu đẩy mạnh người thẳng lên vị trí ban đầu.',
        'Bước 5: Khóa nhẹ cánh tay ở đỉnh (không khóa chết khớp cùi chỏ), thở ra dứt khoát rồi lặp lại.'
      ],
      startingWeightGuide: {
        recommendedWeightKg: 0,
        recommendedUnit: 'kg',
        targetReps: '8 - 10 reps',
        targetRpe: 'RPE 7',
        advice: 'Nếu chưa đủ sức nâng toàn bộ trọng lượng cơ thể, hãy dùng dây kháng lực hoặc máy trợ lực giảm 15-25kg.'
      }
    };
  }

  // =========================================================================
  // 9. CƠ BỤNG: NÂNG CHÂN TẬP BỤNG DƯỚI (LEG RAISE / HANGING LEG RAISE)
  // =========================================================================
  if (searchKey.includes('leg raise') || searchKey.includes('leg_raise') || searchKey.includes('knee raise') || searchKey.includes('nâng chân')) {
    return {
      vietnameseName: 'Nâng Chân Tập Cơ Bụng Dưới (Leg Raise / Knee Raise)',
      formCues: [
        'Cuộn xương chậu lên: Muốn ăn vào bụng dưới, khi chân lên cao phải cuộn hơi nhấc nhẹ xương chậu/mông lên.',
        'Hạ chân chậm: Hạ chân xuống chậm trong 2-3s và dừng lại ngay trước khi lưng dưới bị võng lên khỏi sàn.',
        'Đầu gối hơi chùng nhẹ: Nếu cơ gân khoeo cứng, có thể gập nhẹ đầu gối để tập trung 100% vào bụng dưới.'
      ],
      commonMistake: 'Võng lưng dưới khi hạ chân làm đau thắt lưng và dùng quán tính đung đưa thân người.',
      detailedStepsVi: [
        'Bước 1: Nằm ngửa trên thảm/ghế phẳng (áp chặt lưng dưới xuống sàn) hoặc treo người trên xà/khung đỡ tay.',
        'Bước 2: Hai chân khép sát, đầu gối duỗi thẳng hoặc hơi cong nhẹ.',
        'Bước 3: Hít sâu, dùng sức cơ bụng dưới nâng hai chân lên cao theo góc 75° - 90° so với sàn.',
        'Bước 4: Ở đỉnh chuyển động, hơi nhấc mông và cuộn xương chậu lên về phía ngực để siết bụng dưới tối đa.',
        'Bước 5: Từ từ hạ hai chân xuống chậm trong 2-3 giây có kiểm soát (không để gót chân chạm đất) đồng thời thở ra.'
      ],
      startingWeightGuide: {
        recommendedWeightKg: 0,
        recommendedUnit: 'kg',
        targetReps: '12 - 15 reps',
        targetRpe: 'RPE 7 - 8',
        advice: 'Tập trung vào việc cuộn mông nhấc nhẹ khỏi đệm ở điểm đỉnh, thở hết khí ra ngoài.'
      }
    };
  }

  // =========================================================================
  // 10. CƠ BỤNG: CON LĂN BỤNG (AB ROLLER)
  // =========================================================================
  if (searchKey.includes('ab roller') || searchKey.includes('ab_roller') || searchKey.includes('con lăn')) {
    return {
      vietnameseName: 'Đẩy Con Lăn Tập Cơ Bụng (Ab Roller)',
      formCues: [
        'Lưng hơi gù vòm (Hollow body): Tuyệt đối không để võng thắt lưng khi đẩy con lăn ra xa.',
        'Biên độ phù hợp: Chỉ đẩy ra xa tới cự ly mà bạn còn làm chủ được cơ bụng để kéo về.',
        'Kéo về bằng cơ bụng: Tập trung siết cơ bụng kéo con lăn về phía đầu gối, không kéo bằng tay.'
      ],
      commonMistake: 'Võng lưng dưới sụp bụng xuống sàn gây chấn thương thắt lưng cấp tính.',
      detailedStepsVi: [
        'Bước 1: Quỳ hai đầu gối lên thảm đệm, hai tay nắm chặt hai tay cầm của con lăn đặt ngay dưới ngực.',
        'Bước 2: Cuộn tròn nhẹ lưng trên, gồng cứng cơ bụng và siết cơ mông.',
        'Bước 3: Hít sâu, từ từ lăn bánh xe về phía trước theo đường thẳng, hạ thấp thân người dần xuống sàn.',
        'Bước 4: Dừng lại ở điểm xa nhất mà bạn vẫn giữ được lưng thẳng và cơ bụng siết căng.',
        'Bước 5: Dùng lực cơ bụng co lại kéo con lăn trở về vị trí quỳ ban đầu đồng thời thở ra dứt khoát.'
      ],
      startingWeightGuide: {
        recommendedWeightKg: 0,
        recommendedUnit: 'kg',
        targetReps: '8 - 12 reps',
        targetRpe: 'RPE 8',
        advice: 'Người mới có thể chặn con lăn vào tường để kiểm soát cự ly đẩy an toàn.'
      }
    };
  }

  // =========================================================================
  // 11. CƠ BỤNG: ĐO VÁN (PLANK)
  // =========================================================================
  if (searchKey.includes('plank')) {
    return {
      vietnameseName: 'Tư Thế Đo Ván Giữ Cơ Lõi (Plank)',
      formCues: [
        'Thân người thẳng tắp một đường: Từ gót chân, mông, lưng đến đầu tạo thành một đường thẳng nằm nghiêng.',
        'Siết mông & gồng bụng: Chủ động siết chặt cơ mông và kéo rốn về phía cột sống để bảo vệ thắt lưng.',
        'Khuỷu tay vuông góc: Đặt khuỷu tay ngay dưới khớp vai, ấn mạnh cẳng tay xuống sàn đẩy vai lên cao.'
      ],
      commonMistake: 'Võng lưng dưới sụp hông xuống đất hoặc chổng mông quá cao lên trần.',
      detailedStepsVi: [
        'Bước 1: Nằm sấp trên thảm, chống hai cẳng tay xuống đất với khuỷu tay nằm ngay dưới khớp vai.',
        'Bước 2: Chống hai mũi chân xuống sàn rộng bằng hông, nâng toàn bộ thân người lên khỏi mặt đất.',
        'Bước 3: Siết chặt cơ mông, gồng cứng cơ bụng, giữ lưng và cổ thẳng hàng tự nhiên (mắt nhìn thẳng xuống thảm).',
        'Bước 4: Duy trì nhịp hít thở đều đặn bằng ngực, tuyệt đối không nín thở.',
        'Bước 5: Giữ tư thế vững chắc trong 30 - 60 giây mỗi hiệp.'
      ],
      startingWeightGuide: {
        recommendedWeightKg: 0,
        recommendedUnit: 'kg',
        targetReps: '45 - 60 giây',
        targetRpe: 'RPE 8',
        advice: 'Chia làm 3 hiệp, mỗi hiệp giữ 30-45 giây chuẩn form thay vì cố giữ lâu mà bị võng lưng.'
      }
    };
  }

  // =========================================================================
  // 12. CƠ BỤNG: XOAY EO (TORSO ROTATION / RUSSIAN TWISTS)
  // =========================================================================
  if (searchKey.includes('torso') || searchKey.includes('rotation') || searchKey.includes('twist') || searchKey.includes('xoay eo')) {
    return {
      vietnameseName: 'Xoay Eo Cơ Bụng Máy Khối / Cáp (Rotary Torso / Cable Twist)',
      formCues: [
        'Khóa chặt phần thân dưới: Giữ hông và đùi cố định, chuyển động xoay chỉ diễn ra ở lồng ngực và cơ liên sườn.',
        'Xoay có kiểm soát: Xoay thân trên sang một bên trong 1s, giữ siết cơ eo 1s, xoay trả về chậm rãi trong 2s.',
        'Không vặn giật khớp lưng: Không được lấy đà giật mạnh làm xoắn vặn đột ngột đốt sống thắt lưng.'
      ],
      commonMistake: 'Xoay cả hông và đùi theo thân trên làm mất tác dụng vào cơ liên sườn.',
      detailedStepsVi: [
        'Bước 1: Ngồi vào máy xoay eo, điều chỉnh cần gạt góc xoay vừa phải với độ dẻo của bạn.',
        'Bước 2: Khóa chặt đùi và hông vào đệm tì, hai tay ôm tay nắm trước ngực.',
        'Bước 3: Hít sâu gồng chặt cơ bụng.',
        'Bước 4: Dùng sức cơ liên sườn và cơ bụng chéo xoay thân trên sang một bên hết biên độ thoải mái. Giữ siết 1 giây.',
        'Bước 5: Từ từ trả người về vị trí ban đầu trong 2 giây có kiểm soát đồng thời thở ra.'
      ],
      startingWeightGuide: {
        recommendedWeightKg: 15.0,
        recommendedUnit: 'nấc pin',
        targetReps: '12 - 15 reps/bên',
        targetRpe: 'RPE 7',
        advice: 'Mức tạ nhẹ 10-15kg giúp siết eo săn chắc mà không làm thô bắp liên sườn.'
      }
    };
  }

  // =========================================================================
  // 13. CƠ BỤNG: GẬP BỤNG (CRUNCHES / AB CRUNCH MACHINE / DECLINE CRUNCH)
  // =========================================================================
  if (searchKey.includes('crunch') || searchKey.includes('gập bụng') || searchKey.includes('sit-up')) {
    const isMachine = eqLower.includes('machine') || searchKey.includes('machine') || searchKey.includes('cable');
    return {
      vietnameseName: isMachine ? 'Gập Bụng Máy Tạ Khối / Cáp (Abdominal Crunch)' : 'Gập Bụng Thảm / Ghế Dốc (Crunches)',
      formCues: [
        'Cuộn tròn cột sống: Tập trung cuộn xương sườn về phía xương chậu, không chỉ đơn giản là gập tại khớp hông.',
        'Thở kiệt khí ở đỉnh: Thở hết toàn bộ không khí trong bụng ra khi gập để cơ bụng siết chặt tối đa.',
        'Không dùng tay kéo cổ: Hai tay chỉ đặt hờ sau tai hoặc ôm ngực, không giật mạnh đầu về phía trước.'
      ],
      commonMistake: 'Dùng cơ gấp hông (Hip Flexors) để nhấc cả thân người lên thay vì cuộn cơ bụng.',
      detailedStepsVi: [
        'Bước 1: Nằm trên thảm/ghế dốc hoặc ngồi vào máy gập bụng tạ khối, chỉnh đệm tì ngang ngực.',
        'Bước 2: Giữ phần thân dưới cố định vững chắc, lưng dưới áp sát mặt phẳng tựa.',
        'Bước 3: Hít sâu một hơi nén cơ lõi.',
        'Bước 4: Dùng lực cơ bụng cuộn cong cột sống đưa xương sườn lại gần xương chậu, đồng thời thở kiệt không khí ra ngoài.',
        'Bước 5: Giữ siết chặt cơ múi bụng trong 1 giây ở điểm gập sâu nhất rồi trả về chậm rãi trong 2 giây.'
      ],
      startingWeightGuide: {
        recommendedWeightKg: isMachine ? 20.0 : 0,
        recommendedUnit: isMachine ? 'nấc pin' : 'kg',
        targetReps: '12 - 15 reps',
        targetRpe: 'RPE 8',
        advice: 'Tập trung vào cảm giác cháy cơ múi bụng ở hiệp 3 thay vì đếm số lần quá nhanh.'
      }
    };
  }

  // =========================================================================
  // 14. CARDIO: MÁY CHẠY BỘ TREADMILL (CHẠY & ĐI BỘ DỐC)
  // =========================================================================
  if (searchKey.includes('treadmill') || searchKey.includes('chạy bộ') || searchKey.includes('đi bộ')) {
    return {
      vietnameseName: 'Đi Bộ Dốc / Chạy Bộ Máy Chạy (Treadmill)',
      formCues: [
        'Đi bộ dốc đốt mỡ (Incline Walk): Chỉnh độ dốc 8% - 12%, tốc độ 4.5 - 5.5 km/h, không nắm tay vịn để đốt calo tối đa.',
        'Đáp chân bằng giữa bàn chân: Tránh tiếp đất bằng gót chân quá mạnh khi chạy để bảo vệ khớp gối và cột sống.',
        'Thân người thẳng: Mắt nhìn thẳng về trước, mở ngực tự nhiên, vung hai tay nhịp nhàng theo bước chân.'
      ],
      commonMistake: 'Chỉnh dốc cao rồi dùng hai tay bám chặt tay vịn ngả người ra sau triệt tiêu hoàn toàn tác dụng đốt mỡ.',
      detailedStepsVi: [
        'Bước 1: Đứng hai chân ở hai gờ an toàn bên cạnh thảm chạy, kẹp kẹp an toàn (Safety key) vào áo.',
        'Bước 2: Bấm phím Start/Khởi động ở tốc độ chậm 3.0 km/h để thảm lăn rồi bước vào giữa thảm.',
        'Bước 3: Tăng dần độ dốc (Incline) lên 6-10% và tốc độ lên 4.5-5.5 km/h nếu đi bộ dốc, hoặc tốc độ 7-9 km/h nếu chạy bộ.',
        'Bước 4: Đánh tay tự nhiên, hít thở sâu theo nhịp chân (hít 2 bước, thở 2 bước).',
        'Bước 5: Trước khi kết thúc, giảm tốc độ xuống 3.0 km/h đi bộ thả lỏng (Cool down) trong 2-3 phút.'
      ],
      startingWeightGuide: {
        recommendedWeightKg: 0,
        recommendedUnit: 'kg',
        targetReps: '15 - 20 phút',
        targetRpe: 'RPE 6 - 7',
        advice: 'Đi bộ dốc 10% ở tốc độ 5.0 km/h trong 20 phút đốt mỡ tương đương chạy bộ mà cực kỳ êm khớp gối.'
      }
    };
  }

  // =========================================================================
  // 15. CARDIO: ĐẠP XE TẠI CHỖ (STATIONARY BIKE / SPINNING)
  // =========================================================================
  if (searchKey.includes('bike') || searchKey.includes('bicycling') || searchKey.includes('đạp xe')) {
    return {
      vietnameseName: 'Đạp Xe Cardio Đốt Mỡ (Stationary / Recumbent Bike)',
      formCues: [
        'Chỉnh chiều cao yên: Khi bàn đạp ở điểm thấp nhất, đầu gối chỉ hơi cong nhẹ 10°- 15°, không bị chới với hoặc gập gối quá nhiều.',
        'Nhịp đạp ổn định (RPM): Duy trì guồng chân đạp khoảng 70 - 90 vòng/phút (RPM).',
        'Không gù lưng rụt cổ: Mở ngực, thả lỏng vai và giữ cột sống thoải mái suốt bài đạp.'
      ],
      commonMistake: 'Chỉnh yên xe quá thấp làm chèn ép khớp gối gây đau gối sau khi đạp.',
      detailedStepsVi: [
        'Bước 1: Đứng cạnh xe, chỉnh yên xe cao ngang tầm xương hông của bạn.',
        'Bước 2: Ngồi lên yên, luồn chân vào đai bàn đạp và thắt chặt vừa phải.',
        'Bước 3: Bắt đầu đạp chậm rãi ở mức kháng lực thấp để làm nóng khớp gối và cơ đùi trong 2 phút.',
        'Bước 4: Tăng dần mức kháng lực (Resistance) lên mức 4-7 để cảm nhận cơ chân phải dùng lực, duy trì nhịp thở đều.',
        'Bước 5: Đạp thả lỏng mức nhẹ nhất trong 2 phút cuối trước khi bước xuống xe.'
      ],
      startingWeightGuide: {
        recommendedWeightKg: 0,
        recommendedUnit: 'kg',
        targetReps: '15 - 20 phút',
        targetRpe: 'RPE 6',
        advice: 'Duy trì nhịp tim ở vùng Zone 2 (khoảng 120-135 nhịp/phút) để đốt mỡ hiệu quả nhất.'
      }
    };
  }

  // =========================================================================
  // 16. CARDIO: MÁY TRƯỢT TUYẾT (ELLIPTICAL TRAINER)
  // =========================================================================
  if (searchKey.includes('elliptical') || searchKey.includes('trượt tuyết')) {
    return {
      vietnameseName: 'Máy Trượt Tuyết Toàn Thân (Elliptical Trainer)',
      formCues: [
        'Bàn chân tiếp xúc toàn phần: Giữ gót chân luôn áp sát bàn đạp, không nhón gót khi đẩy bàn đạp.',
        'Phối hợp tay và chân: Dùng cả lực đẩy/kéo của hai tay cầm cùng lực đạp chân để kích hoạt toàn thân.',
        'Cột sống thẳng: Giữ người thẳng, mắt nhìn thẳng, không đổ người tựa vào màn hình máy.'
      ],
      commonMistake: 'Nhón gót chân đạp liên tục làm mỏi cổ chân và giảm kích hoạt cơ mông đùi.',
      detailedStepsVi: [
        'Bước 1: Bước lên bàn đạp máy, hai tay nắm lấy hai tay vịn chuyển động.',
        'Bước 2: Bắt đầu đạp bàn đạp theo chuyển động hình elip nhịp nhàng.',
        'Bước 3: Vừa đạp vừa phối hợp tay đẩy tay kéo nhịp nhàng theo guồng chân.',
        'Bước 4: Điều chỉnh mức kháng lực (Resistance) và độ dốc (Incline) trên bảng điều khiển.',
        'Bước 5: Duy trì tốc độ ổn định trong 15-20 phút rồi giảm tốc độ thả lỏng trong 2 phút.'
      ],
      startingWeightGuide: {
        recommendedWeightKg: 0,
        recommendedUnit: 'kg',
        targetReps: '15 - 20 phút',
        targetRpe: 'RPE 6',
        advice: 'Elliptical là máy cardio hoàn hảo nhất cho người có tiền sử đau khớp gối hoặc cột sống.'
      }
    };
  }

  // =========================================================================
  // 17. CẦU VAI: NHÚN CẦU VAI (SHRUGS)
  // =========================================================================
  if (searchKey.includes('shrug') || searchKey.includes('cầu vai')) {
    return {
      vietnameseName: 'Nhún Cầu Vai Đòn Tạ / Máy Smith (Barbell / Smith Shrugs)',
      formCues: [
        'Kéo vai thẳng đứng: Nhún hai cầu vai thẳng lên hướng về phía hai tai, không xoay tròn khớp vai.',
        'Giữ đỉnh co cơ 1s: Giữ tạ ở điểm cao nhất trong 1 giây để cơ cầu vai co cứng hoàn toàn.',
        'Hạ tạ chậm: Hạ tạ xuống chậm trong 2s để kéo dãn cơ cầu vai trước khi nhún tiếp.'
      ],
      commonMistake: 'Xoay tròn khớp vai khi nhún gây mòn rách sụn khớp ổ chảo cánh tay.',
      detailedStepsVi: [
        'Bước 1: Đứng thẳng, nắm thanh đòn máy Smith hoặc tạ đòn rộng bằng vai, đặt thanh đòn trước đùi hoặc sau lưng.',
        'Bước 2: Hai cánh tay duỗi thẳng tự nhiên, ngực mở rộng, lưng thẳng.',
        'Bước 3: Hít sâu, dùng sức cơ cầu vai (Trapezius) nhún mạnh hai bả vai thẳng đứng lên trên phía tai.',
        'Bước 4: Giữ căng cứng cơ cầu vai trong 1-2 giây ở điểm cao nhất.',
        'Bước 5: Từ từ hạ hai bả vai xuống vị trí ban đầu có kiểm soát đồng thời thở ra.'
      ],
      startingWeightGuide: {
        recommendedWeightKg: 30.0,
        recommendedUnit: 'kg',
        targetReps: '10 - 12 reps',
        targetRpe: 'RPE 7',
        advice: 'Tập trung vào biên độ nhún cao nhất có thể thay vì lắp tạ quá nặng làm tay bị chùng.'
      }
    };
  }

  // =========================================================================
  // 18. LƯNG DƯỚI: GẬP LƯNG GOOD MORNING
  // =========================================================================
  if (searchKey.includes('good morning') || searchKey.includes('good_morning')) {
    return {
      vietnameseName: 'Gập Lưng Dưới Đòn Tạ (Good Morning)',
      formCues: [
        'Bản lề hông (Hip Hinge): Đẩy mông ra sau tối đa, giữ lưng thẳng tuyệt đối không được cong lưng.',
        'Đầu gối hơi chùng nhẹ: Giữ góc chùng gối cố định 15-20°, không ngồi xổm gập gối.',
        'Tạ tì trên cầu vai: Giữ thanh đòn vững vàng trên cơ cầu vai, không để đòn lăn lên đốt sống cổ.'
      ],
      commonMistake: 'Cong lưng dưới khi gập người về trước gây nguy cơ thoát vị đĩa đệm rất cao.',
      detailedStepsVi: [
        'Bước 1: Đặt thanh đòn lên phần cơ cầu vai sau (vị trí Low Bar Squat). Đứng hai chân rộng bằng vai.',
        'Bước 2: Hít sâu một hơi căng lồng ngực và nén chặt cơ bụng (Valsalva).',
        'Bước 3: Đẩy mông ra sau, từ từ gập thân trên về trước tại khớp hông cho đến khi thân người gần song song với sàn.',
        'Bước 4: Cảm nhận cơ đùi sau và lưng dưới căng chắc (lưng luôn giữ thẳng tắp tự nhiên).',
        'Bước 5: Dùng lực cơ mông và đùi sau đẩy hông về trước để đứng thẳng người dậy đồng thời thở ra.'
      ],
      startingWeightGuide: {
        recommendedWeightKg: 20.0,
        recommendedUnit: 'kg',
        targetReps: '8 - 10 reps',
        targetRpe: 'RPE 6',
        advice: 'Chỉ nên bắt đầu bằng thanh đòn rỗng 20kg để tập cảm giác giữ thẳng lưng khi gập hông.'
      }
    };
  }

  // =========================================================================
  // 19. ĐẨY NGỰC TRÊN (INCLINE PRESS)
  // =========================================================================
  if (searchKey.includes('incline') && (searchKey.includes('press') || searchKey.includes('bench') || searchKey.includes('ngực') || muscleLower.includes('chest'))) {
    const isDumbbell = eqLower.includes('dumbbell') || searchKey.includes('dumbbell');
    const isSmith = searchKey.includes('smith');
    return {
      vietnameseName: isDumbbell 
        ? 'Đẩy Ngực Trên Tạ Đơn (Incline Dumbbell Press)' 
        : isSmith 
        ? 'Đẩy Ngực Trên Máy Smith (Incline Smith Press)'
        : 'Đẩy Ngực Trên Đòn Ngang (Incline Barbell Press)',
      formCues: [
        'Độ dốc ghế 30° - 45°: Không chỉnh ghế quá dốc đứng sẽ bị ăn nhiều vào vai trước thay vì ngực trên.',
        'Khóa bả vai & mở ngực: Kéo 2 xương bả vai ra sau và áp chặt lưng trên vào đệm ghế suốt bài tập.',
        'Quỹ đạo đẩy chuẩn: Hạ tạ chạm nhẹ phần ngực trên (dưới xương quai xanh 2-3cm), đẩy lên dứt khoát.'
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
        recommendedWeightKg: isDumbbell ? 6.0 : isSmith ? 30.0 : 20.0,
        recommendedUnit: isDumbbell ? 'kg/bên' : 'kg',
        targetReps: '10 - 12 reps',
        targetRpe: 'RPE 6 - 7',
        advice: isDumbbell 
          ? 'Nên bắt đầu với tạ đơn 5kg - 7kg mỗi bên để kiểm soát thăng bằng cổ tay trên ghế dốc.' 
          : 'Dùng thanh đòn rỗng hoặc lắp bánh tạ nhẹ trên máy Smith để học cảm nhận quỹ đạo tạ nghiêng.'
      }
    };
  }

  // =========================================================================
  // 20. ĐẨY NGỰC NGANG / PHẲNG (BENCH PRESS / CHEST PRESS)
  // =========================================================================
  if (searchKey.includes('bench press') || searchKey.includes('chest press') || (muscleLower.includes('chest') && searchKey.includes('press'))) {
    const isDumbbell = eqLower.includes('dumbbell') || searchKey.includes('dumbbell');
    const isMachine = eqLower.includes('machine') || searchKey.includes('machine') || searchKey.includes('robot') || searchKey.includes('leverage');
    return {
      vietnameseName: isDumbbell 
        ? 'Đẩy Ngực Tạ Đơn (Dumbbell Press)' 
        : isMachine 
        ? 'Đẩy Ngực Máy Robot / Tạ Khối (Chest Press Machine)'
        : 'Đẩy Ngực Đòn Ngang (Barbell Bench Press)',
      formCues: [
        'Khóa bả vai: Kéo 2 xương bả vai ra sau và hạ xuống, áp chặt lưng trên vào ghế.',
        'Góc cùi chỏ 45°- 75°: Không mở bè cùi chỏ vuông góc 90° để tránh rách sụn khớp vai.',
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
        recommendedWeightKg: isDumbbell ? 6.0 : isMachine ? 25.0 : 20.0,
        recommendedUnit: isDumbbell ? 'kg/bên' : isMachine ? 'nấc pin' : 'kg',
        targetReps: '10 - 12 reps',
        targetRpe: 'RPE 6 - 7',
        advice: isDumbbell 
          ? 'Người mới nên bắt đầu với tạ đơn 5kg - 7kg mỗi bên để kiểm soát thăng bằng cổ tay.' 
          : 'Bắt đầu với thanh đòn Olympic rỗng 20kg (chưa lắp bánh tạ) hoặc nấc 4-5 trên máy để học cảm nhận quỹ đạo tạ.'
      }
    };
  }

  // =========================================================================
  // 21. ĐẠP ĐÙI MÁY (LEG PRESS)
  // =========================================================================
  if (searchKey.includes('leg press') || searchKey.includes('leg_press') || searchKey.includes('đạp đùi')) {
    return {
      vietnameseName: 'Đạp Đùi Bằng Máy (Leg Press Machine)',
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

  // =========================================================================
  // 22. GÁNH TẠ SQUAT (BARBELL SQUAT / SMITH SQUAT)
  // =========================================================================
  if (searchKey.includes('squat')) {
    const isDumbbell = eqLower.includes('dumbbell') || searchKey.includes('goblet');
    const isSmith = searchKey.includes('smith');
    return {
      vietnameseName: isDumbbell 
        ? 'Ngồi Xổm Goblet (Goblet Squat)' 
        : isSmith 
        ? 'Gánh Đùi Máy Smith (Smith Machine Squat)'
        : 'Gánh Tạ Ngồi Xổm (Barbell Full Squat)',
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
        recommendedWeightKg: isDumbbell ? 8.0 : isSmith ? 30.0 : 20.0,
        recommendedUnit: isDumbbell ? 'kg' : 'kg',
        targetReps: '8 - 10 reps',
        targetRpe: 'RPE 6',
        advice: isDumbbell
          ? 'Tập bài Goblet Squat ôm quả tạ đơn 6-8kg trước ngực giúp lưng luôn thẳng tự nhiên.'
          : 'Tập với đòn không 20kg để tập cảm giác dồn trọng tâm vào giữa lòng bàn chân.'
      }
    };
  }

  // =========================================================================
  // 23. GẬP HÔNG ĐÙI SAU RDL (ROMANIAN DEADLIFT)
  // =========================================================================
  if (searchKey.includes('romanian') || searchKey.includes('rdl') || (searchKey.includes('deadlift') && (searchKey.includes('stiff') || searchKey.includes('dumbbell')))) {
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

  // =========================================================================
  // 24. DEADLIFT TRUYỀN THỐNG (BARBELL DEADLIFT)
  // =========================================================================
  if (searchKey.includes('deadlift')) {
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

  // =========================================================================
  // 25. KÉO XÔ MÁY / HÍT XÀ (LAT PULLDOWN / PULL-UPS)
  // =========================================================================
  if (searchKey.includes('pulldown') || searchKey.includes('pull-up') || searchKey.includes('pullup') || searchKey.includes('kéo xô')) {
    const isPullup = searchKey.includes('pull-up') || searchKey.includes('pullup');
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

  // =========================================================================
  // 26. ĐẨY VAI (SHOULDER PRESS / OVERHEAD PRESS)
  // =========================================================================
  if (searchKey.includes('shoulder press') || searchKey.includes('overhead') || searchKey.includes('đẩy vai')) {
    const isDumbbell = eqLower.includes('dumbbell') || searchKey.includes('dumbbell');
    const isSmith = searchKey.includes('smith');
    return {
      vietnameseName: isDumbbell 
        ? 'Đẩy Vai Tạ Đơn (Dumbbell Shoulder Press)' 
        : isSmith 
        ? 'Đẩy Vai Máy Smith (Smith Shoulder Press)'
        : 'Đẩy Vai Đòn Ngang (Overhead Press)',
      formCues: [
        'Cố định thân người: Siết chặt mông và cơ bụng để không bị võng lưng dưới.',
        'Góc cùi chỏ chếch nhẹ 30°: Không mở cùi chỏ thẳng tắp sang 2 bên để bảo vệ khớp xoay vai.',
        'Đẩy thẳng trục: Đẩy tạ theo đường thẳng hướng thẳng lên đỉnh đầu.'
      ],
      commonMistake: 'Ưỡn ngực quá mức và ưỡn cong lưng dưới biến bài đẩy vai thành đẩy ngực trên.',
      detailedStepsVi: [
        'Bước 1: Ngồi trên ghế tựa lưng dựng đứng hoặc đứng vững hai chân rộng bằng vai. Đặt 2 quả tạ ngang tầm tai.',
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

  // =========================================================================
  // 27. CHÈO LƯNG (ROW: BARBELL ROW / SEATED CABLE ROW / SMITH ROW)
  // =========================================================================
  if (searchKey.includes('row') || searchKey.includes('chèo')) {
    const isDumbbell = eqLower.includes('dumbbell') || searchKey.includes('dumbbell');
    const isCable = searchKey.includes('cable') || searchKey.includes('seated');
    const isSmith = searchKey.includes('smith');
    return {
      vietnameseName: isCable 
        ? 'Ngồi Kéo Cáp Chèo Thuyền (Seated Cable Row)' 
        : isDumbbell 
        ? 'Chèo Tạ Đơn 1 Tay (One-arm DB Row)' 
        : isSmith 
        ? 'Chèo Lưng Với Máy Smith (Smith Bent Over Row)'
        : 'Gập Người Chèo Tạ Đòn (Bent Over Barbell Row)',
      formCues: [
        'Gập hông 45°: Đẩy mông ra sau, giữ lưng thẳng song song hoặc chếch 45° so với sàn.',
        'Kéo cùi chỏ về túi quần: Đưa tạ sát người và siết chặt cơ lưng trên khi kết thúc.',
        'Cổ thẳng tự nhiên: Nhìn chéo xuống sàn 1-2 mét, không ngửa cổ nhìn thẳng lên trần.'
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
        recommendedWeightKg: isDumbbell ? 8.0 : isCable ? 25.0 : 20.0,
        recommendedUnit: isDumbbell ? 'kg/bên' : isCable ? 'nấc pin' : 'kg',
        targetReps: '10 - 12 reps',
        targetRpe: 'RPE 7',
        advice: isCable 
          ? 'Nấc tạ 20-25kg trên máy cáp giúp người mới cảm nhận cơ lưng xô dễ nhất.'
          : 'Dùng tạ đơn 6-8kg và kê 1 đầu gối lên ghế phẳng sẽ giúp cô lập lưng tốt và đỡ mỏi cột sống.'
      }
    };
  }

  // =========================================================================
  // 28. BẮP TAY TRƯỚC (BICEP CURL: BARBELL / EZ-BAR / DUMBBELL)
  // Chỉ khớp sau khi đã loại trừ Leg Curl ở mục 1!
  // =========================================================================
  if (searchKey.includes('curl') || searchKey.includes('tay trước')) {
    const isEz = searchKey.includes('ez');
    return {
      vietnameseName: isEz ? 'Cuốn Bắp Tay Đòn Cong EZ (EZ-Bar Curl)' : 'Cuộn Bắp Tay Trước (Bicep Curl)',
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
        advice: 'Tạ đơn 4kg - 6kg mỗi bên hoặc đòn EZ 10-12kg. Nếu thấy người phải đung đưa thì lập tức hạ tạ.'
      }
    };
  }

  // =========================================================================
  // 29. BẮP TAY SAU (TRICEPS PUSHDOWN / BENCH DIPS)
  // =========================================================================
  if (searchKey.includes('triceps') || searchKey.includes('pushdown') || searchKey.includes('bench_dips') || searchKey.includes('tay sau')) {
    return {
      vietnameseName: 'Ấn Cáp Tay Sau (Triceps Pushdown / Dips)',
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

  // =========================================================================
  // 30. BAY VAI BÊN (SIDE LATERAL RAISE)
  // =========================================================================
  if (searchKey.includes('lateral raise') || searchKey.includes('side raise') || searchKey.includes('bay vai')) {
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

  // =========================================================================
  // 31. KÉO CÁP MẶT (FACE PULL)
  // =========================================================================
  if (searchKey.includes('face pull') || searchKey.includes('face_pull')) {
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

  // =========================================================================
  // 32. FALLBACK TỔNG QUÁT MẶC ĐỊNH
  // =========================================================================
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
