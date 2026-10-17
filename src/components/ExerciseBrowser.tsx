'use client';

import React, { useState, useMemo } from 'react';
import { Search, X, Dumbbell, Filter, Info } from 'lucide-react';
import { Exercise } from '@/types/workout';
import exercisesData from '@/data/exercises.json';

const MUSCLE_GROUPS = [
  { id: 'all', label: 'Tất cả' },
  { id: 'chest', label: 'Ngực (Chest)' },
  { id: 'lats', label: 'Lưng xô (Lats)' },
  { id: 'middle back', label: 'Lưng giữa' },
  { id: 'lower back', label: 'Lưng dưới' },
  { id: 'shoulders', label: 'Vai (Shoulders)' },
  { id: 'biceps', label: 'Tay trước (Biceps)' },
  { id: 'triceps', label: 'Tay sau (Triceps)' },
  { id: 'quadriceps', label: 'Đùi trước (Quads)' },
  { id: 'hamstrings', label: 'Đùi sau' },
  { id: 'glutes', label: 'Mông (Glutes)' },
  { id: 'calves', label: 'Bắp chuối (Calves)' },
  { id: 'abdominals', label: 'Cơ bụng (Abs)' },
];

export default function ExerciseBrowser() {
  const [search, setSearch] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState('all');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  const allExercises = exercisesData as unknown as Exercise[];

  const filteredExercises = useMemo(() => {
    return allExercises.filter((ex) => {
      const matchSearch =
        ex.name.toLowerCase().includes(search.toLowerCase()) ||
        ex.primaryMuscles.some((m) => m.toLowerCase().includes(search.toLowerCase())) ||
        (ex.equipment && ex.equipment.toLowerCase().includes(search.toLowerCase()));

      const matchMuscle =
        selectedMuscle === 'all' ||
        ex.primaryMuscles.includes(selectedMuscle) ||
        ex.secondaryMuscles?.includes(selectedMuscle);

      return matchSearch && matchMuscle;
    });
  }, [allExercises, search, selectedMuscle]);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24 px-3 sm:px-4 animate-in fade-in duration-300">
      {/* Search & Filter Header */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 shadow-xl space-y-4">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center space-x-2">
            <Dumbbell className="w-5 h-5 text-emerald-400" />
            <span>Thư Viện Bài Tập Chi Tiết ({allExercises.length} bài)</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Tra cứu hướng dẫn chuẩn động tác, nhóm cơ tác động và hình ảnh minh họa tư thế
          </p>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-zinc-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên bài tập (Squat, Deadlift, Bench Press, Curl...)"
            className="w-full bg-zinc-950 border border-zinc-700/80 rounded-2xl pl-10 pr-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3.5 top-3.5 text-zinc-500 hover:text-zinc-300"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Muscle Filter Carousel */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          {MUSCLE_GROUPS.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedMuscle(m.id)}
              className={`px-3 py-1.5 rounded-full font-medium shrink-0 transition ${
                selectedMuscle === m.id
                  ? 'bg-emerald-500 text-zinc-950 font-bold shadow-sm'
                  : 'bg-zinc-950 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Exercises */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
        {filteredExercises.slice(0, 48).map((ex) => {
          const imageSrc =
            ex.images && ex.images.length > 0
              ? `https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/${ex.images[0]}`
              : null;

          return (
            <div
              key={ex.id}
              onClick={() => setSelectedExercise(ex)}
              className="bg-zinc-900 border border-zinc-800 rounded-3xl p-3.5 hover:border-zinc-700 hover:scale-[1.01] transition shadow-lg cursor-pointer group flex flex-col justify-between space-y-3"
            >
              <div className="space-y-3">
                {/* Image */}
                <div className="w-full h-44 rounded-2xl bg-zinc-950 overflow-hidden border border-zinc-800 flex items-center justify-center relative">
                  {imageSrc ? (
                    <img
                      src={imageSrc}
                      alt={ex.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      loading="lazy"
                    />
                  ) : (
                    <Dumbbell className="w-8 h-8 text-zinc-700" />
                  )}

                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[10px] text-zinc-300 capitalize font-medium">
                    {ex.level || 'Tất cả'}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition line-clamp-1">
                    {ex.name}
                  </h3>
                  <div className="flex flex-wrap items-center gap-1.5 mt-1.5 text-[11px]">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20 capitalize">
                      {ex.primaryMuscles.join(', ')}
                    </span>
                    {ex.equipment && (
                      <span className="px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-400 capitalize">
                        {ex.equipment}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-500">
                <span>Xem kỹ thuật & form</span>
                <span className="text-emerald-400 group-hover:translate-x-0.5 transition font-bold">→</span>
              </div>
            </div>
          );
        })}
      </div>

      {filteredExercises.length > 48 && (
        <div className="text-center text-xs text-zinc-500 pt-4">
          Đang hiển thị 48 / {filteredExercises.length} bài tập. Nhập từ khóa để tìm chính xác hơn.
        </div>
      )}

      {/* Detail Modal */}
      {selectedExercise && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 max-w-xl w-full max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-white">{selectedExercise.name}</h3>
                <div className="flex flex-wrap items-center gap-2 mt-1 text-xs">
                  <span className="text-emerald-400 font-bold capitalize">
                    {selectedExercise.primaryMuscles.join(', ')}
                  </span>
                  <span>•</span>
                  <span className="text-zinc-400 capitalize">{selectedExercise.equipment}</span>
                  <span>•</span>
                  <span className="text-zinc-500 capitalize">{selectedExercise.category}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedExercise(null)}
                className="p-1 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Side-by-side start / peak pictures */}
            <div className="grid grid-cols-2 gap-2.5">
              {selectedExercise.images?.map((img, i) => (
                <div key={i} className="rounded-2xl overflow-hidden border border-zinc-800 bg-black">
                  <img
                    src={`https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/${img}`}
                    alt="Demonstration"
                    className="w-full h-48 object-cover"
                  />
                  <div className="text-[11px] font-semibold text-zinc-400 text-center py-1.5 bg-zinc-900/80">
                    {i === 0 ? '① Tư thế bắt đầu (Start)' : '② Điểm co căng cơ (Peak)'}
                  </div>
                </div>
              ))}
            </div>

            {/* Instruction Steps */}
            <div className="space-y-2 pt-2 border-t border-zinc-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Kỹ thuật & Hướng dẫn thực hiện:
              </h4>
              <ol className="text-xs text-zinc-300 space-y-2 list-decimal pl-4 leading-relaxed">
                {selectedExercise.instructions?.map((inst, i) => (
                  <li key={i}>{inst}</li>
                ))}
              </ol>
            </div>

            <button
              onClick={() => setSelectedExercise(null)}
              className="w-full py-3 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs transition"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
