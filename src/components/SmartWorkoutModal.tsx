'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  X,
  Clock,
  Dumbbell,
  Target,
  ShieldCheck,
  Play,
  Layers,
  ChevronRight,
  ArrowLeft,
} from 'lucide-react';
import { WorkoutSession } from '@/types/workout';
import {
  generateSmartWorkout,
  SmartWorkoutConfig,
  WorkoutSplitTarget,
  WorkoutDuration,
  EquipmentType,
  ExperienceLevel,
} from '@/lib/workoutGenerator';

interface SmartWorkoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartSession: (session: WorkoutSession) => void;
}

export default function SmartWorkoutModal({
  isOpen,
  onClose,
  onStartSession,
}: SmartWorkoutModalProps) {
  const [target, setTarget] = useState<WorkoutSplitTarget>('fullbody');
  const [duration, setDuration] = useState<WorkoutDuration>(45);
  const [equipment, setEquipment] = useState<EquipmentType>('gym');
  const [level, setLevel] = useState<ExperienceLevel>('newbie');

  if (!isOpen) return null;

  const handleGenerate = () => {
    const session = generateSmartWorkout({
      target,
      durationMinutes: duration,
      equipment,
      level,
    });
    onStartSession(session);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl w-full max-w-lg max-h-[92vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-800 flex items-center justify-between bg-gradient-to-r from-emerald-950/60 to-zinc-950">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white">
                Trợ Lý Tạo Lịch Tập Thông Minh
              </h2>
              <p className="text-[11px] text-zinc-400">
                Tự động lên giáo án khoa học chuẩn y khoa chỉ sau 3 click
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 transition shrink-0 flex items-center space-x-1 text-xs font-bold active:scale-95 shadow-sm"
            title="Đóng / Quay lại"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-400 stroke-[2.5]" />
            <span>Quay lại</span>
          </button>
        </div>

        {/* Form Body */}
        <div className="p-4 sm:p-5 space-y-4 overflow-y-auto">
          {/* 1. Chọn Nhóm Cơ Tập Trung */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-300 flex items-center space-x-1.5">
              <Target className="w-3.5 h-3.5 text-emerald-400" />
              <span>1. Bạn muốn tập trung vào nhóm cơ nào hôm nay?</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setTarget('fullbody')}
                className={`p-3 rounded-2xl border text-left transition ${
                  target === 'fullbody'
                    ? 'bg-emerald-500/15 border-emerald-500 text-white shadow-sm'
                    : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <div className="font-bold text-xs">Toàn Thân (Full Body)</div>
                <div className="text-[10px] text-zinc-500 mt-0.5">Khuyên dùng cho Newbie</div>
              </button>

              <button
                type="button"
                onClick={() => setTarget('upper')}
                className={`p-3 rounded-2xl border text-left transition ${
                  target === 'upper'
                    ? 'bg-emerald-500/15 border-emerald-500 text-white shadow-sm'
                    : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <div className="font-bold text-xs">Thân Trên (Upper Body)</div>
                <div className="text-[10px] text-zinc-500 mt-0.5">Ngực, Lưng xô, Vai, Tay</div>
              </button>

              <button
                type="button"
                onClick={() => setTarget('lower')}
                className={`p-3 rounded-2xl border text-left transition ${
                  target === 'lower'
                    ? 'bg-emerald-500/15 border-emerald-500 text-white shadow-sm'
                    : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <div className="font-bold text-xs">Thân Dưới (Lower Body)</div>
                <div className="text-[10px] text-zinc-500 mt-0.5">Đùi trước, Đùi sau, Mông</div>
              </button>

              <button
                type="button"
                onClick={() => setTarget('core_cardio')}
                className={`p-3 rounded-2xl border text-left transition ${
                  target === 'core_cardio'
                    ? 'bg-emerald-500/15 border-emerald-500 text-white shadow-sm'
                    : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <div className="font-bold text-xs">Bụng & Phục Hồi</div>
                <div className="text-[10px] text-zinc-500 mt-0.5">Nhẹ nhàng, thon gọn eo</div>
              </button>
            </div>
          </div>

          {/* 2. Chọn Thời Gian Bạn Có */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-300 flex items-center space-x-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>2. Thời gian bạn có hôm nay?</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { min: 30, label: '30 Phút', sub: '3 bài cốt lõi' },
                { min: 45, label: '45 Phút', sub: '4 bài chuẩn' },
                { min: 60, label: '60 Phút', sub: '5 bài toàn diện' },
              ].map((item) => (
                <button
                  key={item.min}
                  type="button"
                  onClick={() => setDuration(item.min as WorkoutDuration)}
                  className={`p-2.5 rounded-2xl border text-center transition ${
                    duration === item.min
                      ? 'bg-amber-500/15 border-amber-500 text-amber-300 shadow-sm'
                      : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <div className="font-bold text-xs">{item.label}</div>
                  <div className="text-[10px] text-zinc-500 mt-0.5">{item.sub}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Dụng Cụ Tại Nơi Tập */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-300 flex items-center space-x-1.5">
              <Dumbbell className="w-3.5 h-3.5 text-teal-400" />
              <span>3. Thiết bị bạn có?</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setEquipment('gym')}
                className={`p-2.5 rounded-2xl border text-left transition ${
                  equipment === 'gym'
                    ? 'bg-teal-500/15 border-teal-500 text-teal-300'
                    : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <div className="font-bold text-xs">Phòng Gym Đầy Đủ</div>
                <div className="text-[10px] text-zinc-500">Ưu tiên máy cố định an toàn</div>
              </button>

              <button
                type="button"
                onClick={() => setEquipment('dumbbell_only')}
                className={`p-2.5 rounded-2xl border text-left transition ${
                  equipment === 'dumbbell_only'
                    ? 'bg-teal-500/15 border-teal-500 text-teal-300'
                    : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <div className="font-bold text-xs">Chỉ Tạ Đơn (Dumbbells)</div>
                <div className="text-[10px] text-zinc-500">Phù hợp góc tập tại nhà / vắng máy</div>
              </button>
            </div>
          </div>

          {/* AI Safety Promise Badge */}
          <div className="p-3 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex items-start space-x-2.5 text-[11px] text-zinc-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">Cam kết chuẩn khoa học:</strong> Hệ thống tự động xếp bài đa khớp (Compound) trước, điền sẵn mức tạ khởi điểm an toàn và đặt set đầu làm hiệp làm nóng (Warm-up).
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-950 flex items-center justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-zinc-400 hover:text-white text-xs font-semibold transition"
          >
            Đóng
          </button>

          <button
            type="button"
            onClick={handleGenerate}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-zinc-950 font-black text-xs shadow-lg shadow-emerald-500/20 transition flex items-center space-x-1.5 active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            <span>Tạo Buổi Tập Cho Tôi Ngay</span>
          </button>
        </div>
      </div>
    </div>
  );
}
