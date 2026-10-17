'use client';

import { useEffect, useState } from 'react';
import { Download, X, Wifi, WifiOff } from 'lucide-react';

export default function PWAManager() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [swRegistered, setSwRegistered] = useState(false);

  useEffect(() => {
    // 1. Đăng ký Service Worker & Tự động cập nhật
    if ('serviceWorker' in navigator) {
      let isRefreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!isRefreshing) {
          isRefreshing = true;
          window.location.reload();
        }
      });

      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          setSwRegistered(true);
          console.log('[GymTracker] Service Worker registered:', reg.scope);

          // Ép kiểm tra phiên bản mới từ server
          reg.update().catch(() => {});

          // Kiểm tra bản cập nhật mới
          reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'activated' && navigator.serviceWorker.controller) {
                  console.log('[GymTracker] New version active — reloading');
                  window.location.reload();
                }
              });
            }
          });
        })
        .catch((err) => console.error('[GymTracker] SW registration failed:', err));
    }

    // 2. Bắt sự kiện "Add to Home Screen" prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Chỉ hiện banner nếu chưa cài app
      const isStandalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone;
      if (!isStandalone) {
        setShowInstallBanner(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // 3. Theo dõi trạng thái mạng
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    setIsOffline(!navigator.onLine);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log('[GymTracker] Install prompt outcome:', outcome);
    setDeferredPrompt(null);
    setShowInstallBanner(false);
  };

  return (
    <>
      {/* Offline Indicator */}
      {isOffline && (
        <div className="fixed top-0 left-0 right-0 z-[60] bg-amber-600 text-zinc-950 text-center py-1.5 text-xs font-bold flex items-center justify-center space-x-1.5 animate-in slide-in-from-top duration-300">
          <WifiOff className="w-3.5 h-3.5" />
          <span>Đang offline — Dữ liệu tập vẫn được lưu trên máy</span>
        </div>
      )}

      {/* Install Banner */}
      {showInstallBanner && (
        <div className="fixed bottom-20 md:bottom-4 left-3 right-3 md:left-auto md:right-4 md:max-w-sm z-[55] bg-zinc-900 border border-emerald-500/40 rounded-2xl p-4 shadow-2xl shadow-emerald-500/10 animate-in slide-from-bottom duration-300">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/30">
                <Download className="w-5 h-5 text-zinc-950" />
              </div>
              <div>
                <h4 className="text-sm font-black text-white">Cài Gym Tracker</h4>
                <p className="text-[11px] text-zinc-400 mt-0.5 leading-relaxed">
                  Thêm vào màn hình chính để tập gym offline, mở nhanh như app native
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowInstallBanner(false)}
              className="p-1 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <button
              onClick={handleInstall}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-zinc-950 font-extrabold text-xs transition hover:from-emerald-600 hover:to-teal-600 active:scale-[0.98] flex items-center justify-center space-x-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Cài Đặt App</span>
            </button>
            <button
              onClick={() => setShowInstallBanner(false)}
              className="py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs transition"
            >
              Để sau
            </button>
          </div>
        </div>
      )}
    </>
  );
}
