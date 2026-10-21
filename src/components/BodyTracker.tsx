'use client';

import React, { useState, useEffect } from 'react';
import { 
  Scale, 
  TrendingDown, 
  TrendingUp, 
  Plus, 
  Target, 
  Calendar, 
  ChevronRight, 
  ChevronDown, 
  Trash2, 
  Download, 
  Upload, 
  Activity, 
  Ruler, 
  Sparkles,
  Info,
  X,
  Check,
  Calculator,
  Apple,
  ArrowLeft
} from 'lucide-react';
import { BodyMetricLog, BodyGoal, GoalType } from '@/types/body';
import { 
  getBodyLogs, 
  saveBodyLog, 
  deleteBodyLog, 
  getBodyGoal, 
  saveBodyGoal, 
  calculateBMI 
} from '@/lib/bodyStorage';
import { exportAllData, importAllData } from '@/lib/backup';

interface BodyTrackerProps {
  onBackToHome?: () => void;
}

export default function BodyTracker({ onBackToHome }: BodyTrackerProps = {}) {
  const [logs, setLogs] = useState<BodyMetricLog[]>([]);
  const [goal, setGoal] = useState<BodyGoal>(getBodyGoal());
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [showMeasurementsInput, setShowMeasurementsInput] = useState(false);

  // New Log Form State
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);
  const [formWeight, setFormWeight] = useState<number>(72.0);
  const [formBodyFat, setFormBodyFat] = useState<string>('');
  const [formNotes, setFormNotes] = useState<string>('');
  
  // Tape Measurements Form State
  const [formChest, setFormChest] = useState<string>('');
  const [formWaist, setFormWaist] = useState<string>('');
  const [formHips, setFormHips] = useState<string>('');
  const [formArmLeft, setFormArmLeft] = useState<string>('');
  const [formArmRight, setFormArmRight] = useState<string>('');
  const [formThighLeft, setFormThighLeft] = useState<string>('');
  const [formThighRight, setFormThighRight] = useState<string>('');
  const [formCalves, setFormCalves] = useState<string>('');
  const [formShoulders, setFormShoulders] = useState<string>('');

  // Goal Form State
  const [goalHeight, setGoalHeight] = useState(172);
  const [goalStartWeight, setGoalStartWeight] = useState(75.0);
  const [goalTargetWeight, setGoalTargetWeight] = useState(69.5);
  const [goalType, setGoalType] = useState<GoalType>('cut');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const loadedLogs = getBodyLogs();
    const loadedGoal = getBodyGoal();
    setLogs(loadedLogs);
    setGoal(loadedGoal);

    if (loadedLogs.length > 0) {
      setFormWeight(loadedLogs[0].weightKg);
    }
    setGoalHeight(loadedGoal.heightCm);
    setGoalStartWeight(loadedGoal.startingWeightKg);
    setGoalTargetWeight(loadedGoal.targetWeightKg);
    setGoalType(loadedGoal.goalType);
  };

  const handleSaveLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (formWeight <= 0) return;

    const newLog: BodyMetricLog = {
      id: `log-${Date.now()}`,
      date: formDate,
      weightKg: Math.round(formWeight * 10) / 10,
      bodyFatPercent: formBodyFat ? parseFloat(formBodyFat) : undefined,
      notes: formNotes.trim() || undefined,
      measurements: {
        chestCm: formChest ? parseFloat(formChest) : undefined,
        waistCm: formWaist ? parseFloat(formWaist) : undefined,
        hipsCm: formHips ? parseFloat(formHips) : undefined,
        leftBicepCm: formArmLeft ? parseFloat(formArmLeft) : undefined,
        rightBicepCm: formArmRight ? parseFloat(formArmRight) : undefined,
        leftThighCm: formThighLeft ? parseFloat(formThighLeft) : undefined,
        rightThighCm: formThighRight ? parseFloat(formThighRight) : undefined,
        calvesCm: formCalves ? parseFloat(formCalves) : undefined,
        shouldersCm: formShoulders ? parseFloat(formShoulders) : undefined,
      }
    };

    saveBodyLog(newLog);
    loadData();
    setIsLogModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormBodyFat('');
    setFormNotes('');
    setFormChest('');
    setFormWaist('');
    setFormHips('');
    setFormArmLeft('');
    setFormArmRight('');
    setFormThighLeft('');
    setFormThighRight('');
    setFormCalves('');
    setFormShoulders('');
    setShowMeasurementsInput(false);
  };

  const handleSaveGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const newGoal: BodyGoal = {
      heightCm: goalHeight,
      startingWeightKg: goalStartWeight,
      targetWeightKg: goalTargetWeight,
      goalType: goalType,
      startDate: goal.startDate || new Date().toISOString().split('T')[0]
    };
    saveBodyGoal(newGoal);
    setGoal(newGoal);
    setIsGoalModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa bản ghi chỉ số này không?')) {
      deleteBodyLog(id);
      loadData();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content && importAllData(content)) {
        alert('Khôi phục dữ liệu thành công!');
        loadData();
      } else {
        alert('Tệp dữ liệu không hợp lệ!');
      }
    };
    reader.readAsText(file);
  };

  // Calculations
  const latestLog = logs[0] || null;
  const previousLog = logs[1] || null;
  const oldestLog = logs[logs.length - 1] || null;

  const currentWeight = latestLog ? latestLog.weightKg : goal.startingWeightKg;
  const weightChangeRecent = latestLog && previousLog ? latestLog.weightKg - previousLog.weightKg : 0;
  const totalWeightChange = latestLog && oldestLog ? latestLog.weightKg - oldestLog.weightKg : 0;

  const bmiInfo = calculateBMI(currentWeight, goal.heightCm);

  // Goal Progress Calculation
  let progressPercent = 0;
  const totalTargetDiff = Math.abs(goal.startingWeightKg - goal.targetWeightKg);
  if (totalTargetDiff > 0 && latestLog) {
    const currentProgressDiff = Math.abs(goal.startingWeightKg - currentWeight);
    progressPercent = Math.min(100, Math.max(0, Math.round((currentProgressDiff / totalTargetDiff) * 100)));
  }

  // Measurements comparison
  const latestMeasurements = latestLog?.measurements;
  const oldestMeasurements = oldestLog?.measurements;

  // Chart coordinate mapping (chronological order)
  const chartData = [...logs].reverse();
  const minW = chartData.length > 0 ? Math.min(...chartData.map(d => d.weightKg), goal.targetWeightKg) - 1.5 : 60;
  const maxW = chartData.length > 0 ? Math.max(...chartData.map(d => d.weightKg), goal.startingWeightKg) + 1.5 : 85;
  const rangeW = maxW - minW || 1;

  return (
    <div className="max-w-4xl mx-auto px-4 pb-24 space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          {onBackToHome && (
            <button
              type="button"
              onClick={onBackToHome}
              className="px-2.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 transition shrink-0 flex items-center space-x-1.5 text-xs font-bold active:scale-95 shadow-sm"
              title="Quay lại Trang Chủ Giáo Án"
            >
              <ArrowLeft className="w-4 h-4 text-emerald-400 stroke-[2.5]" />
              <span>Trang Chủ</span>
            </button>
          )}
          <div>
            <h2 className="text-xl font-black text-white flex items-center space-x-2">
              <Scale className="w-6 h-6 text-emerald-400" />
              <span>THEO DÕI HÌNH THỂ & CHỈ SỐ</span>
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Quản lý cân nặng, số đo các vòng, tỷ lệ mỡ và tiến độ mục tiêu vóc dáng
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsGoalModalOpen(true)}
            className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold transition flex items-center space-x-1.5 border border-zinc-700"
          >
            <Target className="w-3.5 h-3.5 text-amber-400" />
            <span>Mục Tiêu</span>
          </button>

          <button
            onClick={() => {
              resetForm();
              setIsLogModalOpen(true);
            }}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-black transition flex items-center space-x-1.5 shadow-lg shadow-emerald-500/20"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Ghi Chỉ Số Mới</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Card 1: Current Weight */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[11px] font-semibold">CÂN NẶNG HIỆN TẠI</span>
            <Scale className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2">
            <div className="flex items-baseline space-x-1.5">
              <span className="text-2xl sm:text-3xl font-black text-white">
                {latestLog ? currentWeight.toFixed(1) : '--'}
              </span>
              <span className="text-xs text-zinc-400 font-bold">kg</span>
            </div>
            <div className="mt-1 flex items-center space-x-1 text-[11px]">
              {!latestLog ? (
                <span className="text-zinc-500 font-medium">Chưa có bản ghi nào</span>
              ) : weightChangeRecent === 0 ? (
                <span className="text-zinc-500 font-medium">Bằng lần đo trước</span>
              ) : weightChangeRecent < 0 ? (
                <span className="text-emerald-400 font-bold flex items-center">
                  <TrendingDown className="w-3 h-3 mr-0.5" />
                  {Math.abs(weightChangeRecent).toFixed(1)} kg
                </span>
              ) : (
                <span className="text-blue-400 font-bold flex items-center">
                  <TrendingUp className="w-3 h-3 mr-0.5" />
                  +{weightChangeRecent.toFixed(1)} kg
                </span>
              )}
              {latestLog && <span className="text-zinc-600 text-[10px]">so với lần trước</span>}
            </div>
          </div>
        </div>

        {/* Card 2: BMI Metric */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[11px] font-semibold">CHỈ SỐ BMI</span>
            <Activity className="w-4 h-4 text-teal-400" />
          </div>
          <div className="mt-2">
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl sm:text-3xl font-black text-white">{bmiInfo.bmi}</span>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full bg-zinc-800 border border-zinc-700 ${bmiInfo.color}`}>
                {bmiInfo.category}
              </span>
            </div>
            <p className="mt-1 text-[11px] text-zinc-400">
              Chiều cao chuẩn: <span className="text-zinc-200 font-semibold">{goal.heightCm} cm</span>
            </p>
          </div>
        </div>

        {/* Card 3: Body Fat % */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[11px] font-semibold">TỶ LỆ MỠ CƠ THỂ</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2">
            <div className="flex items-baseline space-x-1.5">
              <span className="text-2xl sm:text-3xl font-black text-white">
                {latestLog?.bodyFatPercent ? `${latestLog.bodyFatPercent}%` : '--'}
              </span>
            </div>
            <p className="mt-1 text-[11px] text-zinc-400">
              {latestLog?.bodyFatPercent ? (
                latestLog.bodyFatPercent <= 15 ? 'Cắt nét (Athletic)' : 'Khỏe mạnh / Bình thường'
              ) : (
                'Chưa cập nhật % mỡ'
              )}
            </p>
          </div>
        </div>

        {/* Card 4: Goal Progress */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[11px] font-semibold">MỤC TIÊU ({goal.goalType.toUpperCase()})</span>
            <Target className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2">
            <div className="flex items-baseline justify-between">
              <span className="text-xl sm:text-2xl font-black text-white">{goal.targetWeightKg} kg</span>
              <span className="text-xs font-bold text-emerald-400">{progressPercent}%</span>
            </div>
            {/* Progress Bar */}
            <div className="w-full bg-zinc-800 h-2 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* THOL Gym Pho - HSHT & Nutrition Card */}
      {(() => {
        const hscc = goal.heightCm - 100;
        const hscn = Math.round(currentWeight * 10) / 10;
        const hsht = Math.round((hscc - hscn) * 10) / 10;

        let statusText = '';
        let adviceText = '';
        let badgeColor = '';

        if (hsht >= 10) {
          statusText = 'Cơ thể quá gầy, thiếu cơ và mỡ';
          adviceText = 'Nên dùng Mass Gainer cao năng lượng (>1000 Calo/liều), tập trung nạp tinh bột chậm và tăng cơ trước.';
          badgeColor = 'text-amber-400 border-amber-500/30 bg-amber-500/10';
        } else if (hsht > 0 && hsht < 10) {
          statusText = 'Thể trạng hơi gầy hoặc tương đối cân đối';
          adviceText = 'Nên dùng Mass Gainer trung năng lượng (~600 Calo/liều) hoặc kết hợp Whey Protein để tăng cơ nạc tối ưu.';
          badgeColor = 'text-blue-400 border-blue-500/30 bg-blue-500/10';
        } else {
          statusText = 'Thể trạng đậm người, đủ cân hoặc có mỡ';
          adviceText = 'Tuyệt đối KHÔNG dùng Mass. Dùng Protein hoàn chỉnh / Whey Protein Isolate (~150 Calo) kết hợp siết mỡ tăng cơ.';
          badgeColor = 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
        }

        return (
          <div className="bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 border border-zinc-800 rounded-3xl p-5 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                  <Calculator className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white flex items-center space-x-2">
                    <span>HỆ SỐ HÌNH THỂ (HSHT DUY NGUYỄN THOL)</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-bold">
                      GIÁO ÁN
                    </span>
                  </h3>
                  <p className="text-[11px] text-zinc-400">
                    Công thức chuẩn đoán thể trạng & định hướng dòng Thực Phẩm Bổ Sung tối ưu
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2 text-xs font-mono self-start sm:self-auto">
                <span className="text-zinc-400">HSHT của bạn:</span>
                <span className={`text-base font-black px-2.5 py-0.5 rounded-xl border ${badgeColor}`}>
                  {hsht > 0 ? `+${hsht}` : hsht}
                </span>
              </div>
            </div>

            {/* Calculations Breakdown */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-xl bg-zinc-950/70 border border-zinc-800/80">
                <div className="text-[10px] text-zinc-400 font-semibold">Hệ Số Chiều Cao (HSCC)</div>
                <div className="text-[11px] text-zinc-500 mt-0.5">{goal.heightCm} - 100</div>
                <div className="text-sm font-black text-white font-mono mt-0.5">{hscc}</div>
              </div>
              <div className="p-2.5 rounded-xl bg-zinc-950/70 border border-zinc-800/80">
                <div className="text-[10px] text-zinc-400 font-semibold">Hệ Số Cân Nặng (HSCN)</div>
                <div className="text-[11px] text-zinc-500 mt-0.5">Cân nặng hiện tại</div>
                <div className="text-sm font-black text-white font-mono mt-0.5">{hscn} kg</div>
              </div>
              <div className="p-2.5 rounded-xl bg-zinc-950/70 border border-zinc-800/80">
                <div className="text-[10px] text-zinc-400 font-semibold">Hệ Số Hình Thể (HSHT)</div>
                <div className="text-[11px] text-zinc-500 mt-0.5">HSCC - HSCN</div>
                <div className={`text-sm font-black font-mono mt-0.5 ${hsht >= 10 ? 'text-amber-400' : hsht > 0 ? 'text-blue-400' : 'text-emerald-400'}`}>
                  {hsht}
                </div>
              </div>
            </div>

            {/* Assessment & Advice */}
            <div className={`p-3.5 rounded-2xl border ${badgeColor} space-y-1 text-xs`}>
              <div className="font-extrabold uppercase tracking-wide flex items-center space-x-1.5">
                <Info className="w-4 h-4 shrink-0" />
                <span>Đánh giá: {statusText}</span>
              </div>
              <p className="text-zinc-300 leading-relaxed text-[11px] pl-5">
                {adviceText}
              </p>
            </div>

            {/* Nutrition Tip Collapsible / Quick info */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[11px]">
              <div className="p-2 rounded-xl bg-zinc-950/50 border border-zinc-800/60">
                <span className="text-zinc-400 block text-[10px]">1g Carb (Tinh bột)</span>
                <span className="font-mono font-bold text-white">4 Calo</span>
              </div>
              <div className="p-2 rounded-xl bg-zinc-950/50 border border-zinc-800/60">
                <span className="text-zinc-400 block text-[10px]">1g Protein (Đạm)</span>
                <span className="font-mono font-bold text-emerald-400">4 Calo</span>
              </div>
              <div className="p-2 rounded-xl bg-zinc-950/50 border border-zinc-800/60">
                <span className="text-zinc-400 block text-[10px]">1g Fat (Chất béo)</span>
                <span className="font-mono font-bold text-rose-400">9 Calo</span>
              </div>
              <div className="p-2 rounded-xl bg-zinc-950/50 border border-zinc-800/60">
                <span className="text-zinc-400 block text-[10px]">Đốt 1 kg Mỡ</span>
                <span className="font-mono font-bold text-cyan-400">~7.700 Calo</span>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Weight Trend Chart */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-black text-white flex items-center space-x-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>BIỂU ĐỒ DIỄN BIẾN CÂN NẶNG</span>
            </h3>
            <p className="text-[11px] text-zinc-400">Đường biểu diễn theo các mốc thời gian ghi nhận</p>
          </div>

          <div className="flex items-center space-x-3 text-[11px]">
            <div className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
              <span className="text-zinc-300">Thực tế</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="w-2.5 h-0.5 bg-amber-400 inline-block border-b border-dashed border-amber-400" />
              <span className="text-zinc-300">Mục tiêu ({goal.targetWeightKg}kg)</span>
            </div>
          </div>
        </div>

        {chartData.length < 2 ? (
          <div className="h-48 flex items-center justify-center border border-dashed border-zinc-800 rounded-2xl text-zinc-500 text-xs">
            Cần ít nhất 2 bản ghi để hiển thị biểu đồ xu hướng.
          </div>
        ) : (
          <div className="relative w-full h-56 pt-2">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 500 160">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Goal Target Line */}
              {(() => {
                const targetY = 140 - ((goal.targetWeightKg - minW) / rangeW) * 120;
                return (
                  <g>
                    <line
                      x1="20"
                      y1={targetY}
                      x2="480"
                      y2={targetY}
                      stroke="#f59e0b"
                      strokeWidth="1.5"
                      strokeDasharray="4 4"
                      opacity="0.8"
                    />
                    <text x="485" y={targetY + 3} fill="#f59e0b" fontSize="9" fontWeight="bold">
                      {goal.targetWeightKg}kg
                    </text>
                  </g>
                );
              })()}

              {/* Area & Line path calculation */}
              {(() => {
                const points = chartData.map((d, index) => {
                  const x = 30 + (index / (chartData.length - 1)) * 430;
                  const y = 140 - ((d.weightKg - minW) / rangeW) * 120;
                  return { x, y, ...d };
                });

                const linePath = points.reduce((acc, curr, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${curr.x} ${curr.y}`, '');
                const areaPath = `${linePath} L ${points[points.length - 1].x} 150 L ${points[0].x} 150 Z`;

                return (
                  <>
                    <path d={areaPath} fill="url(#chartGradient)" />
                    <path d={linePath} fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

                    {points.map((p, idx) => (
                      <g key={idx} className="group cursor-pointer">
                        <circle cx={p.x} cy={p.y} r="4.5" fill="#09090b" stroke="#10b981" strokeWidth="2.5" />
                        {/* Point label on hover or default */}
                        <text
                          x={p.x}
                          y={p.y - 10}
                          textAnchor="middle"
                          fill="#ffffff"
                          fontSize="10"
                          fontWeight="bold"
                        >
                          {p.weightKg}
                        </text>
                        {/* Date label at bottom */}
                        <text
                          x={p.x}
                          y="158"
                          textAnchor="middle"
                          fill="#71717a"
                          fontSize="8"
                        >
                          {p.date.slice(5)}
                        </text>
                      </g>
                    ))}
                  </>
                );
              })()}
            </svg>
          </div>
        )}
      </div>

      {/* Body Tape Measurements Grid (Số đo các vòng) */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black text-white flex items-center space-x-2">
              <Ruler className="w-4 h-4 text-emerald-400" />
              <span>SỐ ĐO CÁC VÒNG CƠ THỂ (TAPE MEASUREMENTS)</span>
            </h3>
            <p className="text-[11px] text-zinc-400">Theo dõi sự tăng trưởng cơ bắp và thu gọn vòng eo</p>
          </div>
          <span className="text-[10px] font-bold px-2 py-1 rounded-lg bg-zinc-800 text-zinc-300">
            Đơn vị: Centimet (cm)
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {[
            { label: 'Vòng Ngực', current: latestMeasurements?.chestCm, start: oldestMeasurements?.chestCm, highlight: 'text-emerald-400' },
            { label: 'Vòng Eo / Bụng', current: latestMeasurements?.waistCm, start: oldestMeasurements?.waistCm, highlight: 'text-amber-400' },
            { label: 'Vòng Mông', current: latestMeasurements?.hipsCm, start: oldestMeasurements?.hipsCm, highlight: 'text-teal-400' },
            { label: 'Bắp Tay Trái', current: latestMeasurements?.leftBicepCm, start: oldestMeasurements?.leftBicepCm, highlight: 'text-blue-400' },
            { label: 'Bắp Tay Phải', current: latestMeasurements?.rightBicepCm, start: oldestMeasurements?.rightBicepCm, highlight: 'text-blue-400' },
            { label: 'Đùi Trái', current: latestMeasurements?.leftThighCm, start: oldestMeasurements?.leftThighCm, highlight: 'text-indigo-400' },
            { label: 'Đùi Phải', current: latestMeasurements?.rightThighCm, start: oldestMeasurements?.rightThighCm, highlight: 'text-indigo-400' },
            { label: 'Bắp Chuối', current: latestMeasurements?.calvesCm, start: oldestMeasurements?.calvesCm, highlight: 'text-zinc-300' },
          ].map((item, index) => {
            const diff = item.current && item.start ? item.current - item.start : 0;
            return (
              <div key={index} className="bg-zinc-950/60 border border-zinc-800/80 rounded-2xl p-3">
                <span className="text-[10px] font-bold text-zinc-400 block">{item.label}</span>
                <div className="mt-1 flex items-baseline justify-between">
                  <span className="text-xl font-black text-white">
                    {item.current ? `${item.current}` : '--'}
                  </span>
                  {item.current && diff !== 0 && (
                    <span className={`text-[10px] font-bold ${diff > 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {diff > 0 ? `+${diff.toFixed(1)}` : `${diff.toFixed(1)}`} cm
                    </span>
                  )}
                </div>
                <div className="text-[9px] text-zinc-500 mt-0.5">
                  Ban đầu: {item.start ? `${item.start} cm` : '--'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* History Log Table */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-white flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-emerald-400" />
            <span>NHẬT KÝ CÂN ĐO THEO NGÀY</span>
          </h3>
          <span className="text-xs text-zinc-400">{logs.length} bản ghi</span>
        </div>

        <div className="space-y-2">
          {logs.length === 0 ? (
            <div className="p-8 text-center text-zinc-500 text-xs border border-dashed border-zinc-800 rounded-2xl space-y-1">
              <Scale className="w-6 h-6 mx-auto text-zinc-600 mb-1" />
              <p className="font-bold text-zinc-400">Chưa có bản ghi cân nặng nào</p>
              <p className="text-[11px] text-zinc-500">
                Bấm nút <strong className="text-emerald-400">&quot;Ghi Chỉ Số Mới&quot;</strong> ở góc trên để bắt đầu theo dõi số cân và số đo cơ thể thực tế của bạn.
              </p>
            </div>
          ) : (
            logs.map((item, index) => {
            const nextItem = logs[index + 1];
            const delta = nextItem ? item.weightKg - nextItem.weightKg : 0;

            return (
              <div
                key={item.id}
                className="bg-zinc-950/60 border border-zinc-800/60 rounded-2xl p-3 flex items-center justify-between hover:border-zinc-700 transition"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-300 font-bold text-xs">
                    {item.date.slice(8, 10)}/{item.date.slice(5, 7)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-base font-extrabold text-white">{item.weightKg.toFixed(1)} kg</span>
                      {delta !== 0 && (
                        <span className={`text-[11px] font-bold ${delta < 0 ? 'text-emerald-400' : 'text-blue-400'}`}>
                          {delta < 0 ? `${delta.toFixed(1)}` : `+${delta.toFixed(1)}`} kg
                        </span>
                      )}
                      {item.bodyFatPercent && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          {item.bodyFatPercent}% mỡ
                        </span>
                      )}
                    </div>
                    {item.notes && <p className="text-[11px] text-zinc-400 italic mt-0.5">{item.notes}</p>}
                    {/* Measurements snippet */}
                    {item.measurements && Object.values(item.measurements).some(v => v !== undefined) && (
                      <p className="text-[10px] text-zinc-500 mt-0.5">
                        {item.measurements.waistCm && `Eo: ${item.measurements.waistCm}cm `}
                        {item.measurements.chestCm && `| Ngực: ${item.measurements.chestCm}cm `}
                        {item.measurements.rightBicepCm && `| Tay: ${item.measurements.rightBicepCm}cm`}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 rounded-xl text-zinc-500 hover:text-red-400 hover:bg-zinc-800 transition"
                    title="Xóa bản ghi"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
        </div>
      </div>

      {/* Backup and Restore Row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-zinc-950 border border-zinc-800/80 text-xs">
        <div>
          <span className="font-bold text-zinc-200">Dự phòng dữ liệu Gym & Body:</span>
          <p className="text-zinc-500 text-[11px]">Tải file sao lưu về máy để không lo mất lịch sử khi đổi trình duyệt</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => exportAllData()}
            className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold transition flex items-center space-x-1.5"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Xuất JSON</span>
          </button>
          <label className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold transition flex items-center space-x-1.5 cursor-pointer">
            <Upload className="w-3.5 h-3.5 text-teal-400" />
            <span>Nhập File</span>
            <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>
      </div>

      {/* Modal: Ghi nhận chỉ số mới */}
      {isLogModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-zinc-900 border border-zinc-700 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-base font-extrabold text-white flex items-center space-x-2">
                <Scale className="w-5 h-5 text-emerald-400" />
                <span>Ghi Nhận Chỉ Số Mới</span>
              </h3>
              <button onClick={() => setIsLogModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveLog} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-zinc-400 block mb-1">Ngày ghi nhận</label>
                <input
                  type="date"
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Weight with quick buttons */}
              <div>
                <label className="text-xs font-bold text-zinc-400 block mb-1">Cân nặng (kg) *</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={formWeight}
                    onChange={(e) => setFormWeight(parseFloat(e.target.value) || 0)}
                    className="flex-1 bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-lg font-black text-white focus:outline-none focus:border-emerald-500"
                  />
                  <div className="flex items-center space-x-1">
                    <button
                      type="button"
                      onClick={() => setFormWeight((w) => Math.round((w - 0.5) * 10) / 10)}
                      className="px-2 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-xs font-bold text-zinc-300"
                    >
                      -0.5
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormWeight((w) => Math.round((w + 0.5) * 10) / 10)}
                      className="px-2 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-xs font-bold text-zinc-300"
                    >
                      +0.5
                    </button>
                  </div>
                </div>
              </div>

              {/* Body fat */}
              <div>
                <label className="text-xs font-bold text-zinc-400 block mb-1">Tỷ lệ mỡ Body Fat (% - tùy chọn)</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="Ví dụ: 18.5"
                  value={formBodyFat}
                  onChange={(e) => setFormBodyFat(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Expandable Tape measurements */}
              <div className="border border-zinc-800 rounded-2xl p-3 bg-zinc-950/40">
                <button
                  type="button"
                  onClick={() => setShowMeasurementsInput(!showMeasurementsInput)}
                  className="w-full flex items-center justify-between text-xs font-bold text-zinc-300 hover:text-emerald-400 transition"
                >
                  <span className="flex items-center space-x-1.5">
                    <Ruler className="w-4 h-4 text-emerald-400" />
                    <span>Nhập số đo các vòng cơ thể (cm)</span>
                  </span>
                  {showMeasurementsInput ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>

                {showMeasurementsInput && (
                  <div className="mt-3 grid grid-cols-2 gap-2.5 pt-2 border-t border-zinc-800">
                    <div>
                      <label className="text-[10px] font-semibold text-zinc-400">Vòng Ngực</label>
                      <input
                        type="number"
                        step="0.5"
                        placeholder="cm"
                        value={formChest}
                        onChange={(e) => setFormChest(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-zinc-400">Vòng Eo / Bụng</label>
                      <input
                        type="number"
                        step="0.5"
                        placeholder="cm"
                        value={formWaist}
                        onChange={(e) => setFormWaist(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-zinc-400">Vòng Mông</label>
                      <input
                        type="number"
                        step="0.5"
                        placeholder="cm"
                        value={formHips}
                        onChange={(e) => setFormHips(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-zinc-400">Vòng Vai</label>
                      <input
                        type="number"
                        step="0.5"
                        placeholder="cm"
                        value={formShoulders}
                        onChange={(e) => setFormShoulders(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-zinc-400">Bắp Tay Phải</label>
                      <input
                        type="number"
                        step="0.1"
                        placeholder="cm"
                        value={formArmRight}
                        onChange={(e) => setFormArmRight(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-zinc-400">Bắp Đùi Phải</label>
                      <input
                        type="number"
                        step="0.5"
                        placeholder="cm"
                        value={formThighRight}
                        onChange={(e) => setFormThighRight(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1 text-xs text-white"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Notes */}
              <div>
                <label className="text-xs font-bold text-zinc-400 block mb-1">Ghi chú thể trạng / cảm nhận</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Cơ bụng nét, sức bền tốt..."
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsLogModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-zinc-300"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-xs font-black text-zinc-950 shadow-lg shadow-emerald-500/20"
                >
                  Lưu Bản Ghi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Cài đặt mục tiêu */}
      {isGoalModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-700 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-base font-extrabold text-white flex items-center space-x-2">
                <Target className="w-5 h-5 text-amber-400" />
                <span>Cài Đặt Mục Tiêu Thể Hình</span>
              </h3>
              <button onClick={() => setIsGoalModalOpen(false)} className="text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveGoal} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-zinc-400 block mb-1">Định hướng mục tiêu</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'cut', label: 'Cắt Mỡ (Cut)' },
                    { id: 'bulk', label: 'Xả Cơ (Bulk)' },
                    { id: 'maintain', label: 'Giữ Dáng' },
                  ].map((mode) => (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setGoalType(mode.id as GoalType)}
                      className={`py-2 text-xs font-bold rounded-xl border transition ${
                        goalType === mode.id
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                          : 'bg-zinc-950 border-zinc-800 text-zinc-400'
                      }`}
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-400 block mb-1">Chiều cao (cm) - dùng tính chuẩn BMI</label>
                <input
                  type="number"
                  required
                  value={goalHeight}
                  onChange={(e) => setGoalHeight(parseInt(e.target.value) || 170)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-zinc-400 block mb-1">Cân nặng bắt đầu (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={goalStartWeight}
                    onChange={(e) => setGoalStartWeight(parseFloat(e.target.value) || 70)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-zinc-400 block mb-1">Cân nặng mục tiêu (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={goalTargetWeight}
                    onChange={(e) => setGoalTargetWeight(parseFloat(e.target.value) || 68)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white"
                  />
                </div>
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsGoalModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-zinc-300"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-xs font-black text-zinc-950 shadow-lg shadow-emerald-500/20"
                >
                  Lưu Mục Tiêu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
