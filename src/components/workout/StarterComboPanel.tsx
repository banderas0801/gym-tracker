'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';

interface StarterComboPanelProps {
  onAddCombo: (type: 'fullbody' | 'upper' | 'lower') => void;
}

export default function StarterComboPanel({ onAddCombo }: StarterComboPanelProps) {
  return (
    <div className="bg-gradient-to-br from-zinc-900/90 via-zinc-950 to-zinc-900 border-2 border-emerald-500/30 rounded-3xl p-6 text-center space-y-4 shadow-xl">
      <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/30">
        <Sparkles className="w-7 h-7" />
      </div>

      <div>
        <h3 className="text-base sm:text-lg font-black text-white">
          Chưa có bài tập nào trong buổi này!
        </h3>
        <p className="text-xs text-zinc-400 mt-1 max-w-md mx-auto leading-relaxed">
          Người mới chưa biết bắt đầu từ đâu? Hãy chọn ngay 1 trong 3 combo bài tập chuẩn khoa học dưới đây để hệ thống tự động thiết lập:
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto text-left pt-2">
        <button
          type="button"
          onClick={() => onAddCombo('fullbody')}
          className="p-4 rounded-2xl bg-zinc-900 border border-emerald-500/40 hover:border-emerald-500 transition group active:scale-[0.98] shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-black text-white group-hover:text-emerald-400 transition">
              ⚡ Combo Full Body
            </span>
            <span className="text-xs text-emerald-400 font-black bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20">3 bài</span>
          </div>
          <p className="text-xs text-zinc-300 mt-1.5 font-medium">Đẩy ngực • Kéo xô máy • Đạp đùi máy</p>
        </button>

        <button
          type="button"
          onClick={() => onAddCombo('upper')}
          className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-teal-500/40 transition group active:scale-[0.98] shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-black text-white group-hover:text-teal-400 transition">
              ⚡ Combo Thân Trên
            </span>
            <span className="text-xs text-teal-400 font-black bg-teal-500/10 px-2 py-0.5 rounded-lg border border-teal-500/20">4 bài</span>
          </div>
          <p className="text-xs text-zinc-300 mt-1.5 font-medium">Ngực ngang • Kéo xô • Đẩy vai • Tay sau</p>
        </button>

        <button
          type="button"
          onClick={() => onAddCombo('lower')}
          className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-amber-500/40 transition group active:scale-[0.98] shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-black text-white group-hover:text-amber-400 transition">
              ⚡ Combo Thân Dưới
            </span>
            <span className="text-xs text-amber-400 font-black bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20">3 bài</span>
          </div>
          <p className="text-xs text-zinc-300 mt-1.5 font-medium">Đạp đùi • Đùi sau mông • Bắp chuối</p>
        </button>
      </div>
    </div>
  );
}
