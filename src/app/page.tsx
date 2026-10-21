'use client';

import React, { useState } from 'react';
import { Dumbbell, Calendar, Trophy, Flame, BookOpen, Scale, Footprints, ArrowLeft, Home as HomeIcon, ChevronRight } from 'lucide-react';
import { WorkoutSession } from '@/types/workout';
import ActiveWorkoutView from '@/components/ActiveWorkoutView';
import RoutineList from '@/components/RoutineList';
import ExerciseBrowser from '@/components/ExerciseBrowser';
import HistoryAnalytics from '@/components/HistoryAnalytics';
import BodyTracker from '@/components/BodyTracker';
import RunningTracker from '@/components/RunningTracker';
import ErrorBoundary from '@/components/ErrorBoundary';
import PWAManager from '@/components/PWAManager';

type Tab = 'routines' | 'running' | 'body' | 'exercises' | 'history';

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>('routines');
  const [activeSession, setActiveSession] = useState<WorkoutSession | null>(null);
  const [isSessionMinimized, setIsSessionMinimized] = useState<boolean>(false);
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
        if (!saved) {
          setZoomScale(1.5);
          document.documentElement.style.zoom = '1.5';
        }
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleToggleZoom = () => {
    // Luân chuyển: 100% -> 125% -> 150% -> 175% -> 200%
    const SCALES = [1, 1.25, 1.5, 1.75, 2.0];
    const currentIndex = SCALES.indexOf(zoomScale);
    const next = currentIndex !== -1 ? SCALES[(currentIndex + 1) % SCALES.length] : 1.25;

    setZoomScale(next);
    localStorage.setItem('gym_zoom_scale', String(next));
    document.documentElement.style.zoom = String(next);
  };

  const handleGoHome = () => {
    setActiveTab('routines');
    if (activeSession) {
      setIsSessionMinimized(true);
    }
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 selection:bg-emerald-500 selection:text-black">
      {/* PWA: Service Worker, Offline Indicator, Install Prompt */}
      <PWAManager />

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-xl border-b border-zinc-800/80">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 h-16 flex items-center justify-between gap-2">
          {/* Logo & Home Back Button */}
          <div className="flex items-center space-x-2 min-w-0">
            {/* Nút Back / Home xuất hiện khi không ở trang chủ hoặc khi đang có buổi tập mở rộng */}
            {(activeTab !== 'routines' || (activeSession && !isSessionMinimized)) ? (
              <button
                type="button"
                onClick={handleGoHome}
                className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 hover:bg-emerald-500/25 text-emerald-400 font-extrabold text-xs transition active:scale-95 shadow-sm flex items-center space-x-1.5 shrink-0"
                title="Quay lại Trang Chủ (Giáo Án & Tập Gym)"
              >
                <ArrowLeft className="w-4 h-4 stroke-[3]" />
                <span className="text-xs">Trang Chủ</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleGoHome}
                className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-zinc-950 shrink-0"
              >
                <Dumbbell className="w-5 h-5 stroke-[2.5]" />
              </button>
            )}

            <div className="min-w-0 truncate">
              <h1 className="text-sm sm:text-base font-extrabold tracking-tight text-white flex items-center space-x-1.5 truncate">
                <span className="truncate">GYM TRACKER</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono font-semibold shrink-0">
                  PRO
                </span>
              </h1>
              <p className="text-[10px] sm:text-[11px] text-zinc-400 font-medium truncate">
                {activeTab === 'routines' && 'Giáo án & Tập gym'}
                {activeTab === 'running' && 'Chạy bộ bán Marathon 21K'}
                {activeTab === 'body' && 'Theo dõi chỉ số & body'}
                {activeTab === 'exercises' && 'Thư viện 876 bài tập'}
                {activeTab === 'history' && 'Lịch sử & Kỷ lục PRs'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
            {/* Quick Zoom Button */}
            <button
              type="button"
              onClick={handleToggleZoom}
              className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-emerald-500/50 text-xs font-bold transition active:scale-95 shadow-sm flex items-center space-x-1"
              title="Nhấn để chuyển các mức phóng to: 100% -> 125% -> 150% -> 175% -> 200%"
            >
              <span className="text-emerald-400 font-black text-xs sm:text-sm">Aa</span>
              <span className="text-[10px] sm:text-[11px] text-zinc-300 font-mono font-semibold">
                {zoomScale === 1
                  ? '100%'
                  : zoomScale === 1.25
                  ? '125%'
                  : zoomScale === 1.5
                  ? '150%'
                  : zoomScale === 1.75
                  ? '175%'
                  : '200%'}
              </span>
            </button>

            {/* Persistent Mini Session Banner if active */}
            {activeSession && isSessionMinimized && (
              <button
                onClick={() => setIsSessionMinimized(false)}
                className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center space-x-1.5 hover:bg-emerald-500/30 transition active:scale-95 animate-pulse"
                title="Đang có buổi tập chạy ngầm - Nhấn để tiếp tục tập"
              >
                <Flame className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
                <span className="hidden sm:inline">Tiếp tục:</span>
                <span className="truncate max-w-[80px] sm:max-w-[120px]">{activeSession.title}</span>
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
              <HomeIcon className="w-4 h-4 text-emerald-400" />
              <span>Trang Chủ & Giáo Án</span>
            </button>

            <button
              onClick={() => setActiveTab('running')}
              className={`px-3.5 py-2 rounded-xl font-bold transition flex items-center space-x-1.5 whitespace-nowrap active:scale-95 ${
                activeTab === 'running'
                  ? 'bg-amber-500 text-black shadow-sm font-black'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <Footprints className="w-4 h-4 text-amber-400" />
              <span>Chạy Bộ (HM 21K)</span>
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
              <span>Lịch Sử & PRs</span>
            </button>
          </div>
        )}
      </header>

      {/* Main Container */}
      <main className="pt-3 pb-28 md:pb-12">
        {activeSession && !isSessionMinimized ? (
          <ErrorBoundary fallbackTitle="Buổi tập gặp sự cố">
            <ActiveWorkoutView
              initialSession={activeSession}
              onFinishWorkout={() => {
                setActiveSession(null);
                setIsSessionMinimized(false);
              }}
              onDiscardWorkout={() => {
                setActiveSession(null);
                setIsSessionMinimized(false);
              }}
              onMinimize={() => {
                setIsSessionMinimized(true);
                setActiveTab('routines');
              }}
            />
          </ErrorBoundary>
        ) : (
          <>
            {activeTab === 'routines' && (
              <ErrorBoundary fallbackTitle="Không thể tải giáo án">
                <RoutineList onStartSession={(sess) => {
                  setActiveSession(sess);
                  setIsSessionMinimized(false);
                }} />
              </ErrorBoundary>
            )}
            {activeTab === 'running' && (
              <ErrorBoundary fallbackTitle="Không thể tải phân hệ chạy bộ">
                <RunningTracker onGoToGymWorkout={handleGoHome} />
              </ErrorBoundary>
            )}
            {activeTab === 'body' && (
              <ErrorBoundary fallbackTitle="Không thể tải chỉ số hình thể">
                <BodyTracker onBackToHome={handleGoHome} />
              </ErrorBoundary>
            )}
            {activeTab === 'exercises' && (
              <ErrorBoundary fallbackTitle="Không thể tải thư viện bài tập">
                <ExerciseBrowser onBackToHome={handleGoHome} />
              </ErrorBoundary>
            )}
            {activeTab === 'history' && (
              <ErrorBoundary fallbackTitle="Không thể tải lịch sử tập">
                <HistoryAnalytics onBackToHome={handleGoHome} />
              </ErrorBoundary>
            )}
          </>
        )}
      </main>

      {/* Floating Active Workout Banner when Minimized */}
      {activeSession && isSessionMinimized && (
        <div className="fixed bottom-20 left-3 right-3 sm:left-auto sm:right-6 sm:w-96 z-40">
          <button
            onClick={() => setIsSessionMinimized(false)}
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-zinc-950 font-black text-xs sm:text-sm shadow-2xl shadow-emerald-500/30 flex items-center justify-between transition active:scale-95 animate-bounce"
          >
            <div className="flex items-center space-x-2 truncate">
              <Flame className="w-4 h-4 fill-zinc-950 shrink-0" />
              <span className="truncate">Đang tập: <strong>{activeSession.title}</strong></span>
            </div>
            <span className="flex items-center text-[11px] font-bold bg-zinc-950/20 px-2 py-0.5 rounded-lg shrink-0 ml-2">
              Tiếp tục <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </span>
          </button>
        </div>
      )}

      {/* Bottom Sticky Tab Bar for Mobile with Safe Area */}
      <nav className={`${isMobileDevice ? 'flex' : 'md:hidden'} fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/95 border-t border-zinc-800 backdrop-blur-2xl px-2 pt-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] items-center justify-around shadow-2xl`}>
        <button
          onClick={handleGoHome}
          className={`flex flex-col items-center py-1 px-2 rounded-xl transition active:scale-95 ${
            activeTab === 'routines' && (!activeSession || isSessionMinimized)
              ? 'text-emerald-400 font-bold'
              : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <HomeIcon className="w-5 h-5 mb-0.5 stroke-[2.2]" />
          <span className="text-[10px]">Trang Chủ</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('running');
            if (activeSession) setIsSessionMinimized(true);
          }}
          className={`flex flex-col items-center py-1 px-1.5 rounded-xl transition active:scale-95 ${
            activeTab === 'running' ? 'text-amber-400 font-bold' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <Footprints className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Chạy Bộ</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('body');
            if (activeSession) setIsSessionMinimized(true);
          }}
          className={`flex flex-col items-center py-1 px-1.5 rounded-xl transition active:scale-95 ${
            activeTab === 'body' ? 'text-teal-400 font-bold' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <Scale className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Hình Thể</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('exercises');
            if (activeSession) setIsSessionMinimized(true);
          }}
          className={`flex flex-col items-center py-1 px-1.5 rounded-xl transition active:scale-95 ${
            activeTab === 'exercises' ? 'text-emerald-400 font-bold' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <BookOpen className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Bài Tập</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('history');
            if (activeSession) setIsSessionMinimized(true);
          }}
          className={`flex flex-col items-center py-1 px-1.5 rounded-xl transition active:scale-95 ${
            activeTab === 'history' ? 'text-amber-400 font-bold' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <Trophy className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Kỷ Lục</span>
        </button>
      </nav>
    </div>
  );
}
