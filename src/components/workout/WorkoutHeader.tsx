'use client';

import React from 'react';
import { Play, Pause, Check, Clock, Timer, Calculator, Home } from 'lucide-react';
import { triggerHaptic } from '@/lib/haptics';

interface WorkoutHeaderProps {
  title: string;
  onTitleChange: (title: string) => void;
  elapsedSeconds: number;
  isTimerRunning: boolean;
  onToggleTimer: () => void;
  totalVolume: number;
  totalCompletedSets: number;
  totalPlannedSets: number;
  exerciseCount: number;
  restSeconds: number;
  onOpenRestTimer: () => void;
  onOpenPlateCalculator: () => void;
  onFinish: () => void;
  onMinimize?: () => void;
}

export default function WorkoutHeader({
  title,
  onTitleChange,
  elapsedSeconds,
  isTimerRunning,
  onToggleTimer,
  totalVolume,
  totalCompletedSets,
  totalPlannedSets,
  exerciseCount,
  restSeconds,
  onOpenRestTimer,
  onOpenPlateCalculator,
  onFinish,
  onMinimize,
}: WorkoutHeaderProps) {
  const formatTime = (totalSec: number) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    if (hrs > 0) return `${hrs}:${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleToggle = () => {
    triggerHaptic('light');
    onToggleTimer();
  };

  const handleFinishClick = () => {
    triggerHaptic('success');
    onFinish();
  };

  return (
    <div className="bg-zinc-900/95 border border-zinc-800 rounded-3xl p-3.5 sm:p-5 shadow-xl backdrop-blur-md sticky top-16 z-30 space-y-2.5 sm:space-y-3">
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1 mr-2 sm:mr-3">
          <input
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            className="text-[16px] sm:text-xl font-extrabold text-white bg-transparent border-b border-transparent hover:border-zinc-700 focus:border-emerald-500 focus:outline-none w-full truncate transition"
            placeholder="Tên buổi tập..."
          />
          <div className="flex items-center space-x-2 text-[11px] sm:text-xs text-zinc-400 mt-0.5">
            <span className="flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-mono font-bold text-zinc-200">
                {formatTime(elapsedSeconds)}
              </span>
            </span>
            <span>•</span>
            <span className="truncate">
              {totalCompletedSets}/{totalPlannedSets} Sets xong
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
          {onMinimize && (
            <button
              type="button"
              onClick={onMinimize}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition active:scale-90 flex items-center space-x-1 text-xs font-bold"
              title="Thu nhỏ buổi tập và quay về Trang Chủ"
            >
              <Home className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">Trang Chủ</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleToggle}
            className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition active:scale-90"
            title={isTimerRunning ? 'Tạm dừng đồng hồ' : 'Tiếp tục đồng hồ'}
          >
            {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={handleFinishClick}
            className="px-3.5 sm:px-4 py-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-zinc-950 font-extrabold text-xs sm:text-sm shadow-lg shadow-emerald-500/20 transition flex items-center space-x-1.5 active:scale-95"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>Hoàn Thành</span>
          </button>
        </div>
      </div>

      {/* Quick Stats Bar */}
      <div className="grid grid-cols-4 gap-1.5 sm:gap-2 pt-1.5 sm:pt-2 border-t border-zinc-800/80 text-center">
        <div className="bg-zinc-950/60 p-1.5 sm:p-2 rounded-xl border border-zinc-800/50">
          <div className="text-[9px] uppercase font-bold text-zinc-500">Volume</div>
          <div className="text-xs sm:text-sm font-extrabold text-emerald-400 truncate font-mono">
            {totalVolume.toLocaleString()} <span className="text-[9px] font-normal text-zinc-400">kg</span>
          </div>
        </div>
        <div className="bg-zinc-950/60 p-1.5 sm:p-2 rounded-xl border border-zinc-800/50">
          <div className="text-[9px] uppercase font-bold text-zinc-500">Bài Tập</div>
          <div className="text-xs sm:text-sm font-extrabold text-white">
            {exerciseCount} <span className="text-[9px] font-normal text-zinc-400">bài</span>
          </div>
        </div>
        <div className="bg-zinc-950/60 p-1.5 sm:p-2 rounded-xl border border-zinc-800/50">
          <div className="text-[9px] uppercase font-bold text-zinc-500">Nghỉ</div>
          <button
            type="button"
            onClick={onOpenRestTimer}
            className="text-xs sm:text-sm font-extrabold text-amber-400 hover:underline flex items-center justify-center space-x-1 mx-auto active:scale-90 transition font-mono"
          >
            <Timer className="w-3 h-3" />
            <span>{restSeconds}s</span>
          </button>
        </div>
        <div className="bg-zinc-950/60 p-1.5 sm:p-2 rounded-xl border border-zinc-800/50">
          <div className="text-[9px] uppercase font-bold text-zinc-500">Bánh Tạ</div>
          <button
            type="button"
            onClick={onOpenPlateCalculator}
            className="text-xs sm:text-sm font-extrabold text-teal-400 hover:underline flex items-center justify-center space-x-1 mx-auto active:scale-90 transition"
            title="Mở máy tính xếp bánh tạ đòn"
          >
            <Calculator className="w-3 h-3" />
            <span>Tính Tạ</span>
          </button>
        </div>
      </div>
    </div>
  );
}
