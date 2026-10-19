'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  ChevronRight, 
  Dumbbell, 
  ShieldCheck, 
  Zap, 
  X, 
  RotateCcw, 
  Calculator,
  Award,
  ArrowRight
} from 'lucide-react';
import { getLatestBodyLog, getBodyGoal } from '@/lib/bodyStorage';

interface LevelAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyLevel: (levelFilter: 'all' | 'thol' | 'thol-tang1' | 'thol-tang2' | 'thol-tang3' | 'newbie' | 'intermediate') => void;
}

export type ExperienceLevel = 'newbie_0_1m' | 'intermediate_1_3m' | 'advanced_3_6m' | 'pro_6m_plus';
export type JointHealth = 'good' | 'sensitive';
export type FitnessGoal = 'bulk' | 'cut' | 'health';

export default function LevelAdvisorModal({ isOpen, onClose, onApplyLevel }: LevelAdvisorModalProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [experience, setExperience] = useState<ExperienceLevel>('newbie_0_1m');
  const [jointHealth, setJointHealth] = useState<JointHealth>('good');
  const [goal, setGoal] = useState<FitnessGoal>('bulk');

  if (!isOpen) return null;

  // Lấy chỉ số chiều cao cân nặng hiện tại
  const userGoal = getBodyGoal();
  const latestLog = getLatestBodyLog();
  const heightCm = userGoal.heightCm || 170;
  const weightKg = latestLog?.weightKg || userGoal.startingWeightKg || 65;

  const hscc = heightCm - 100;
  const hscn = Math.round(weightKg * 10) / 10;
  const hsht = Math.round((hscc - hscn) * 10) / 10;

  // Thuật toán chẩn đoán Level chuẩn giáo án THOL Duy Nguyễn
  let recommendedLevelTitle = '';
  let recommendedLevelSub = '';
  let recommendedFilter: 'all' | 'thol' | 'thol-tang1' | 'thol-tang2' | 'thol-tang3' | 'newbie' | 'intermediate' = 'thol-tang1';
  let recommendedReason = '';
  let supplementAdvice = '';
  let badgeColor = '';

  if (experience === 'newbie_0_1m' || jointHealth === 'sensitive') {
    recommendedLevelTitle = 'GYM PHỔ TẦNG 1 (Tuần 1 - 4)';
    recommendedLevelSub = 'Selectorized (Máy Tạ Khối) & Bodyweight (Thể Trọng)';
    recommendedFilter = 'thol-tang1';
    recommendedReason = jointHealth === 'sensitive'
      ? 'Do bạn có tiền sử khớp nhạy cảm hoặc mỏi lưng/vai, máy tạ khối với quỹ đạo cố định là lựa chọn an toàn tuyệt đối để phục hồi và rèn luyện cơ bắp mà không sợ chấn thương.'
      : 'Bạn mới tập dưới 1 tháng. Giai đoạn này quan trọng nhất là tạo thói quen, xây dựng liên kết não - cơ (mind-muscle connection) và học thuần thục nhịp thở yếm khí chuẩn Duy Nguyễn.';
  } else if (experience === 'intermediate_1_3m') {
    recommendedLevelTitle = 'GYM PHỔ TẦNG 2 (Tuần 4 - 8)';
    recommendedLevelSub = 'Leverage (Máy Robot Đòn Bẩy Plate-loaded)';
    recommendedFilter = 'thol-tang2';
    recommendedReason = 'Bạn đã có nền tảng thể lực cơ bản và khớp đã dẻo dai. Đây là thời điểm vàng để chuyển sang máy Robot đòn bẩy Leverage, tăng tải trọng cơ bắp an toàn, khắc phục triệt để lệch cơ trái/phải.';
  } else if (experience === 'advanced_3_6m') {
    recommendedLevelTitle = 'GYM PHỔ TẦNG 3 (Tuần 8 - 12)';
    recommendedLevelSub = 'Free Weight & Máy Smith (Tạ Tự Do Chuẩn Form)';
    recommendedFilter = 'thol-tang3';
    recommendedReason = 'Cơ thể bạn đã sẵn sàng cho Tầng 3 Free Weight và máy Smith. Toàn bộ cơ thăng bằng và cơ lõi (core) sẽ được kích hoạt tối đa để xây dựng mật độ cơ bắp dày dặn, tạo form thể hình chuẩn Duy Nguyễn.';
  } else {
    recommendedLevelTitle = 'PHÂN HÓA ĐẨY - KÉO - CHÂN (PPL NÂNG CAO)';
    recommendedLevelSub = 'Heavy Compound & Hypertrophy Split';
    recommendedFilter = 'intermediate';
    recommendedReason = 'Với kinh nghiệm trên 6 tháng, bạn phù hợp với lịch tập phân hóa chuyên sâu Push - Pull - Legs để phá vỡ các giới hạn phát triển cơ bắp và đẩy tạ nặng có kiểm soát.';
  }

  // Khuyến nghị TPBS theo HSHT
  if (hsht >= 10) {
    supplementAdvice = 'Hệ số hình thể HSHT của bạn là +' + hsht + ' (thể trạng gầy). Cần ưu tiên dùng Mass Gainer cao năng lượng (>1000 Calo/serving) để tăng cơ tăng cân nền móng trước.';
    badgeColor = 'text-amber-400 border-amber-500/30 bg-amber-500/10';
  } else if (hsht > 0 && hsht < 10) {
    supplementAdvice = 'Hệ số hình thể HSHT của bạn là +' + hsht + ' (khá cân đối/hơi gầy). Nên dùng Mass trung năng lượng (~600 Calo) hoặc Whey Protein kết hợp ăn đủ đạm sạch.';
    badgeColor = 'text-blue-400 border-blue-500/30 bg-blue-500/10';
  } else {
    supplementAdvice = 'Hệ số hình thể HSHT của bạn là ' + hsht + ' (thể trạng dày người/có mỡ thừa). Tuyệt đối không dùng Mass, nên dùng Whey Protein Isolate kết hợp thâm hụt calo nhẹ để siết cơ.';
    badgeColor = 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
  }

  const handleApply = () => {
    localStorage.setItem('gym_user_suggested_level', recommendedFilter);
    onApplyLevel(recommendedFilter);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl max-w-xl w-full max-h-[92vh] overflow-y-auto p-5 sm:p-6 space-y-5 shadow-2xl">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-zinc-950">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-white flex items-center space-x-1.5">
                <span>TRỢ LÝ TƯ VẤN LEVEL TẬP LUYỆN</span>
              </h3>
              <p className="text-[11px] text-zinc-400">Đánh giá chuẩn theo Giáo án THOL Duy Nguyễn</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wizard Steps */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase text-emerald-400 tracking-wider">
                Câu hỏi 1/3: Thời gian tập gym
              </span>
              <h4 className="text-base font-bold text-white">Bạn đã tập luyện thể hình được bao lâu?</h4>
              <p className="text-xs text-zinc-400">Giúp xác định mức độ thích nghi của hệ cơ bắp và xương khớp</p>
            </div>

            <div className="space-y-2">
              {[
                {
                  id: 'newbie_0_1m',
                  title: 'Mới bắt đầu (Dưới 1 tháng) hoặc Mới đi tập lại',
                  desc: 'Chưa quen máy móc, chưa biết gồng bụng hay hít thở yếm khí chuẩn'
                },
                {
                  id: 'intermediate_1_3m',
                  title: 'Đã tập đều đặn từ 1 đến 3 tháng',
                  desc: 'Đã quen các máy tập cơ bản, cơ bắp đã có cảm giác gồng và đỡ mỏi hơn'
                },
                {
                  id: 'advanced_3_6m',
                  title: 'Đã tập từ 3 đến 6 tháng',
                  desc: 'Khớp vững, cơ lõi tốt, đã từng tập qua tạ đòn hoặc tạ đơn tự do'
                },
                {
                  id: 'pro_6m_plus',
                  title: 'Trên 6 tháng kinh nghiệm',
                  desc: 'Đã thuần thục các bài tập lớn, muốn theo đuổi giáo án phân hóa nặng'
                }
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setExperience(opt.id as ExperienceLevel)}
                  className={`w-full p-3.5 rounded-2xl border text-left transition flex items-start space-x-3 active:scale-[0.99] ${
                    experience === opt.id
                      ? 'bg-emerald-500/15 border-emerald-500 text-white shadow-md shadow-emerald-500/10'
                      : 'bg-zinc-900/80 border-zinc-800 text-zinc-300 hover:bg-zinc-900 hover:border-zinc-700'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border mt-0.5 flex items-center justify-center shrink-0 ${
                    experience === opt.id ? 'border-emerald-500 bg-emerald-500 text-black' : 'border-zinc-700'
                  }`}>
                    {experience === opt.id && <CheckCircle2 className="w-4 h-4 fill-black text-emerald-500" />}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-zinc-100">{opt.title}</div>
                    <div className="text-xs text-zinc-400 mt-0.5 leading-relaxed">{opt.desc}</div>
                  </div>
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setStep(2)}
              className="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-xs transition flex items-center justify-center space-x-1.5"
            >
              <span>Tiếp Theo: Tình Trạng Khớp</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-in fade-in">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase text-emerald-400 tracking-wider">
                Câu hỏi 2/3: Tình trạng an toàn xương khớp
              </span>
              <h4 className="text-base font-bold text-white">Bạn có từng đau khớp vai, gối hoặc thắt lưng không?</h4>
              <p className="text-xs text-zinc-400">Giáo án THOL luôn đặt tính an toàn khớp lên trên hết</p>
            </div>

            <div className="space-y-2.5">
              {[
                {
                  id: 'good',
                  title: 'Khớp hoàn toàn bình thường, không đau mỏi',
                  desc: 'Có thể tập luyện đầy đủ các góc độ chuyển động'
                },
                {
                  id: 'sensitive',
                  title: 'Thường mỏi lưng, ê khớp vai hoặc đau nhẹ gối',
                  desc: 'Bắt buộc dùng máy tạ khối cố định quỹ đạo, chưa nên gánh hay đẩy tạ tự do'
                }
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setJointHealth(opt.id as JointHealth)}
                  className={`w-full p-4 rounded-2xl border text-left transition flex items-start space-x-3 active:scale-[0.99] ${
                    jointHealth === opt.id
                      ? 'bg-emerald-500/15 border-emerald-500 text-white shadow-md shadow-emerald-500/10'
                      : 'bg-zinc-900/80 border-zinc-800 text-zinc-300 hover:bg-zinc-900 hover:border-zinc-700'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border mt-0.5 flex items-center justify-center shrink-0 ${
                    jointHealth === opt.id ? 'border-emerald-500 bg-emerald-500 text-black' : 'border-zinc-700'
                  }`}>
                    {jointHealth === opt.id && <CheckCircle2 className="w-4 h-4 fill-black text-emerald-500" />}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-zinc-100">{opt.title}</div>
                    <div className="text-xs text-zinc-400 mt-0.5 leading-relaxed">{opt.desc}</div>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-2 pt-1">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-1/3 py-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-300 font-bold text-xs hover:bg-zinc-800 transition"
              >
                Quay lại
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="w-2/3 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-xs transition flex items-center justify-center space-x-1.5"
              >
                <span>Tiếp Theo: Mục Tiêu</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 animate-in fade-in">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase text-emerald-400 tracking-wider">
                Câu hỏi 3/3: Mục tiêu lớn nhất
              </span>
              <h4 className="text-base font-bold text-white">Mục tiêu ưu tiên của bạn hiện tại là gì?</h4>
              <p className="text-xs text-zinc-400">Định hướng kết hợp giáo án thể hình và dinh dưỡng</p>
            </div>

            <div className="space-y-2.5">
              {[
                {
                  id: 'bulk',
                  title: 'Tăng cân & Tăng khối lượng cơ bắp (Xả cơ)',
                  desc: 'Muốn người dày dặn hơn, tăng kích thước ngực, tay, lưng và đùi'
                },
                {
                  id: 'cut',
                  title: 'Giảm mỡ & Cắt nét vóc dáng (Siết mỡ)',
                  desc: 'Muốn thon gọn vòng eo, giảm mỡ bụng, săn chắc toàn bộ cơ thể'
                },
                {
                  id: 'health',
                  title: 'Rèn luyện sức khỏe, tăng thể lực phục vụ cuộc sống',
                  desc: 'Muốn cơ thể năng động, giảm stress, không bị hụt hơi trong công việc'
                }
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setGoal(opt.id as FitnessGoal)}
                  className={`w-full p-4 rounded-2xl border text-left transition flex items-start space-x-3 active:scale-[0.99] ${
                    goal === opt.id
                      ? 'bg-emerald-500/15 border-emerald-500 text-white shadow-md shadow-emerald-500/10'
                      : 'bg-zinc-900/80 border-zinc-800 text-zinc-300 hover:bg-zinc-900 hover:border-zinc-700'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border mt-0.5 flex items-center justify-center shrink-0 ${
                    goal === opt.id ? 'border-emerald-500 bg-emerald-500 text-black' : 'border-zinc-700'
                  }`}>
                    {goal === opt.id && <CheckCircle2 className="w-4 h-4 fill-black text-emerald-500" />}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-zinc-100">{opt.title}</div>
                    <div className="text-xs text-zinc-400 mt-0.5 leading-relaxed">{opt.desc}</div>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-2 pt-1">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-1/3 py-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-300 font-bold text-xs hover:bg-zinc-800 transition"
              >
                Quay lại
              </button>
              <button
                type="button"
                onClick={() => setStep(4)}
                className="w-2/3 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:brightness-110 text-zinc-950 font-black text-xs transition flex items-center justify-center space-x-1.5 shadow-lg shadow-emerald-500/20"
              >
                <Sparkles className="w-4 h-4" />
                <span>Xem Kết Quả Đánh Giá</span>
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Final Recommendation Report */}
        {step === 4 && (
          <div className="space-y-5 animate-in zoom-in-95 duration-200">
            <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-950/60 via-zinc-900 to-zinc-950 border-2 border-emerald-500/50 space-y-3 relative overflow-hidden shadow-xl">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-500 text-black font-mono">
                  ĐỀ XUẤT TỐI ƯU CHO BẠN
                </span>
                <span className="text-xs text-zinc-400">Chuẩn THOL Duy Nguyễn</span>
              </div>

              <div>
                <h4 className="text-xl font-black text-white">{recommendedLevelTitle}</h4>
                <p className="text-xs font-mono text-emerald-400 font-semibold mt-0.5">{recommendedLevelSub}</p>
              </div>

              <p className="text-xs text-zinc-200 leading-relaxed bg-zinc-950/70 p-3 rounded-2xl border border-zinc-800">
                {recommendedReason}
              </p>
            </div>

            {/* Dinh dưỡng & HSHT */}
            <div className={`p-4 rounded-2xl border ${badgeColor} space-y-1.5 text-xs`}>
              <div className="flex items-center space-x-2">
                <Calculator className="w-4 h-4 shrink-0" />
                <span className="font-extrabold uppercase">Chỉ Dẫn Dinh Dưỡng Theo HSHT ({heightCm}cm / {weightKg}kg):</span>
              </div>
              <p className="text-zinc-200 leading-relaxed text-[11px] pl-6">
                {supplementAdvice}
              </p>
            </div>

            {/* Triết lý thể hình */}
            <div className="p-3 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 text-xs text-zinc-300 italic text-center">
              “Thể hình phục vụ cuộc sống chứ đừng để cuộc sống phục vụ thể hình.”
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={handleApply}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-zinc-950 font-black text-sm shadow-xl shadow-emerald-500/25 transition flex items-center justify-center space-x-2 active:scale-95"
              >
                <span>Áp Dụng Level Này & Bắt Đầu Tập Luyện</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full py-2.5 text-xs text-zinc-400 hover:text-white transition flex items-center justify-center space-x-1"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1" />
                <span>Làm lại bài trắc nghiệm đánh giá</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
