'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Trophy,
  Clock,
  Dumbbell,
  Calendar,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Share2,
  Trash2,
  Database,
  Search,
  Sparkles,
} from 'lucide-react';
import { WorkoutSession } from '@/types/workout';
import { getWorkoutHistory, calculate1RM, deleteWorkoutSession } from '@/lib/storage';
import { analyzeProgressiveOverload } from '@/lib/coachEngine';
import ProgressCharts from './analytics/ProgressCharts';
import AICoachCard from './analytics/AICoachCard';
import WorkoutShareModal from './analytics/WorkoutShareModal';
import BackupSyncModal from './analytics/BackupSyncModal';
import WeeklyGymCard from './analytics/WeeklyGymCard';

export default function HistoryAnalytics() {
  const [history, setHistory] = useState<WorkoutSession[]>([]);
  const [expandedSessionId, setExpandedSessionId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [sharingSession, setSharingSession] = useState<WorkoutSession | null>(null);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);

  const reloadHistory = () => {
    setHistory(getWorkoutHistory());
  };

  useEffect(() => {
    reloadHistory();
  }, []);

  // Tổng hợp chỉ số
  const totalVolumeAllTime = useMemo(
    () => history.reduce((sum, s) => sum + (s.totalVolumeKg || 0), 0),
    [history]
  );
  const totalWorkouts = history.length;

  // AI Progressive Overload Summary
  const coachSummary = useMemo(() => analyzeProgressiveOverload(history), [history]);

  // Tổng hợp Kỷ lục cá nhân (PRs) theo từng bài tập
  const prList = useMemo(() => {
    const exercisePRs: Record<
      string,
      { exerciseName: string; maxWeight: number; max1RM: number; date: string }
    > = {};

    history.forEach((session) => {
      session.exercises.forEach((ex) => {
        ex.sets.forEach((s) => {
          if (s.isCompleted && s.weightKg > 0) {
            const e1rm = calculate1RM(s.weightKg, s.reps);
            if (!exercisePRs[ex.exerciseId] || s.weightKg > exercisePRs[ex.exerciseId].maxWeight) {
              exercisePRs[ex.exerciseId] = {
                exerciseName: ex.exerciseName,
                maxWeight: s.weightKg,
                max1RM: e1rm,
                date: new Date(session.startTime).toLocaleDateString('vi-VN'),
              };
            }
          }
        });
      });
    });

    return Object.values(exercisePRs).sort((a, b) => b.maxWeight - a.maxWeight);
  }, [history]);

  // Lọc danh sách buổi tập theo thanh tìm kiếm
  const filteredHistory = useMemo(() => {
    if (!searchQuery.trim()) return history;
    const query = searchQuery.toLowerCase();
    return history.filter(
      (sess) =>
        sess.title.toLowerCase().includes(query) ||
        sess.exercises.some((ex) => ex.exerciseName.toLowerCase().includes(query))
    );
  }, [history, searchQuery]);

  const handleDeleteSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Bạn có chắc muốn xóa buổi tập này khỏi lịch sử? Hành động này không thể hoàn tác.')) {
      deleteWorkoutSession(sessionId);
      reloadHistory();
    }
  };

  const formatDuration = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}p ${secs}s`;
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-24 px-3 sm:px-4 animate-in fade-in duration-300">
      {/* Top Action Bar (Backup & Share) */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-black text-white">Tiến Độ & Kỷ Lục</h2>
          <p className="text-xs text-zinc-400">Dữ liệu phân tích thể hình chuẩn khoa học</p>
        </div>

        <div className="flex items-center space-x-2">
          {history.length > 0 && (
            <button
              type="button"
              onClick={() => setSharingSession(history[0])}
              className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-emerald-500/50 text-emerald-400 font-bold text-xs flex items-center space-x-1.5 transition active:scale-95 shadow-sm"
              title="Chia sẻ buổi tập gần nhất"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Chia Sẻ</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsBackupModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-teal-500/50 text-teal-400 font-bold text-xs flex items-center space-x-1.5 transition active:scale-95 shadow-sm"
            title="Sao lưu và xuất dữ liệu"
          >
            <Database className="w-3.5 h-3.5" />
            <span>Sao Lưu</span>
          </button>
        </div>
      </div>

      {/* Metric Highlights */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-3 sm:p-4 text-center">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 mx-auto flex items-center justify-center mb-1.5 sm:mb-2">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div className="text-lg sm:text-2xl font-black text-white font-mono">
            {totalVolumeAllTime >= 1000
              ? `${(totalVolumeAllTime / 1000).toFixed(1)}k`
              : totalVolumeAllTime}
          </div>
          <div className="text-[10px] sm:text-[11px] text-zinc-500 font-medium">Tổng Volume (kg)</div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-3 sm:p-4 text-center">
          <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 mx-auto flex items-center justify-center mb-1.5 sm:mb-2">
            <Calendar className="w-4 h-4" />
          </div>
          <div className="text-lg sm:text-2xl font-black text-white font-mono">{totalWorkouts}</div>
          <div className="text-[10px] sm:text-[11px] text-zinc-500 font-medium">Buổi Đã Tập</div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-3 sm:p-4 text-center">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 mx-auto flex items-center justify-center mb-1.5 sm:mb-2">
            <Trophy className="w-4 h-4" />
          </div>
          <div className="text-lg sm:text-2xl font-black text-white font-mono">{prList.length}</div>
          <div className="text-[10px] sm:text-[11px] text-zinc-500 font-medium">Kỷ Lục (PRs)</div>
        </div>
      </div>

      {/* 🏋️ PHÂN TÍCH TÍCH LŨY KHỐI LƯỢNG TẠ (VOLUME LOAD) & BIẾN ĐỘNG KỶ LỤC HÀNG TUẦN */}
      {history.length > 0 && <WeeklyGymCard history={history} />}

      {/* 🤖 AI Progressive Overload Coach Card */}
      {history.length > 0 && <AICoachCard summary={coachSummary} />}

      {/* 📈 Interactive Progress Charts (Volume & 1RM Trendline) */}
      <ProgressCharts history={history} />

      {/* Personal Records Showcase */}
      {prList.length > 0 && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-4 sm:p-5 space-y-3 shadow-lg">
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Phòng Truyền Thống Kỷ Lục (PR Hall of Fame)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {prList.slice(0, 6).map((pr, i) => (
              <div
                key={i}
                className="bg-zinc-950/70 border border-zinc-800 rounded-2xl p-3 flex items-center justify-between"
              >
                <div className="min-w-0 pr-2">
                  <h4 className="text-xs font-bold text-zinc-200 truncate">{pr.exerciseName}</h4>
                  <div className="text-[10px] text-zinc-500">Đạt được: {pr.date}</div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-sm font-extrabold text-amber-400 font-mono">
                    {pr.maxWeight} kg
                  </div>
                  <div className="text-[10px] text-zinc-400 font-mono">1RM: {pr.max1RM}kg</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Workout History List */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <Clock className="w-4 h-4 text-emerald-400" />
            <span>Nhật Ký Các Buổi Tập ({history.length})</span>
          </h3>

          {/* Search Bar */}
          {history.length > 0 && (
            <div className="relative w-full sm:w-60">
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm bài hoặc buổi tập..."
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 placeholder:text-zinc-600"
              />
            </div>
          )}
        </div>

        {filteredHistory.length === 0 ? (
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-10 text-center text-zinc-500 space-y-2">
            <Dumbbell className="w-10 h-10 mx-auto opacity-30" />
            <p className="text-sm font-bold text-zinc-400">
              {searchQuery ? 'Không tìm thấy buổi tập phù hợp' : 'Chưa có buổi tập nào được lưu'}
            </p>
            <p className="text-xs text-zinc-500">
              {searchQuery ? 'Hãy thử từ khóa tìm kiếm khác' : 'Bắt đầu buổi tập đầu tiên ở tab "Tập Luyện"!'}
            </p>
          </div>
        ) : (
          filteredHistory.map((session) => {
            const isExpanded = expandedSessionId === session.id;
            const dateStr = new Date(session.startTime).toLocaleDateString('vi-VN', {
              weekday: 'short',
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            });

            return (
              <div
                key={session.id}
                className="bg-zinc-900 border border-zinc-800 rounded-3xl p-4 sm:p-5 hover:border-zinc-700 transition shadow-lg space-y-3"
              >
                <div
                  onClick={() => setExpandedSessionId(isExpanded ? null : session.id)}
                  className="flex items-start justify-between cursor-pointer gap-2"
                >
                  <div className="space-y-1 min-w-0 flex-1">
                    <h4 className="text-base font-bold text-white hover:text-emerald-400 transition truncate">
                      {session.title}
                    </h4>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-zinc-400">
                      <span>{dateStr}</span>
                      <span>•</span>
                      <span>{formatDuration(session.durationSeconds)}</span>
                      <span>•</span>
                      <span className="text-emerald-400 font-bold font-mono">
                        {(session.totalVolumeKg || 0).toLocaleString()} kg
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1 shrink-0">
                    {/* Share Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSharingSession(session);
                      }}
                      className="p-1.5 rounded-xl text-zinc-400 hover:text-emerald-400 hover:bg-zinc-800 transition"
                      title="Chia sẻ buổi tập này"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>

                    {/* Delete Button */}
                    <button
                      type="button"
                      onClick={(e) => handleDeleteSession(session.id, e)}
                      className="p-1.5 rounded-xl text-zinc-500 hover:text-red-400 hover:bg-zinc-800 transition"
                      title="Xóa buổi tập"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <button className="p-1 rounded-lg text-zinc-500 hover:text-white">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Collapsed Preview */}
                {!isExpanded && (
                  <div className="text-xs text-zinc-400 flex flex-wrap gap-1.5 pt-1 border-t border-zinc-800/60">
                    {session.exercises.map((ex, i) => (
                      <span key={i} className="bg-zinc-950 px-2 py-0.5 rounded-lg border border-zinc-800 text-[11px]">
                        {ex.sets.filter((s) => s.isCompleted).length}× {ex.exerciseName}
                      </span>
                    ))}
                  </div>
                )}

                {/* Expanded Detail */}
                {isExpanded && (
                  <div className="pt-3 border-t border-zinc-800 space-y-3 animate-in fade-in duration-200">
                    {session.exercises.map((ex, exIdx) => (
                      <div key={exIdx} className="bg-zinc-950/70 p-3 rounded-2xl border border-zinc-800/70 space-y-2">
                        <div className="text-xs font-bold text-zinc-200 flex items-center justify-between">
                          <span>{ex.exerciseName}</span>
                          <span className="text-emerald-400 text-[11px] capitalize">{ex.primaryMuscle}</span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                          {ex.sets
                            .filter((s) => s.isCompleted)
                            .map((s, sIdx) => (
                              <div
                                key={sIdx}
                                className="bg-zinc-900/80 px-2.5 py-1.5 rounded-xl border border-zinc-800 flex items-center justify-between font-mono"
                              >
                                <span className="text-zinc-500">#{s.setNumber}</span>
                                <span className="font-bold text-white">
                                  {s.weightKg}kg × {s.reps}
                                </span>
                              </div>
                            ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Social Share Story Modal */}
      <WorkoutShareModal
        session={sharingSession}
        isOpen={!!sharingSession}
        onClose={() => setSharingSession(null)}
      />

      {/* Backup & Sync Modal */}
      <BackupSyncModal
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
        onDataRestored={reloadHistory}
      />
    </div>
  );
}
