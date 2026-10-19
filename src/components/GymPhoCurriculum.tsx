'use client';

import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Flame, 
  Zap, 
  Dumbbell, 
  Wind, 
  Apple, 
  Calculator, 
  CheckCircle2, 
  ChevronRight, 
  Play, 
  Clock, 
  ShieldCheck, 
  Sparkles,
  Layers,
  Info
} from 'lucide-react';
import { WorkoutSession, WorkoutExerciseItem, SetLog } from '@/types/workout';
import { getLatestBodyLog, getBodyGoal } from '@/lib/bodyStorage';

interface GymPhoCurriculumProps {
  onStartSession?: (session: WorkoutSession) => void;
}

// Dữ liệu 5 buổi tập chuẩn từ sách Giáo án Gym Phổ Tầng 1 (Tuần 1-4)
export const GYM_PHO_TANG_1_DAYS = [
  {
    dayNumber: 1,
    id: 'thol-tang1-day1',
    title: 'Ngày 1: Chân - Mông - Đùi (Leg Day)',
    tag: 'Selectorized Machine',
    subtitle: 'Kích hoạt nhóm cơ lớn nhất cơ thể với máy tạ khối an toàn',
    warmup: '10 phút khởi động xoay khớp, căng cơ làm nóng và uống Pre-workout/nước lọc.',
    exercises: [
      {
        exerciseId: 'Leg_Press',
        name: 'Đạp đùi với tạ khối (Leg Press)',
        sets: 4,
        reps: '10 reps',
        rest: '1 - 2 phút',
        breathing: 'Đạp ra thở mạnh bằng miệng, thu chân hít sâu bằng mũi, căng cơ yếm khí.',
        target: 'Đùi trước, đùi sau, mông',
        notes: 'Chân đặt rộng bằng vai, không khóa khớp gối khi đạp thẳng.'
      },
      {
        exerciseId: 'Leg_Extensions',
        name: 'Đá đùi trước với tạ khối (Leg Extension)',
        sets: 3,
        reps: '12 - 15 reps',
        rest: '1 phút',
        breathing: 'Duỗi chân thở dồn ra, hạ chân hít sâu vào, căng đùi trước yếm khí.',
        target: 'Cơ tứ đầu đùi (Quads)',
        notes: 'Giữ lưng sát ghế, kiểm soát khi hạ chân không để tạ chạm đáy.'
      },
      {
        exerciseId: 'Lying_Leg_Curls',
        name: 'Nằm móc đùi sau với tạ khối (Lying Leg Curl)',
        sets: 3,
        reps: '12 - 15 reps',
        rest: '1 phút',
        breathing: 'Co chân thở mạnh ra, dãn chân hít vào, căng cơ yếm khí.',
        target: 'Cơ đùi sau (Hamstrings)',
        notes: 'Không nhấc mông lên khỏi đệm trong suốt hành trình gập gối.'
      },
      {
        exerciseId: 'Calf_Press_On_The_Leg_Press_Machine',
        name: 'Đạp bắp chân với tạ khối (Calf Press)',
        sets: 3,
        reps: '10 - 12 reps',
        rest: '1 phút',
        breathing: 'Co chân hít vào, duỗi chân nhón bắp chân thở ra, siết chặt đỉnh.',
        target: 'Cơ bắp chuối / bắp chân (Calves)',
        notes: 'Mũi chân đặt 1/3 mép bàn đạp, nhón hết biên độ.'
      },
      {
        exerciseId: 'Adductor',
        name: 'Ép đùi trong / mông với tạ khối (Inner Thigh)',
        sets: 2,
        reps: '12 - 15 reps',
        rest: '1 phút',
        breathing: 'Ép đùi thở mạnh ra, mở đùi hít vào, căng cơ yếm khí.',
        target: 'Cơ khép đùi trong (Adductors)',
        notes: 'Mở rộng biên độ tối đa vừa sức, ép vào dứt khoát.'
      },
      {
        exerciseId: 'Thigh_Abductor',
        name: 'Ép hông / mông ngoài với tạ khối (Outer Thigh)',
        sets: 2,
        reps: '12 - 15 reps',
        rest: '1 phút',
        breathing: 'Mở đùi banh ra thở mạnh, khép đùi hít vào, căng cơ yếm khí.',
        target: 'Cơ mông nhỡ và đùi ngoài (Glute Medius)',
        notes: 'Giữ lưng thẳng, tập trung cảm nhận vùng hõm hông mông ngoài.'
      }
    ],
    cardioCooldown: '10 - 15 phút đạp xe tĩnh hoặc đi bộ dốc tốc độ nhẹ để hồi phục nhịp tim.'
  },
  {
    dayNumber: 2,
    id: 'thol-tang1-day2',
    title: 'Ngày 2: Ngực & Cơ Bụng (Chest - Abs Day)',
    tag: 'Selectorized & Bodyweight',
    subtitle: 'Định hình khuôn ngực dày, rãnh ngực và siết chặt vòng 2',
    warmup: '10 phút xoay khớp cổ tay, vai, ngực và giãn cơ nhẹ trước khi đẩy.',
    exercises: [
      {
        exerciseId: 'Cable_Chest_Press',
        name: 'Đẩy ngực với máy tạ khối (Chest Press)',
        sets: 3,
        reps: '10 reps',
        rest: '2 phút',
        breathing: 'Đẩy tay ra thở mạnh, thu tay về hít sâu vào, căng ngực yếm khí.',
        target: 'Toàn bộ cơ ngực lớn, vai trước, tay sau',
        notes: 'Ưỡn ngực, khép xương bả vai ra sau, cùi chỏ mở 60-70 độ so với thân.'
      },
      {
        exerciseId: 'Pushups',
        name: 'Hít đất / Chống đẩy (Push Up)',
        sets: 3,
        reps: '10 reps',
        rest: '1 - 2 phút',
        breathing: 'Đẩy người lên thở ra, thả người xuống hít vào, căng ngực yếm khí.',
        target: 'Cơ ngực, cơ lõi bụng, tay sau',
        notes: 'Thân người thẳng như tấm ván, siết mông và bụng suốt bài.'
      },
      {
        exerciseId: 'Dips_-_Chest_Version',
        name: 'Chống xà kép trợ lực (Dips Assistant)',
        sets: 3,
        reps: '10 reps',
        rest: '1 phút',
        breathing: 'Đẩy người lên cao thở ra, hạ người xuống hít vào, căng cơ yếm khí.',
        target: 'Ngực dưới, tay sau, cơ ngực ngoài',
        notes: 'Hơi đổ người về trước để dồn lực vào cơ ngực dưới.'
      },
      {
        exerciseId: 'Butterfly',
        name: 'Ép ngực trong với tạ khối (Pec Fly / Butterfly)',
        sets: 2,
        reps: '12 reps',
        rest: '1 phút',
        breathing: 'Dang tay hít sâu vào, ép tay vào nhau thở dồn ra, siết rãnh ngực.',
        target: 'Rãnh ngực trong và độ rộng cơ ngực',
        notes: 'Không để tạ giật lùi khớp vai, ép chặt 1 giây tại điểm chạm.'
      },
      {
        exerciseId: 'Ab_Crunch_Machine',
        name: 'Gập bụng với tạ khối (Abdominal Crunch)',
        sets: 3,
        reps: '12 reps',
        rest: '1 phút',
        breathing: 'Gập người thở hết hơi ra, dãn người hít vào, siết múi bụng.',
        target: 'Cơ bụng trên và thẳng bụng (Rectus Abdominis)',
        notes: 'Dùng lực cơ bụng cuộn người lại, không dùng cơ đùi kéo tạ.'
      },
      {
        exerciseId: 'Torso_Rotation',
        name: 'Xoay bụng với tạ khối (Rotary Torso)',
        sets: 2,
        reps: '15 reps mỗi bên',
        rest: '1 phút',
        breathing: 'Vặn người thở dồn ra, xoay về giữa hít vào, căng cơ yếm khí.',
        target: 'Cơ liên sườn (Obliques) và thắt lưng',
        notes: 'Cố định phần hông và đùi dưới, chỉ xoay phần thân trên.'
      }
    ],
    cardioCooldown: '10 - 15 phút đạp xe tĩnh nhẹ nhàng giúp xả axit lactic cơ ngực và bụng.'
  },
  {
    dayNumber: 3,
    id: 'thol-tang1-day3',
    title: 'Ngày 3: Lưng & Xô (Back - Lat Day)',
    tag: 'Selectorized Machine',
    subtitle: 'Mở rộng bờ lưng chữ V, tăng độ dày lưng và cải thiện tư thế đứng',
    warmup: '10 phút xoay khớp bả vai, xoay hông và khởi động lưng dưới.',
    exercises: [
      {
        exerciseId: 'Seated_Cable_Rows',
        name: 'Kéo lưng / Chèo thuyền cáp (Seated Cable Row)',
        sets: 3,
        reps: '12 - 15 reps',
        rest: '2 phút',
        breathing: 'Dãn lưng tay duỗi hít vào, kéo tạ sát bụng ép bả vai thở ra.',
        target: 'Độ dày lưng giữa (Rhomboids), cơ lưng xô',
        notes: 'Lưng thẳng tự nhiên, không lắc lư người quá nhiều khi kéo.'
      },
      {
        exerciseId: 'Close-Grip_Front_Lat_Pulldown',
        name: 'Ngồi kéo cáp tay hẹp (Close-Grip Lat Pulldown)',
        sets: 3,
        reps: '12 - 15 reps',
        rest: '2 phút',
        breathing: 'Kéo tay xuống sát ngực thở mạnh ra, thả tạ lên cao hít vào.',
        target: 'Cơ xô dưới và lưng giữa',
        notes: 'Ưỡn ngực đón thanh tạ, cảm nhận cơ xô co thắt cực đại.'
      },
      {
        exerciseId: 'Wide-Grip_Lat_Pulldown',
        name: 'Kéo xô tạ khối rộng tay (Lat Pulldown)',
        sets: 3,
        reps: '12 - 15 reps',
        rest: '1.5 phút',
        breathing: 'Tay cao hít vào, kéo thanh đòn xuống xương đòn thở ra yếm khí.',
        target: 'Độ rộng lưng xô chữ V (Latissimus Dorsi)',
        notes: 'Không ngả người về sau quá 30 độ, siết nách lại khi kéo.'
      }
    ],
    cardioCooldown: '15 phút đi bộ dốc máy chạy bộ (Incline 6-8%, Speed 4.5 - 5.0 km/h).'
  },
  {
    dayNumber: 4,
    id: 'thol-tang1-day4',
    title: 'Ngày 4: Vai - Tay & Bụng (Shoulder - Arm - Abs)',
    tag: 'Selectorized & Free Weight',
    subtitle: 'Hoàn thiện cầu vai vuông vắn, bắp tay săn chắc và cơ bụng sắc nét',
    warmup: '10 phút khởi động khớp xoay vai, cùi chỏ và cổ tay kỹ càng.',
    exercises: [
      {
        exerciseId: 'Dumbbell_Shoulder_Press',
        name: 'Đẩy vai với robot / tạ khối (Shoulder Press)',
        sets: 3,
        reps: '10 reps',
        rest: '2 phút',
        breathing: 'Đẩy tạ qua đầu thở mạnh ra, hạ tạ ngang tai hít sâu vào.',
        target: 'Cơ vai trước và vai giữa (Deltoids)',
        notes: 'Không ngửa cổ, giữ lưng áp sát ghế tựa.'
      },
      {
        exerciseId: 'Triceps_Pushdown',
        name: 'Duỗi tay sau với cáp (Triceps Pushdown)',
        sets: 3,
        reps: '10 reps',
        rest: '1.5 phút',
        breathing: 'Co tay góc 90 độ hít vào, duỗi thẳng tay xuống thở dồn ra.',
        target: 'Cơ tay sau / tam đầu (Triceps)',
        notes: 'Giữ cùi chỏ cố định sát mạn sườn, không vung cùi chỏ.'
      },
      {
        exerciseId: 'Barbell_Curl',
        name: 'Cuốn bắp tay với tạ đòn (Barbell Curl)',
        sets: 3,
        reps: '10 reps',
        rest: '2 phút',
        breathing: 'Cuộn tay lên thở ra dứt khoát, hạ tạ có kiểm soát hít vào.',
        target: 'Bắp tay trước / con chuột (Biceps)',
        notes: 'Đứng vững, không dùng đà đu đưa lưng để nhấc tạ.'
      },
      {
        exerciseId: 'Crunches',
        name: 'Gập bụng trên trên thảm (Floor Crunch)',
        sets: 3,
        reps: '12 - 15 reps',
        rest: '1 phút',
        breathing: 'Gập người thở ép hết hơi ra, hạ vai chạm nhẹ thảm hít vào.',
        target: 'Cơ bụng trên',
        notes: 'Không dùng hai tay kéo cổ, tập trung cuộn khung xương sườn về rốn.'
      },
      {
        exerciseId: 'Flat_Bench_Lying_Leg_Raise',
        name: 'Nằm nâng chân tập bụng dưới (Lying Leg Raise)',
        sets: 3,
        reps: '12 reps',
        rest: '1 phút',
        breathing: 'Nâng chân lên thở ra, hạ chân xuống gần sát đất hít sâu vào.',
        target: 'Cơ bụng dưới (Lower Abs)',
        notes: 'Lưng dưới luôn ép sát sàn, không để hổng lưng khi hạ chân.'
      }
    ],
    cardioCooldown: '10 - 15 phút giãn cơ toàn thân thư giãn hệ thần kinh.'
  },
  {
    dayNumber: 5,
    id: 'thol-tang1-day5',
    title: 'Ngày 5: Chuyên Cardio Đốt Mỡ (Cardio Day)',
    tag: 'Cardio & Recovery',
    subtitle: 'Nâng cao sức bền tim phổi, quét sạch mỡ thừa và giải phóng năng lượng',
    warmup: '5 phút đi bộ chậm làm nóng nhịp tim.',
    exercises: [
      {
        exerciseId: 'Recumbent_Bike',
        name: 'Đạp xe tại chỗ (Stationary Bike)',
        sets: 1,
        reps: '20 - 25 phút',
        rest: 'Tự do',
        breathing: 'Hít sâu 2 nhịp bằng mũi, thở đều 2 nhịp bằng miệng nhịp nhàng.',
        target: 'Hệ tim mạch (Cardiovascular), cơ đùi và bắp chân',
        notes: 'Duy trì nhịp tim ở vùng đốt mỡ (Zone 2: khoảng 60-70% nhịp tim tối đa).'
      },
      {
        exerciseId: 'Walking_Treadmill',
        name: 'Đi bộ dốc máy chạy bộ (Incline Treadmill Walk)',
        sets: 1,
        reps: '20 phút',
        rest: 'Tự do',
        breathing: 'Thở đều theo nhịp bước chân, hít mũi thở miệng sâu.',
        target: 'Tiêu hao calo toàn thân, tăng độ dẻo dai khớp gối và cổ chân',
        notes: 'Cài đặt độ dốc từ 8 - 12%, tốc độ 4.5 - 5.5 km/h. Không vịn tay vào tay cầm.'
      }
    ],
    cardioCooldown: '10 phút thư giãn, tắm nước ấm và bổ sung Protein/Whey phục hồi.'
  }
];

