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
  const [zoomScale, setZoomScale] = useState<number>(1);
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  React.useEffect(() => {
    // 1. Khôi phục kích thước zoom người dùng chọn
    const saved = localStorage.getItem('gym_zoom_scale');
    if (saved) {
      const num = parseFloat(saved);
      if (!isNaN(num) && num >= 1) {
        setZoomScale(num);
        document.documentElement.style.zoom = String(num);
      }
    }

    // 2. Nhận diện thiết bị di động độc lập với chế độ Desktop của Chrome
    const checkMobile = () => {
      const isTouch = navigator.maxTouchPoints > 0;
      const isMobileUA = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      const isSmallScreen = window.innerWidth <= 768 || (window.screen && window.screen.width <= 768);
      const mobile = (isTouch && isMobileUA) || isSmallScreen;
      setIsMobileDevice(mobile);

      // Nếu là điện thoại mà bị Chrome WebAPK ép viewport Desktop (> 550px)
      if (isMobileUA && (window.screen?.width <= 550 || window.outerWidth <= 550) && window.innerWidth > 550) {
        const meta = document.querySelector('meta[name="viewport"]');
        if (meta) {
          meta.setAttribute(
            'content',
            'width=390, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover'
          );
        }
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleToggleZoom = () => {
    // Luân chuyển: 100% -> 118% (To) -> 132% (Siêu To) -> 100%
    let next = 1;
    if (zoomScale === 1) next = 1.18;
    else if (zoomScale === 1.18) next = 1.32;
    else next = 1;

    setZoomScale(next);
    localStorage.setItem('gym_zoom_scale', String(next));
    document.documentElement.style.zoom = String(next);
  };

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

          <div className="flex items-center space-x-2">
            {/* Quick Zoom Button */}
            <button
              type="button"
              onClick={handleToggleZoom}
              className="px-2.5 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-emerald-500/50 text-xs font-bold transition active:scale-95 shadow-sm flex items-center space-x-1"
              title="Nhấn để phóng to chữ và toàn bộ giao diện"
            >
              <span className="text-emerald-400 font-black text-sm">Aa</span>
              <span className="text-[10px] text-zinc-300 font-mono">
                {zoomScale === 1 ? '100%' : zoomScale === 1.18 ? '118% To' : '132% Lớn'}
              </span>
            </button>

            {/* Persistent Mini Session Banner if active */}
            {activeSession && (
              <button
                onClick={() => setActiveTab('routines')}
                className="px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center space-x-1.5 hover:bg-emerald-500/20 transition active:scale-95 animate-pulse"
              >
                <Flame className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Buổi tập:</span>
                <span className="truncate max-w-[90px] sm:max-w-none">{activeSession.title}</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab Navigation Menu (Desktop & Tablet) */}
        {!activeSession && !isMobileDevice && (
          <div className="hidden md:flex max-w-4xl mx-auto px-4 items-center space-x-2 overflow-x-auto pb-2.5 scrollbar-none text-xs">
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
      <main className="pt-4 pb-28 md:pb-12">
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
        <nav className={`${isMobileDevice ? 'flex' : 'md:hidden'} fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/95 border-t border-zinc-800 backdrop-blur-2xl px-3 pt-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] items-center justify-around shadow-2xl`}>
          <button
            onClick={() => setActiveTab('routines')}
            className={`flex flex-col items-center py-1 px-3 rounded-xl transition active:scale-95 ${
              activeTab === 'routines' ? 'text-emerald-400 font-bold' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Calendar className="w-5 h-5 mb-0.5" />
            <span className="text-[11px]">Tập Luyện</span>
          </button>

          <button
            onClick={() => setActiveTab('body')}
            className={`flex flex-col items-center py-1 px-3 rounded-xl transition active:scale-95 ${
              activeTab === 'body' ? 'text-teal-400 font-bold' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Scale className="w-5 h-5 mb-0.5" />
            <span className="text-[11px]">Hình Thể</span>
          </button>

          <button
            onClick={() => setActiveTab('exercises')}
            className={`flex flex-col items-center py-1 px-3 rounded-xl transition active:scale-95 ${
              activeTab === 'exercises' ? 'text-emerald-400 font-bold' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <BookOpen className="w-5 h-5 mb-0.5" />
            <span className="text-[11px]">Bài Tập</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex flex-col items-center py-1 px-3 rounded-xl transition active:scale-95 ${
              activeTab === 'history' ? 'text-amber-400 font-bold' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <Trophy className="w-5 h-5 mb-0.5" />
            <span className="text-[11px]">Kỷ Lục</span>
          </button>
        </nav>
      )}
    </div>
  );
}
