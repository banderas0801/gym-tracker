'use client';

import React, { useState } from 'react';
import { X, Disc, Calculator, ChevronRight } from 'lucide-react';

interface PlateCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialWeight?: number;
}

const AVAILABLE_PLATES = [
  { weight: 25, color: 'bg-red-600 border-red-500 text-white', height: 'h-24', label: '25kg' },
  { weight: 20, color: 'bg-blue-600 border-blue-500 text-white', height: 'h-22', label: '20kg' },
  { weight: 15, color: 'bg-amber-500 border-amber-400 text-black', height: 'h-20', label: '15kg' },
  { weight: 10, color: 'bg-emerald-600 border-emerald-500 text-white', height: 'h-16', label: '10kg' },
  { weight: 5, color: 'bg-zinc-200 border-zinc-100 text-black', height: 'h-14', label: '5kg' },
  { weight: 2.5, color: 'bg-zinc-800 border-zinc-600 text-white', height: 'h-12', label: '2.5kg' },
  { weight: 1.25, color: 'bg-zinc-500 border-zinc-400 text-white', height: 'h-10', label: '1.25kg' },
];

export default function PlateCalculatorModal({
  isOpen,
  onClose,
  initialWeight = 60,
}: PlateCalculatorModalProps) {
  const [totalWeight, setTotalWeight] = useState<number>(initialWeight);
  const [barWeight, setBarWeight] = useState<number>(20); // 20kg Olympic standard

  if (!isOpen) return null;

  const weightNeeded = Math.max(0, totalWeight - barWeight);
  const weightPerSide = weightNeeded / 2;

  // Calculate plates per side
  let remaining = weightPerSide;
  const platesPerSide: { weight: number; count: number; plateInfo: typeof AVAILABLE_PLATES[0] }[] = [];

  for (const plate of AVAILABLE_PLATES) {
    if (remaining >= plate.weight) {
      const count = Math.floor(remaining / plate.weight);
      remaining = Math.round((remaining - count * plate.weight) * 100) / 100;
      platesPerSide.push({
        weight: plate.weight,
        count,
        plateInfo: plate,
      });
    }
  }

  const leftover = Math.round(remaining * 100) / 100;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 sm:p-6 w-full max-w-md shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">Máy Tính Bánh Tạ (Barbell)</h3>
              <p className="text-[11px] text-zinc-400">Cách xếp đĩa tạ 2 bên đòn nhanh & chính xác</p>
            </div>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input Form */}
        <div className="space-y-3">
          <div>
            <label className="text-xs font-bold text-zinc-400 block mb-1">Tổng mức tạ cần nâng (kg)</label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                step="0.5"
                value={totalWeight || ''}
                onChange={(e) => setTotalWeight(parseFloat(e.target.value) || 0)}
                className="flex-1 bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-xl font-black text-white focus:outline-none focus:border-amber-500"
              />
              <div className="flex space-x-1">
                {[60, 80, 100, 120].map((quickW) => (
                  <button
                    key={quickW}
                    type="button"
                    onClick={() => setTotalWeight(quickW)}
                    className="px-2 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-xs font-bold text-zinc-300"
                  >
                    {quickW}k
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Bar weight selector */}
          <div>
            <label className="text-xs font-bold text-zinc-400 block mb-1">Trọng lượng thanh đòn</label>
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { weight: 20, label: '20kg (Olympic)' },
                { weight: 15, label: '15kg (Nữ/Nhẹ)' },
                { weight: 10, label: '10kg (EZ Bar)' },
                { weight: 0, label: '0kg (Smith/Máy)' },
              ].map((item) => (
                <button
                  key={item.weight}
                  type="button"
                  onClick={() => setBarWeight(item.weight)}
                  className={`py-1.5 px-1 text-[11px] font-bold rounded-xl border transition ${
                    barWeight === item.weight
                      ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Calculation Result Per Side */}
        <div className="bg-zinc-950/80 border border-zinc-800 rounded-2xl p-4 text-center space-y-2">
          <div className="text-xs text-zinc-400 font-semibold">Mỗi bên đòn cần lắp:</div>
          <div className="text-3xl font-black text-emerald-400">
            {weightPerSide} <span className="text-sm text-zinc-400 font-bold">kg / bên</span>
          </div>

          {leftover > 0 && (
            <div className="text-[11px] text-amber-400 font-semibold">
              (Dư {leftover * 2}kg chưa xếp được vì thiếu bánh vi mô &lt;1.25kg)
            </div>
          )}
        </div>

        {/* Visual Barbell Illustration */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 flex flex-col items-center justify-center min-h-[120px] overflow-x-auto">
          <div className="text-[10px] text-zinc-500 mb-2 uppercase tracking-wider font-bold">
            Mô phỏng đĩa tạ 1 bên
          </div>

          <div className="flex items-center space-x-1.5 h-28 items-center border-l-4 border-zinc-600 pl-3">
            {platesPerSide.length === 0 ? (
              <span className="text-zinc-600 text-xs">Chỉ dùng đòn không lắp tạ</span>
            ) : (
              platesPerSide.map((group) => (
                Array.from({ length: group.count }).map((_, cIdx) => (
                  <div
                    key={`${group.weight}-${cIdx}`}
                    className={`w-6 sm:w-7 rounded-md border flex items-center justify-center font-black text-[9px] shadow-md transition-all ${group.plateInfo.color} ${
                      group.weight >= 20 ? 'h-24' : group.weight >= 10 ? 'h-20' : group.weight >= 5 ? 'h-16' : 'h-12'
                    }`}
                    title={`${group.weight}kg`}
                  >
                    <span className="-rotate-90">{group.weight}</span>
                  </div>
                ))
              ))
            )}
            {/* Barbell sleeve stick */}
            <div className="w-12 h-3 bg-zinc-600 rounded-r-full" />
          </div>
        </div>

        {/* Breakdown List */}
        <div className="space-y-1.5">
          <span className="text-xs font-bold text-zinc-400">Danh sách bánh tạ cần lấy (cho 1 bên):</span>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {platesPerSide.map((item) => (
              <div
                key={item.weight}
                className="bg-zinc-800/70 border border-zinc-700/60 rounded-xl px-3 py-2 flex items-center justify-between"
              >
                <span className="font-semibold text-zinc-300">Bánh {item.weight}kg:</span>
                <span className="font-black text-amber-400">x{item.count} bánh</span>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs transition"
        >
          Xong
        </button>
      </div>
    </div>
  );
}
