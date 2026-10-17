'use client';

import React, { useState, useMemo } from 'react';
import { TrendingUp, Award, BarChart3, ChevronRight } from 'lucide-react';
import { WorkoutSession } from '@/types/workout';
import { calculate1RM } from '@/lib/storage';

interface ProgressChartsProps {
  history: WorkoutSession[];
}

export default function ProgressCharts({ history }: ProgressChartsProps) {
  const [chartMode, setChartMode] = useState<'volume' | 'e1rm'>('volume');
  const [selectedExerciseId, setSelectedExerciseId] = useState<string>('');
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number; label: string; value: string } | null>(null);

  // 1. Danh sách các bài tập có trong lịch sử để người dùng chọn xem 1RM
  const availableExercises = useMemo(() => {
    const map = new Map<string, string>();
    history.forEach((sess) => {
      sess.exercises.forEach((ex) => {
        if (ex.sets.some((s) => s.isCompleted && s.weightKg > 0)) {
          map.set(ex.exerciseId, ex.exerciseName);
        }
      });
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [history]);

  // Tự động chọn bài tập đầu tiên nếu chưa chọn
  const activeExerciseId = selectedExerciseId || availableExercises[0]?.id || '';

  // 2. Chuẩn bị dữ liệu chuỗi thời gian (sắp xếp từ cũ nhất đến mới nhất)
  const chartData = useMemo(() => {
    const reversed = [...history].reverse(); // Cũ nhất -> Mới nhất

    if (chartMode === 'volume') {
      return reversed
        .filter((s) => (s.totalVolumeKg || 0) > 0)
        .map((s) => ({
          date: new Date(s.startTime).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
          fullDate: new Date(s.startTime).toLocaleDateString('vi-VN', { weekday: 'short', day: 'numeric', month: 'short' }),
          value: s.totalVolumeKg || 0,
          label: `${(s.totalVolumeKg || 0).toLocaleString()} kg Volume`,
        }));
    } else {
      // 1RM mode
      if (!activeExerciseId) return [];
      const points: { date: string; fullDate: string; value: number; label: string }[] = [];

      reversed.forEach((sess) => {
        const matched = sess.exercises.find((e) => e.exerciseId === activeExerciseId);
        if (matched) {
          let max1RM = 0;
          let bestSet = { weight: 0, reps: 0 };
          matched.sets.forEach((s) => {
            if (s.isCompleted && s.weightKg > 0) {
              const e1rm = calculate1RM(s.weightKg, s.reps);
              if (e1rm > max1RM) {
                max1RM = e1rm;
                bestSet = { weight: s.weightKg, reps: s.reps };
              }
            }
          });
          if (max1RM > 0) {
            points.push({
              date: new Date(sess.startTime).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
              fullDate: new Date(sess.startTime).toLocaleDateString('vi-VN', { weekday: 'short', day: 'numeric', month: 'short' }),
              value: max1RM,
              label: `1RM: ${max1RM}kg (${bestSet.weight}kg × ${bestSet.reps})`,
            });
          }
        }
      });
      return points;
    }
  }, [history, chartMode, activeExerciseId]);

  if (history.length < 2 || chartData.length < 2) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 text-center space-y-2">
        <BarChart3 className="w-8 h-8 text-zinc-600 mx-auto" />
        <h4 className="text-sm font-bold text-zinc-300">Biểu Đồ Tiến Bộ Thể Lực</h4>
        <p className="text-xs text-zinc-500 max-w-sm mx-auto">
          Cần ít nhất 2 buổi tập để vẽ đường xu hướng Volume và sức mạnh 1RM. Hãy hoàn thành thêm buổi tập nhé!
        </p>
      </div>
    );
  }

  // 3. Tính toán tọa độ SVG
  const width = 600;
  const height = 220;
  const paddingX = 45;
  const paddingTop = 25;
  const paddingBottom = 40;

  const innerWidth = width - paddingX * 2;
  const innerHeight = height - paddingTop - paddingBottom;

  const values = chartData.map((d) => d.value);
  const rawMin = Math.min(...values);
  const rawMax = Math.max(...values);
  const yMin = Math.max(0, Math.floor(rawMin * 0.9));
  const yMax = Math.ceil(rawMax * 1.1) || 10;
  const yRange = yMax - yMin || 1;

  const points = chartData.map((d, i) => {
    const x = paddingX + (i / (chartData.length - 1)) * innerWidth;
    const y = paddingTop + innerHeight - ((d.value - yMin) / yRange) * innerHeight;
    return { x, y, ...d };
  });

  // Tạo đường dẫn SVG Path
  const linePath = points.reduce((acc, p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    return `${acc} L ${p.x} ${p.y}`;
  }, '');

  // Tạo vùng phủ Gradient bên dưới đường cong
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - paddingBottom} L ${points[0].x} ${height - paddingBottom} Z`;

  // Tính % tăng trưởng từ buổi đầu tiên đến buổi gần nhất
  const firstVal = chartData[0]?.value || 1;
  const lastVal = chartData[chartData.length - 1]?.value || 1;
  const growthPercent = Math.round(((lastVal - firstVal) / firstVal) * 100);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-4 sm:p-5 shadow-xl space-y-4">
      {/* Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>Đồ Thị Tiến Bộ (Progress Trends)</span>
          </h3>
          <div className="flex items-center space-x-2 text-xs mt-0.5">
            <span className="text-zinc-400">Xu hướng:</span>
            <span
              className={`font-bold font-mono ${
                growthPercent >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {growthPercent >= 0 ? `+${growthPercent}%` : `${growthPercent}%`}
            </span>
            <span className="text-zinc-500">qua {chartData.length} buổi</span>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center space-x-1.5 bg-zinc-950 p-1 rounded-2xl border border-zinc-800 text-xs shrink-0 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setChartMode('volume')}
            className={`px-3 py-1.5 rounded-xl font-bold transition ${
              chartMode === 'volume'
                ? 'bg-emerald-500 text-zinc-950 shadow-md shadow-emerald-500/20'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Tổng Volume (kg)
          </button>
          <button
            type="button"
            onClick={() => setChartMode('e1rm')}
            className={`px-3 py-1.5 rounded-xl font-bold transition ${
              chartMode === 'e1rm'
                ? 'bg-teal-500 text-zinc-950 shadow-md shadow-teal-500/20'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Sức Mạnh 1RM
          </button>
        </div>
      </div>

      {/* Exercise Selector for 1RM Mode */}
      {chartMode === 'e1rm' && availableExercises.length > 0 && (
        <div className="flex items-center space-x-2 bg-zinc-950/70 p-2 rounded-2xl border border-zinc-800/80">
          <Award className="w-4 h-4 text-amber-400 shrink-0 ml-1" />
          <span className="text-xs text-zinc-400 shrink-0">Chọn bài:</span>
          <select
            value={activeExerciseId}
            onChange={(e) => setSelectedExerciseId(e.target.value)}
            className="w-full bg-transparent text-xs font-bold text-emerald-400 focus:outline-none cursor-pointer truncate"
          >
            {availableExercises.map((ex) => (
              <option key={ex.id} value={ex.id} className="bg-zinc-900 text-white">
                {ex.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Interactive Responsive SVG Chart */}
      <div className="relative w-full overflow-hidden select-none bg-zinc-950/60 rounded-2xl border border-zinc-800/60 p-2">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible"
        >
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid Lines */}
          <line
            x1={paddingX}
            y1={paddingTop}
            x2={width - paddingX}
            y2={paddingTop}
            stroke="#27272a"
            strokeDasharray="3 3"
          />
          <line
            x1={paddingX}
            y1={paddingTop + innerHeight / 2}
            x2={width - paddingX}
            y2={paddingTop + innerHeight / 2}
            stroke="#27272a"
            strokeDasharray="3 3"
          />
          <line
            x1={paddingX}
            y1={height - paddingBottom}
            x2={width - paddingX}
            y2={height - paddingBottom}
            stroke="#3f3f46"
          />

          {/* Y Axis Labels */}
          <text
            x={paddingX - 8}
            y={paddingTop + 4}
            textAnchor="end"
            fontSize="10"
            fill="#71717a"
            className="font-mono font-bold"
          >
            {yMax}
          </text>
          <text
            x={paddingX - 8}
            y={paddingTop + innerHeight / 2 + 3}
            textAnchor="end"
            fontSize="10"
            fill="#71717a"
            className="font-mono font-bold"
          >
            {Math.round((yMax + yMin) / 2)}
          </text>
          <text
            x={paddingX - 8}
            y={height - paddingBottom + 3}
            textAnchor="end"
            fontSize="10"
            fill="#71717a"
            className="font-mono font-bold"
          >
            {yMin}
          </text>

          {/* Area Fill */}
          <path d={areaPath} fill="url(#chartGradient)" />

          {/* Stroke Line */}
          <path
            d={linePath}
            fill="none"
            stroke={chartMode === 'volume' ? '#10b981' : '#14b8a6'}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data Points */}
          {points.map((p, i) => (
            <g
              key={i}
              className="cursor-pointer group"
              onMouseEnter={() =>
                setHoveredPoint({ x: p.x, y: p.y, label: p.fullDate, value: p.label })
              }
              onClick={() =>
                setHoveredPoint({ x: p.x, y: p.y, label: p.fullDate, value: p.label })
              }
            >
              {/* Invisible large touch target */}
              <circle cx={p.x} cy={p.y} r="14" fill="transparent" />

              {/* Point Circle */}
              <circle
                cx={p.x}
                cy={p.y}
                r="4.5"
                fill="#000000"
                stroke={chartMode === 'volume' ? '#10b981' : '#14b8a6'}
                strokeWidth="2.5"
                className="transition-all duration-200 group-hover:r-6"
              />

              {/* X Date Label */}
              <text
                x={p.x}
                y={height - paddingBottom + 18}
                textAnchor="middle"
                fontSize="10"
                fill="#a1a1aa"
                className="font-mono"
              >
                {p.date}
              </text>
            </g>
          ))}
        </svg>

        {/* Floating Tooltip */}
        {hoveredPoint && (
          <div
            className="absolute z-10 bg-zinc-950/95 border border-emerald-500/40 rounded-xl px-3 py-1.5 shadow-2xl pointer-events-none transform -translate-x-1/2 -translate-y-full text-center whitespace-nowrap animate-in fade-in zoom-in-95 duration-150"
            style={{
              left: `${(hoveredPoint.x / width) * 100}%`,
              top: `${(hoveredPoint.y / height) * 100}%`,
              marginTop: '-10px',
            }}
          >
            <div className="text-[10px] text-zinc-400 font-medium">{hoveredPoint.label}</div>
            <div className="text-xs font-black text-emerald-400 font-mono mt-0.5">
              {hoveredPoint.value}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