export default function GymPhoCurriculum({ onStartSession }: GymPhoCurriculumProps) {
  const [subTab, setSubTab] = useState<'schedule' | 'philosophy' | 'breathing' | 'calculator' | 'nutrition'>('schedule');
  const [selectedDay, setSelectedDay] = useState(1);

  // Bộ tính HSHT
  const [heightCm, setHeightCm] = useState<number>(170);
  const [weightKg, setWeightKg] = useState<number>(65);

  useEffect(() => {
    // Tự động load số đo của người dùng nếu có
    const goal = getBodyGoal();
    if (goal?.heightCm) setHeightCm(goal.heightCm);
    const latest = getLatestBodyLog();
    if (latest?.weightKg) setWeightKg(latest.weightKg);
  }, []);

  // Tính toán chỉ số theo giáo án Duy Nguyễn THOL
  const hscc = heightCm - 100;
  const hscn = weightKg;
  const hsht = hscc - hscn;

  let physiqueStatus = '';
  let supplementAdvice = '';
  let adviceColor = '';

  if (hsht >= 10) {
    physiqueStatus = 'Cơ thể quá gầy, thiếu cơ và mỡ';
    supplementAdvice = 'Bạn thuộc thể trạng người gầy. Cần dùng Mass Gainer cao năng lượng (>1000 Calo/liều) kết hợp ăn uống giàu tinh bột tốt để tăng cân, tăng cơ trước.';
    adviceColor = 'text-amber-400 border-amber-500/30 bg-amber-500/10';
  } else if (hsht > 0 && hsht < 10) {
    physiqueStatus = 'Thể trạng hơi gầy hoặc tương đối cân đối';
    supplementAdvice = 'Cần dùng Mass Gainer trung năng lượng (khoảng 600 Calo/liều) hoặc kết hợp Whey Protein và bữa ăn dinh dưỡng đầy đủ để tăng cơ nạc tối ưu.';
    adviceColor = 'text-blue-400 border-blue-500/30 bg-blue-500/10';
  } else {
    physiqueStatus = 'Thể trạng đậm người, đủ cân hoặc có mỡ thừa';
    supplementAdvice = 'Tuyệt đối KHÔNG dùng Mass Gainer. Bạn cần dùng Protein hoàn chỉnh / Whey Protein Isolate (khoảng 130-150 Calo) kết hợp thâm hụt calo nhẹ để siết mỡ tăng cơ.';
    adviceColor = 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
  }

  // Khởi động buổi tập trực tiếp từ giáo án
  const handleLaunchDaySession = (dayData: typeof GYM_PHO_TANG_1_DAYS[0]) => {
    if (!onStartSession) return;

    const exercises: WorkoutExerciseItem[] = dayData.exercises.map((ex) => {
      const parsedSets = ex.sets || 3;
      const parsedReps = parseInt(ex.reps) || 10;

      const sets: SetLog[] = Array.from({ length: parsedSets }).map((_, i) => ({
        id: `set-thol-${Date.now()}-${i + 1}`,
        setNumber: i + 1,
        setType: 'normal',
        weightKg: 0,
        reps: parsedReps,
        isCompleted: false,
      }));

      return {
        exerciseId: ex.exerciseId,
        exerciseName: ex.name,
        primaryMuscle: ex.target.split(',')[0] || 'Cơ bắp',
        sets,
      };
    });

    const session: WorkoutSession = {
      id: `session-thol-${Date.now()}`,
      title: dayData.title,
      startTime: new Date().toISOString(),
      durationSeconds: 0,
      exercises,
      totalVolumeKg: 0,
      totalSets: 0,
    };

    onStartSession(session);
  };

  const currentDayData = GYM_PHO_TANG_1_DAYS.find((d) => d.dayNumber === selectedDay) || GYM_PHO_TANG_1_DAYS[0];

  return (
    <div className="max-w-4xl mx-auto px-4 space-y-6 pb-20">
      {/* Banner Giáo Án Gym Phổ */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950/60 via-zinc-900 to-black border border-emerald-500/30 p-6 md:p-8 shadow-2xl shadow-emerald-950/30">
        <div className="absolute -right-8 -top-8 w-44 h-44 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-mono">
                THOL Gym Center
              </span>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-teal-500/20 text-teal-300 border border-teal-500/40 font-mono">
                Duy Nguyễn
              </span>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-zinc-800 text-zinc-300">
                Tuần 1 - 4
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              GIÁO ÁN GYM PHỔ TẦNG 1
            </h2>
            <p className="text-sm md:text-base text-zinc-300 font-medium italic border-l-2 border-emerald-500 pl-3">
              “Thể hình phục vụ cuộc sống chứ đừng để cuộc sống phục vụ thể hình.”
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <div className="px-4 py-2.5 rounded-2xl bg-zinc-900/90 border border-zinc-700/80 text-center">
              <div className="text-[11px] font-bold uppercase text-zinc-400">Thời Lượng</div>
              <div className="text-lg font-black text-emerald-400 font-mono">5 Buổi / Tuần</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs chuyển đổi các phần kiến thức */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-2 scrollbar-none text-xs">
        <button
          onClick={() => setSubTab('schedule')}
          className={`px-3.5 py-2.5 rounded-xl font-bold transition flex items-center space-x-2 whitespace-nowrap active:scale-95 ${
            subTab === 'schedule'
              ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20 font-black'
              : 'bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800'
          }`}
        >
          <Dumbbell className="w-4 h-4" />
          <span>Lịch Tập 5 Ngày</span>
        </button>

        <button
          onClick={() => setSubTab('breathing')}
          className={`px-3.5 py-2.5 rounded-xl font-bold transition flex items-center space-x-2 whitespace-nowrap active:scale-95 ${
            subTab === 'breathing'
              ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20 font-black'
              : 'bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800'
          }`}
        >
          <Wind className="w-4 h-4 text-cyan-400" />
          <span>Hít Thở Yếm Khí</span>
        </button>

        <button
          onClick={() => setSubTab('calculator')}
          className={`px-3.5 py-2.5 rounded-xl font-bold transition flex items-center space-x-2 whitespace-nowrap active:scale-95 ${
            subTab === 'calculator'
              ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20 font-black'
              : 'bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800'
          }`}
        >
          <Calculator className="w-4 h-4 text-amber-400" />
          <span>Hệ Số Hình Thể (HSHT)</span>
        </button>

        <button
          onClick={() => setSubTab('nutrition')}
          className={`px-3.5 py-2.5 rounded-xl font-bold transition flex items-center space-x-2 whitespace-nowrap active:scale-95 ${
            subTab === 'nutrition'
              ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20 font-black'
              : 'bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800'
          }`}
        >
          <Apple className="w-4 h-4 text-rose-400" />
          <span>Dinh Dưỡng Xanh-Sạch-Đẹp</span>
        </button>

        <button
          onClick={() => setSubTab('philosophy')}
          className={`px-3.5 py-2.5 rounded-xl font-bold transition flex items-center space-x-2 whitespace-nowrap active:scale-95 ${
            subTab === 'philosophy'
              ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20 font-black'
              : 'bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800'
          }`}
        >
          <BookOpen className="w-4 h-4 text-emerald-400" />
          <span>Lộ Trình 3 Tầng</span>
        </button>
      </div>

      {/* 1. TAB: LỊCH TẬP 5 NGÀY */}
      {subTab === 'schedule' && (
        <div className="space-y-6">
          {/* Day Selector */}
          <div className="grid grid-cols-5 gap-2">
            {GYM_PHO_TANG_1_DAYS.map((d) => (
              <button
                key={d.dayNumber}
                onClick={() => setSelectedDay(d.dayNumber)}
                className={`py-3 px-2 rounded-2xl flex flex-col items-center justify-center transition active:scale-95 border ${
                  selectedDay === d.dayNumber
                    ? 'bg-emerald-500/15 border-emerald-500 text-emerald-400 font-black shadow-md shadow-emerald-500/10'
                    : 'bg-zinc-900/80 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
                }`}
              >
                <span className="text-[10px] font-bold uppercase tracking-wider">Ngày</span>
                <span className="text-xl font-black font-mono leading-none mt-0.5">{d.dayNumber}</span>
                <span className="text-[10px] truncate max-w-full text-center mt-1 text-zinc-400 font-medium">
                  {d.dayNumber === 1 ? 'Chân' : d.dayNumber === 2 ? 'Ngực-Bụng' : d.dayNumber === 3 ? 'Lưng-Xô' : d.dayNumber === 4 ? 'Vai-Tay' : 'Cardio'}
                </span>
              </button>
            ))}
          </div>

          {/* Current Day Details Card */}
          <div className="bg-zinc-900/90 rounded-3xl border border-zinc-800 p-5 md:p-6 space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/80 pb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    {currentDayData.tag}
                  </span>
                  <span className="text-xs text-zinc-400">{currentDayData.subtitle}</span>
                </div>
                <h3 className="text-xl font-black text-white mt-1">{currentDayData.title}</h3>
              </div>

              {onStartSession && (
                <button
                  onClick={() => handleLaunchDaySession(currentDayData)}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-black text-xs flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/20 hover:brightness-110 active:scale-95 transition"
                >
                  <Play className="w-4 h-4 fill-black" />
                  <span>TẬP BUỔI NÀY NGAY</span>
                </button>
              )}
            </div>

            {/* Khởi động */}
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-start space-x-3 text-xs">
              <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-amber-300">Khởi Động Trước Buổi Tập (10 phút): </span>
                <span className="text-zinc-300">{currentDayData.warmup}</span>
              </div>
            </div>

            {/* Danh sách bài tập */}
            <div className="space-y-3.5">
              <h4 className="text-xs font-black uppercase tracking-wider text-zinc-400 flex items-center space-x-1.5">
                <Dumbbell className="w-3.5 h-3.5 text-emerald-400" />
                <span>Danh Sách Bài Tập ({currentDayData.exercises.length} Bài)</span>
              </h4>

              <div className="grid gap-3">
                {currentDayData.exercises.map((ex, idx) => (
                  <div
                    key={ex.exerciseId + idx}
                    className="p-4 rounded-2xl bg-zinc-950/70 border border-zinc-800/80 hover:border-zinc-700 transition space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start space-x-2.5">
                        <span className="w-6 h-6 rounded-lg bg-zinc-800 text-emerald-400 font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <div>
                          <h5 className="font-extrabold text-sm text-zinc-100">{ex.name}</h5>
                          <p className="text-[11px] text-zinc-400 mt-0.5">
                            Mục tiêu: <span className="text-emerald-400 font-medium">{ex.target}</span>
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-xs font-mono font-black text-white bg-zinc-800/90 px-2 py-0.5 rounded-lg border border-zinc-700">
                          {ex.sets} hiệp × {ex.reps}
                        </div>
                        <div className="text-[10px] text-zinc-400 mt-0.5">Nghỉ {ex.rest}</div>
                      </div>
                    </div>

                    {/* Nhịp thở yếm khí */}
                    <div className="p-2.5 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-xs flex items-start space-x-2">
                      <Wind className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-cyan-300">Nhịp thở yếm khí: </span>
                        <span className="text-zinc-300 text-[11px]">{ex.breathing}</span>
                      </div>
                    </div>

                    {/* Mẹo kỹ thuật */}
                    {ex.notes && (
                      <p className="text-[11px] text-zinc-400 pl-2 border-l border-zinc-700 italic">
                        Lưu ý: {ex.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Hạ nhiệt và Cardio cuối buổi */}
            <div className="p-3.5 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-start space-x-3 text-xs">
              <Sparkles className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-teal-300">Kết Thúc & Hồi Phục: </span>
                <span className="text-zinc-300">{currentDayData.cardioCooldown}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. TAB: NGUYÊN TẮC HÍT THỞ YẾM KHÍ */}
      {subTab === 'breathing' && (
        <div className="bg-zinc-900/90 rounded-3xl border border-zinc-800 p-6 space-y-6 shadow-xl">
          <div className="flex items-center space-x-3 border-b border-zinc-800 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Wind className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">NGUYÊN TẮC HÍT THỞ YẾM KHÍ CHUẨN DUY NGUYỄN</h3>
              <p className="text-xs text-zinc-400">Bảo vệ cột sống, tăng 30% sức mạnh phát lực và siết chặt cơ bắp</p>
            </div>
          </div>

          {/* 3 Pha Động Tác */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 space-y-2">
              <div className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Pha 1: Kháng Lực (Dãn cơ)</span>
              </div>
              <h4 className="font-bold text-sm text-zinc-100">Hạ tạ / Nhả cơ từ từ</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Hít thật sâu bằng mũi vào khoang bụng, nén chặt khí trong ổ bụng để khóa cứng cột sống (yếm khí bảo vệ).
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 space-y-2">
              <div className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                <span>Pha 2: Phát Lực (Co cơ)</span>
              </div>
              <h4 className="font-bold text-sm text-zinc-100">Đẩy / Đạp / Kéo bộc phát</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Dồn toàn bộ áp lực cơ bắp đẩy tạ qua điểm nặng nhất (sticking point), đồng thời thở mạnh hoặc thở dồn ra bằng miệng.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 space-y-2">
              <div className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>Pha 3: Đỉnh Co Cơ (Peak)</span>
              </div>
              <h4 className="font-bold text-sm text-zinc-100">Siết chặt cơ 0.5 - 1s</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Nén chặt khí, siết căng tối đa nhóm cơ đích trước khi bắt đầu chu kỳ hạ tạ tiếp theo.
              </p>
            </div>
          </div>

          {/* Bí quyết trong lúc nghỉ */}
          <div className="p-4 rounded-2xl bg-zinc-950/90 border border-zinc-800/90 space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-emerald-400 flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Thời Gian Nghỉ & Bù Nước Trong Buổi Tập</span>
            </h4>
            <div className="text-xs text-zinc-300 space-y-2 leading-relaxed">
              <p>
                • <strong>Thời gian nghỉ:</strong> Mỗi hiệp nghỉ từ 1 đến 2 phút. Không nghỉ quá nguội làm mất nhiệt độ cơ bắp, nhưng cũng không tập dồn dập khiến tim đập quá tải.
              </p>
              <p>
                • <strong>Uống Intra-Workout:</strong> Trong lúc nghỉ giữa hiệp, uống từng ngụm nhỏ nước bù khoáng điện giải hoặc BCAA/EAA (nồng độ calo thấp) để chống dị hóa cơ và bù thể lực liên tục.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 3. TAB: HỆ SỐ HÌNH THỂ (HSHT) CALCULATOR */}
      {subTab === 'calculator' && (
        <div className="bg-zinc-900/90 rounded-3xl border border-zinc-800 p-6 space-y-6 shadow-xl">
          <div className="flex items-center space-x-3 border-b border-zinc-800 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">MÁY TÍNH HỆ SỐ HÌNH THỂ (HSHT DUY NGUYỄN)</h3>
              <p className="text-xs text-zinc-400">Xác định chuẩn thể trạng và lựa chọn dòng Thực Phẩm Bổ Sung tối ưu</p>
            </div>
          </div>

          {/* Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 space-y-2">
              <label className="text-xs font-bold text-zinc-400">Chiều cao của bạn (cm)</label>
              <div className="flex items-center space-x-3">
                <input
                  type="number"
                  value={heightCm}
                  onChange={(e) => setHeightCm(Number(e.target.value))}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-lg font-mono font-bold text-white focus:outline-none focus:border-emerald-500"
                />
                <span className="text-xs font-mono text-zinc-400 font-bold">cm</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 space-y-2">
              <label className="text-xs font-bold text-zinc-400">Cân nặng hiện tại (kg)</label>
              <div className="flex items-center space-x-3">
                <input
                  type="number"
                  step="0.5"
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-lg font-mono font-bold text-white focus:outline-none focus:border-emerald-500"
                />
                <span className="text-xs font-mono text-zinc-400 font-bold">kg</span>
              </div>
            </div>
          </div>

          {/* Công thức và Kết Quả */}
          <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800/80 space-y-4">
            <div className="grid grid-cols-3 gap-2 text-center border-b border-zinc-800 pb-4">
              <div>
                <div className="text-[10px] text-zinc-400 uppercase font-bold">Hệ số Chiều Cao (HSCC)</div>
                <div className="text-sm font-mono text-zinc-300 mt-1">{heightCm} - 100 =</div>
                <div className="text-xl font-mono font-black text-white">{hscc}</div>
              </div>

              <div>
                <div className="text-[10px] text-zinc-400 uppercase font-bold">Hệ số Cân Nặng (HSCN)</div>
                <div className="text-sm font-mono text-zinc-300 mt-1">Cân nặng =</div>
                <div className="text-xl font-mono font-black text-white">{hscn}</div>
              </div>

              <div>
                <div className="text-[10px] text-zinc-400 uppercase font-bold">Hệ số Hình Thể (HSHT)</div>
                <div className="text-sm font-mono text-zinc-300 mt-1">HSCC - HSCN =</div>
                <div className={`text-2xl font-mono font-black ${hsht >= 10 ? 'text-amber-400' : hsht > 0 ? 'text-blue-400' : 'text-emerald-400'}`}>
                  {hsht}
                </div>
              </div>
            </div>

            {/* Đánh giá và Khuyến nghị giáo án */}
            <div className={`p-4 rounded-2xl border ${adviceColor} space-y-2`}>
              <div className="flex items-center space-x-2">
                <Info className="w-4 h-4 shrink-0" />
                <span className="font-extrabold text-sm uppercase">Kết Quả Phân Loại: {physiqueStatus}</span>
              </div>
              <p className="text-xs leading-relaxed text-zinc-200">
                {supplementAdvice}
              </p>
            </div>
          </div>

          {/* Bảng chuẩn giáo án THOL */}
          <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/60 space-y-2.5 text-xs">
            <h4 className="font-bold text-zinc-300 uppercase tracking-wider text-[11px]">Bảng Tiêu Chuẩn Trong Giáo Án:</h4>
            <div className="grid sm:grid-cols-3 gap-2">
              <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800">
                <span className="font-bold text-amber-400 block">HSHT ≥ 10:</span>
                <span className="text-zinc-400 text-[11px]">Dùng Mass Gainer cao năng lượng (&gt;1000 Calo/serving).</span>
              </div>
              <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800">
                <span className="font-bold text-blue-400 block">0 &lt; HSHT &lt; 10:</span>
                <span className="text-zinc-400 text-[11px]">Dùng Mass Gainer trung năng lượng (~600 Calo/serving).</span>
              </div>
              <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800">
                <span className="font-bold text-emerald-400 block">HSHT ≤ 0:</span>
                <span className="text-zinc-400 text-[11px]">Dùng Protein hoàn chỉnh / Whey Protein (~150 Calo/serving).</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. TAB: DINH DƯỠNG XANH - SẠCH - ĐẸP */}
      {subTab === 'nutrition' && (
        <div className="bg-zinc-900/90 rounded-3xl border border-zinc-800 p-6 space-y-6 shadow-xl">
          <div className="flex items-center space-x-3 border-b border-zinc-800 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <Apple className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">DINH DƯỠNG THỂ HÌNH: XANH - SẠCH - ĐẸP</h3>
              <p className="text-xs text-zinc-400">Thay đổi tư duy ăn uống nhưng không cực đoan hóa ẩm thực</p>
            </div>
          </div>

          {/* Triết lý XANH - SẠCH - ĐẸP */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-400 font-mono">
                XANH
              </span>
              <h4 className="font-bold text-sm text-emerald-300">Rau củ & Trái cây tươi</h4>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Mỗi bữa ăn bắt buộc phải có rau xanh, chất xơ, vitamin chống oxy hóa giúp hỗ trợ tiêu hóa hấp thu lượng đạm dồi dào.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-teal-950/20 border border-teal-500/30 space-y-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-teal-500/20 text-teal-400 font-mono">
                SẠCH
              </span>
              <h4 className="font-bold text-sm text-teal-300">Hạn chế mỡ xấu & Uống đủ nước</h4>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Tăng cường nguồn đạm sạch (thịt nạc, cá, trứng), ít dầu mỡ động vật. Uống nước 4-5 lít/ngày (gấp đôi người bình thường).
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-400 font-mono">
                ĐẸP
              </span>
              <h4 className="font-bold text-sm text-amber-300">Gắn kết gia đình & Cuộc sống</h4>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Nấu nướng ngon mắt, đa dạng món ăn. Không ăn kiêng cô lập bản thân, giữ trọn vẹn các mối quan hệ xã hội ấm áp.
              </p>
            </div>
          </div>

          {/* Thần chú Calo */}
          <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-amber-400">
              THẦN CHÚ NĂNG LƯỢNG (CALO & ĐỐT MỠ)
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                <div className="text-[11px] text-zinc-400">1g Tinh Bột (Carb)</div>
                <div className="text-base font-black text-white font-mono mt-0.5">4 Calo</div>
              </div>
              <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                <div className="text-[11px] text-zinc-400">1g Chất Đạm (Protein)</div>
                <div className="text-base font-black text-emerald-400 font-mono mt-0.5">4 Calo</div>
              </div>
              <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                <div className="text-[11px] text-zinc-400">1g Chất Béo (Fat)</div>
                <div className="text-base font-black text-rose-400 font-mono mt-0.5">9 Calo</div>
              </div>
              <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                <div className="text-[11px] text-zinc-400">Đốt 1 kg Mỡ</div>
                <div className="text-base font-black text-cyan-400 font-mono mt-0.5">~ 7700 Calo</div>
              </div>
            </div>
            <p className="text-[11px] text-zinc-400 italic pt-1 text-center">
              * Muốn giảm 1kg mỡ thừa, bạn cần thâm hụt tổng cộng 7700 calo thông qua việc ăn sạch và tập luyện thể hình kiên trì.
            </p>
          </div>
        </div>
      )}

      {/* 5. TAB: LỘ TRÌNH 3 TẦNG (TẦNG 1, TẦNG 2, TẦNG 3) */}
      {subTab === 'philosophy' && (
        <div className="bg-zinc-900/90 rounded-3xl border border-zinc-800 p-6 space-y-6 shadow-xl">
          <div className="flex items-center space-x-3 border-b border-zinc-800 pb-4">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">LỘ TRÌNH PHÁT TRIỂN 3 TẦNG (THOL GYM PHỔ)</h3>
              <p className="text-xs text-zinc-400">Tiến trình khoa học từ người mới đến vận động viên hoàn thiện</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Tầng 1 */}
            <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500 text-black font-mono">
                  TẦNG 1: TUẦN 1 - 4
                </span>
                <span className="text-xs font-bold text-emerald-400 font-mono">Selectorized & Bodyweight</span>
              </div>
              <h4 className="font-extrabold text-base text-white">Máy Tạ Khối Căn Bản & Thể Trọng Cơ Thể</h4>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Tập trung tuyệt đối vào việc rèn luyện thói quen, kết nối não - cơ (mind-muscle connection), chống khô khớp và chấn thương. Học chuẩn nhịp thở yếm khí cho từng động tác.
              </p>
            </div>

            {/* Tầng 2 */}
            <div className="p-5 rounded-2xl bg-teal-950/20 border border-teal-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-teal-500 text-black font-mono">
                  TẦNG 2: TUẦN 5 - 8
                </span>
                <span className="text-xs font-bold text-teal-400 font-mono">Leverage - Máy Robot</span>
              </div>
              <h4 className="font-extrabold text-base text-white">Đòn Bẩy Robot Plate-Loaded</h4>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Tăng tải trọng cơ bắp với quỹ đạo chuẩn của máy robot, kích thích độc lập từng bên cơ trái/phải, phá vỡ giới hạn thích nghi của cơ thể.
              </p>
            </div>

            {/* Tầng 3 */}
            <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-500 text-black font-mono">
                  TẦNG 3: TUẦN 9 - 12
                </span>
                <span className="text-xs font-bold text-amber-400 font-mono">Free Weight Toàn Diện</span>
              </div>
              <h4 className="font-extrabold text-base text-white">Tạ Tự Do (Tạ Đòn & Tạ Đơn)</h4>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Đòi hỏi toàn bộ nhóm cơ lõi (core) và cơ thăng bằng tham gia. Tối đa hóa sức mạnh nguyên bản, mật độ cơ bắp dày dặn và tư thế chuẩn gymer đẳng cấp.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
