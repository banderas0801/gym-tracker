'use client';

import React, { useState } from 'react';
import { Dumbbell, Calendar, Trophy, Flame, BookOpen, Scale } from 'lucide-react';
import { WorkoutSession } from '@/types/workout';
import ActiveWorkoutView from '@/components/ActiveWorkoutView';
import RoutineList from '@/components/RoutineList';
import ExerciseBrowser from '@/components/ExerciseBrowser';
import HistoryAnalytics from '@/components/HistoryAnalytics';
import BodyTracker from '@/components/BodyTracker';
import ErrorBoundary from '@/components/ErrorBoundary';
import PWAManager from '@/components/PWAManager';

type Tab = 'routines' | 'exercises' | 'history' | 'body';

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('routines');
  const [activeSession, setActiveSession] = useState<WorkoutSession | null>(null);

  return (
    <div className="min-h-screen bg-black text-zinc-100 selection:bg-emerald-500 selection:text-black">
      {/* PWA: Service Worker, Offline Indicator, Install Prompt */}
      <PWAManager />
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-zinc-950/85 backdrop-blur-xl border-b border-zinc-800/80">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-zinc-950">
              <Dumbbell className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-base font-extrabold tracking-tight text-white flex items-center space-x-1.5">
                <span>GYM TRACKER PRO</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono font-semibold">
                  LIVE
                </span>
              </h1>
              <p className="text-[11px] text-zinc-400 font-medium">Theo dõi bài tập & Progressive Overload</p>
            </div>
          </div>

          {/* Persistent Mini Session Banner if active */}
          {activeSession && (
            <button
              onClick={() => setActiveTab('routines')}
              className="px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center space-x-1.5 hover:bg-emerald-500/20 transition active:scale-95 animate-pulse"
            >
              <Flame className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Buổi tập đang diễn ra:</span>
              <span className="truncate max-w-[120px] sm:max-w-none">{activeSession.title}</span>
            </button>
          )}
        </div>

        {/* Tab Navigation Menu (Desktop & Tablet) */}
        {!activeSession && (
          <div className="max-w-4xl mx-auto px-4 flex items-center space-x-2 overflow-x-auto pb-2.5 scrollbar-none text-xs">
            <button
              onClick={() => setActiveTab('routines')}
              className={`px-3.5 py-2 rounded-xl font-bold transition flex items-center space-x-1.5 whitespace-nowrap active:scale-95 ${
                activeTab === 'routines'
                  ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <Calendar className="w-4 h-4 text-emerald-400" />
              <span>Tập Luyện & Giáo Án</span>
            </button>

            <button
              onClick={() => setActiveTab('body')}
              className={`px-3.5 py-2 rounded-xl font-bold transition flex items-center space-x-1.5 whitespace-nowrap active:scale-95 ${
                activeTab === 'body'
                  ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <Scale className="w-4 h-4 text-teal-400" />
              <span>Chỉ Số & Hình Thể</span>
            </button>

            <button
              onClick={() => setActiveTab('exercises')}
              className={`px-3.5 py-2 rounded-xl font-bold transition flex items-center space-x-1.5 whitespace-nowrap active:scale-95 ${
                activeTab === 'exercises'
                  ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <BookOpen className="w-4 h-4 text-emerald-400" />
              <span>Thư Viện Bài Tập (876)</span>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`px-3.5 py-2 rounded-xl font-bold transition flex items-center space-x-1.5 whitespace-nowrap active:scale-95 ${
                activeTab === 'history'
                  ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Lịch Sử & Kỷ Lục PRs</span>
            </button>
          </div>
        )}
      </header>

      {/* Main Container */}
      <main className="pt-6 pb-28 sm:pb-12">
        {activeSession ? (
          <ErrorBoundary fallbackTitle="Buổi tập gặp sự cố">
            <ActiveWorkoutView
              initialSession={activeSession}
              onFinishWorkout={() => setActiveSession(null)}
              onDiscardWorkout={() => setActiveSession(null)}
            />
          </ErrorBoundary>
        ) : (
          <>
            {activeTab === 'routines' && (
              <ErrorBoundary fallbackTitle="Không thể tải giáo án">
                <RoutineList onStartSession={(sess) => setActiveSession(sess)} />
              </ErrorBoundary>
            )}
            {activeTab === 'body' && (
              <ErrorBoundary fallbackTitle="Không thể tải chỉ số hình thể">
                <BodyTracker />
              </ErrorBoundary>
            )}
            {activeTab === 'exercises' && (
              <ErrorBoundary fallbackTitle="Không thể tải thư viện bài tập">
                <ExerciseBrowser />
              </ErrorBoundary>
            )}
            {activeTab === 'history' && (
              <ErrorBoundary fallbackTitle="Không thể tải lịch sử tập">
                <HistoryAnalytics />
              </ErrorBoundary>
            )}
          </>
        )}
      </main>

      {/* Bottom Sticky Tab Bar for Mobile with Safe Area */}
      {!activeSession && (
        <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/95 border-t border-zinc-800/80 backdrop-blur-xl px-2 pt-1.5 pb-[max(0.6rem,env(safe-area-inset-bottom))] flex items-center justify-around shadow-2xl">
          <button
            onClick={() => setActiveTab('routines')}
            className={`flex flex-col items-center space-y-1 py-1 px-3 rounded-xl transition active:scale-95 ${
              activeTab === 'routines' ? 'text-emerald-400 font-bold' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Calendar className="w-5 h-5" />
            <span className="text-[10px]">Tập Luyện</span>
          </button>

          <button
            onClick={() => setActiveTab('body')}
            className={`flex flex-col items-center space-y-1 py-1 px-3 rounded-xl transition active:scale-95 ${
              activeTab === 'body' ? 'text-teal-400 font-bold' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Scale className="w-5 h-5" />
            <span className="text-[10px]">Hình Thể</span>
          </button>

          <button
            onClick={() => setActiveTab('exercises')}
            className={`flex flex-col items-center space-y-1 py-1 px-3 rounded-xl transition active:scale-95 ${
              activeTab === 'exercises' ? 'text-emerald-400 font-bold' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <BookOpen className="w-5 h-5" />
            <span className="text-[10px]">Bài Tập</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex flex-col items-center space-y-1 py-1 px-3 rounded-xl transition active:scale-95 ${
              activeTab === 'history' ? 'text-amber-400 font-bold' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Trophy className="w-5 h-5" />
            <span className="text-[10px]">Kỷ Lục</span>
          </button>
        </nav>
      )}
    </div>
  );
}
