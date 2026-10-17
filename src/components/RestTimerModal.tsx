'use client';

import React, { useEffect, useState } from 'react';
import { Play, Pause, Plus, Minus, X, Bell } from 'lucide-react';

interface RestTimerModalProps {
  initialSeconds: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function RestTimerModal({
  initialSeconds,
  isOpen,
  onClose,
}: RestTimerModalProps) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setSecondsLeft(initialSeconds);
      setIsRunning(true);
    }
  }, [isOpen, initialSeconds]);

  // Âm thanh báo hiệu nhẹ nhàng khi hết giờ nghỉ
  const playBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // 880Hz note A5
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.6);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.6);
    } catch {}
  };

  useEffect(() => {
    if (!isOpen || !isRunning) return;

    if (secondsLeft <= 0) {
      playBeep();
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          playBeep();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, isRunning, secondsLeft]);

  if (!isOpen) return null;

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-200">
      <div className="bg-zinc-900 border border-zinc-700/80 rounded-2xl p-4 shadow-2xl text-white w-72 backdrop-blur-md">
        <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
          <div className="flex items-center space-x-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Thời Gian Nghỉ (Rest)
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-white p-1 rounded-lg transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Time Display */}
        <div className="text-center py-4">
          <div
            className={`text-4xl font-extrabold tracking-tight font-mono ${
              secondsLeft === 0
                ? 'text-emerald-400 animate-pulse'
                : 'text-white'
            }`}
          >
            {secondsLeft === 0 ? 'SẴN SÀNG!' : formattedTime}
          </div>
          <p className="text-[11px] text-zinc-400 mt-1">
            {secondsLeft === 0
              ? 'Đã hết thời gian nghỉ, vào set tiếp theo thôi!'
              : 'Hãy hít thở sâu và uống một ngụm nước'}
          </p>
        </div>

        {/* Quick adjustments */}
        <div className="flex items-center justify-center space-x-2 pb-2">
          <button
            onClick={() => setSecondsLeft((prev) => Math.max(0, prev - 15))}
            className="px-2.5 py-1 text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg flex items-center space-x-1"
          >
            <Minus className="w-3 h-3" />
            <span>15s</span>
          </button>

          <button
            onClick={() => setIsRunning(!isRunning)}
            className="p-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold transition shadow-md shadow-emerald-500/20"
          >
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setSecondsLeft((prev) => prev + 15)}
            className="px-2.5 py-1 text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg flex items-center space-x-1"
          >
            <Plus className="w-3 h-3" />
            <span>15s</span>
          </button>
        </div>

        {/* Preset buttons */}
        <div className="grid grid-cols-4 gap-1.5 pt-2 border-t border-zinc-800/80">
          {[30, 60, 90, 120].map((sec) => (
            <button
              key={sec}
              onClick={() => {
                setSecondsLeft(sec);
                setIsRunning(true);
              }}
              className="py-1 text-[11px] font-semibold bg-zinc-800/60 hover:bg-zinc-700 text-zinc-300 rounded-lg transition"
            >
              {sec}s
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
