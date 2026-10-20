'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  Square, 
  MapPin, 
  Flame, 
  Clock, 
  Gauge, 
  Compass, 
  Trophy, 
  Calendar, 
  BookOpen, 
  Sparkles, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  Circle, 
  RotateCcw, 
  Watch, 
  Upload, 
  Share2, 
  Volume2, 
  VolumeX, 
  Activity, 
  Heart, 
  Footprints, 
  Zap, 
  ShieldCheck, 
  Dumbbell, 
  Search, 
  X,
  ExternalLink,
  Sliders,
  ChevronDown,
  ChevronUp,
  CheckSquare,
  Layers,
  Award
} from 'lucide-react';
import { 
  TargetSub, 
  RunningGroup, 
  RunSession, 
  RunningPRs, 
  StravaProfile,
  DayTrainingPlan,
  WeekTrainingPlan,
  SupplementaryExercise
} from '@/types/running';
import { 
  SUB_PACE_TABLE, 
  HM_TRAINING_PLAN, 
  RUNNING_KNOWLEDGE_CHAPTERS, 
  calculateVDOT, 
  suggestSubFromVDOT,
  formatSecondsToTime,
  formatPace,
  getSupplementaryExercises
} from '@/data/runningCurriculum';
import { 
  getTargetSub, 
  saveTargetSub, 
  getRunningGroup, 
  saveRunningGroup, 
  getCurrentTrainingWeek, 
  saveCurrentTrainingWeek,
  getCompletedDays,
  toggleCompletedDay,
  getRunSessions,
  saveRunSession,
  deleteRunSession,
  calculateRunningPRs,
  getStravaProfile,
  saveStravaProfile,
  parseGPXFile
} from '@/lib/runningStorage';
import WeeklyRunningCard from './analytics/WeeklyRunningCard';

interface RunningTrackerProps {
  onGoToGymWorkout?: () => void;
}

export default function RunningTracker({ onGoToGymWorkout }: RunningTrackerProps) {
  // State quản lý chung
  const [activeSubTab, setActiveSubTab] = useState<'plan' | 'paces' | 'tracker' | 'knowledge' | 'history'>('plan');
  const [targetSub, setTargetSub] = useState<TargetSub>(() => getTargetSub());
  const [runningGroup, setRunningGroup] = useState<RunningGroup>(() => getRunningGroup());
  const [currentWeekNum, setCurrentWeekNum] = useState<number>(() => getCurrentTrainingWeek());
  const [completedDays, setCompletedDays] = useState<Record<string, boolean>>(() => getCompletedDays());
  const [sessions, setSessions] = useState<RunSession[]>(() => getRunSessions());
  const [prs, setPrs] = useState<RunningPRs>(() => calculateRunningPRs(getRunSessions()));
  const [stravaProfile, setStravaProfile] = useState<StravaProfile>(() => getStravaProfile());

  // Modals
  const [isVDOTModalOpen, setIsVDOTModalOpen] = useState(false);
  const [isMibroModalOpen, setIsMibroModalOpen] = useState(false);
  const [isStravaModalOpen, setIsStravaModalOpen] = useState(false);
  const [activeKnowledgeChapter, setActiveKnowledgeChapter] = useState<string>('chap-1');
  const [knowledgeSearch, setKnowledgeSearch] = useState('');

  // Live Run Tracker State
  const [runMode, setRunMode] = useState<'outdoor_gps' | 'treadmill' | 'interval'>('outdoor_gps');
  const [isTrackingActive, setIsTrackingActive] = useState(false);
  const [isTrackingPaused, setIsTrackingPaused] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [distanceKm, setDistanceKm] = useState(0);
  const [currentPaceSec, setCurrentPaceSec] = useState(0);
  const [gpsCoordinates, setGpsCoordinates] = useState<[number, number][]>([]);
  const [isMetronomeActive, setIsMetronomeActive] = useState(false);
  const [metronomeBpm, setMetronomeBpm] = useState(180);
  const [inclinePercent, setInclinePercent] = useState(0);
  const [manualDistanceInput, setManualDistanceInput] = useState('');
  const [selectedDayPlanForRun, setSelectedDayPlanForRun] = useState<{ week: number; day: DayTrainingPlan } | null>(null);

  // Interval State
  const [intervalPhase, setIntervalPhase] = useState<'sprint' | 'walk'>('sprint');
  const [intervalCurrentSet, setIntervalCurrentSet] = useState(1);
  const [intervalTotalSets] = useState(8);
  const [intervalPhaseSecondsLeft, setIntervalPhaseSecondsLeft] = useState(60);

  // Runner Supplementary Exercises State (Bổ trợ chuyên biệt chạy bộ)
  const [expandedSuppDays, setExpandedSuppDays] = useState<Record<string, boolean>>({});
  const [openSuppModalDay, setOpenSuppModalDay] = useState<{ weekNum: number; day: DayTrainingPlan; exercises: SupplementaryExercise[] } | null>(null);
  const [suppCompletedItems, setSuppCompletedItems] = useState<Record<string, boolean>>({});
  const [suppRestTimer, setSuppRestTimer] = useState<number | null>(null);

  // Refs
  const watchIdRef = useRef<number | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const metronomeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Khởi tạo và đồng bộ
  useEffect(() => {
    saveTargetSub(targetSub);
  }, [targetSub]);

  useEffect(() => {
    saveRunningGroup(runningGroup);
  }, [runningGroup]);

  useEffect(() => {
    saveCurrentTrainingWeek(currentWeekNum);
  }, [currentWeekNum]);

  // Âm thanh Beep (Web Audio API)
  const playBeep = (freq = 880, duration = 0.15) => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {}
  };

  // Metronome Cadence 180 SPM
  useEffect(() => {
    if (isMetronomeActive && isTrackingActive && !isTrackingPaused) {
      const intervalMs = (60 / metronomeBpm) * 1000;
      metronomeIntervalRef.current = setInterval(() => {
        playBeep(1200, 0.04);
      }, intervalMs);
    } else {
      if (metronomeIntervalRef.current) clearInterval(metronomeIntervalRef.current);
    }
    return () => {
      if (metronomeIntervalRef.current) clearInterval(metronomeIntervalRef.current);
    };
  }, [isMetronomeActive, isTrackingActive, isTrackingPaused, metronomeBpm]);

  // Bộ đếm thời gian chạy
  useEffect(() => {
    if (isTrackingActive && !isTrackingPaused) {
      timerIntervalRef.current = setInterval(() => {
        setElapsedSeconds((prev) => {
          const next = prev + 1;
          // Interval phase countdown
          if (runMode === 'interval') {
            setIntervalPhaseSecondsLeft((phasePrev) => {
              if (phasePrev <= 1) {
                // Đổi pha
                if (intervalPhase === 'sprint') {
                  setIntervalPhase('walk');
                  playBeep(440, 0.4); // Âm trầm khi đi bộ
                  return 60; // 60s đi bộ
                } else {
                  setIntervalPhase('sprint');
                  setIntervalCurrentSet((s) => s + 1);
                  playBeep(880, 0.4); // Âm cao khi bứt tốc
                  return 60; // 60s sprint
                }
              }
              return phasePrev - 1;
            });
          }
          return next;
        });
      }, 1000);
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isTrackingActive, isTrackingPaused, runMode, intervalPhase]);

  // Bộ đếm thời gian nghỉ giữa hiệp bài bổ trợ runner (Rest Timer)
  useEffect(() => {
    if (suppRestTimer === null) return;
    if (suppRestTimer <= 0) {
      playBeep(880, 0.4);
      setSuppRestTimer(null);
      return;
    }
    const interval = setInterval(() => {
      setSuppRestTimer((prev) => {
        if (prev === null || prev <= 1) {
          playBeep(880, 0.4);
          return null;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [suppRestTimer]);

  // Haversine GPS Distance
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Bắt đầu Outdoor GPS
  const startGpsTracking = () => {
    if (!('geolocation' in navigator)) {
      alert('Thiết bị hoặc trình duyệt không hỗ trợ GPS Geolocation.');
      return;
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude, speed } = pos.coords;
        setGpsCoordinates((prev) => {
          if (prev.length > 0) {
            const last = prev[prev.length - 1];
            const dist = calculateDistance(last[0], last[1], latitude, longitude);
            // Lọc nhiễu GPS: chỉ cộng khi dịch chuyển từ 2m đến 100m mỗi điểm
            if (dist > 0.002 && dist < 0.1) {
              setDistanceKm((d) => {
                const nextDist = d + dist;
                if (speed && speed > 0.5) {
                  // Speed m/s to Pace sec/km
                  const pace = 1000 / speed;
                  setCurrentPaceSec(pace);
                } else if (elapsedSeconds > 0 && nextDist > 0) {
                  setCurrentPaceSec(elapsedSeconds / nextDist);
                }
                return nextDist;
              });
              return [...prev, [latitude, longitude]];
            }
            return prev;
          }
          return [[latitude, longitude]];
        });
      },
      (err) => {
        console.warn('Lỗi GPS:', err.message);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 1000,
        timeout: 10000
      }
    );
  };

  // Chuẩn bị vào màn hình chạy Live (trạng thái Sẵn Sàng, KHÔNG tự chạy)
  const handlePrepareRun = (
    mode: 'outdoor_gps' | 'treadmill' | 'interval',
    dayPlan?: { week: number; day: DayTrainingPlan } | null
  ) => {
    if (isTrackingActive && elapsedSeconds > 0) {
      if (!confirm('Đang có một buổi chạy dở dang. Bạn có muốn đặt lại để chuyển sang bài mới không?')) {
        setActiveSubTab('tracker');
        return;
      }
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    }
    setRunMode(mode);
    if (dayPlan !== undefined) {
      setSelectedDayPlanForRun(dayPlan);
    }
    setIsTrackingActive(false);
    setIsTrackingPaused(false);
    setElapsedSeconds(0);
    setDistanceKm(0);
    setCurrentPaceSec(0);
    setGpsCoordinates([]);
    setManualDistanceInput('');
    setIntervalPhase('sprint');
    setIntervalCurrentSet(1);
    setIntervalPhaseSecondsLeft(60);
    setActiveSubTab('tracker');
  };

  // Người dùng chủ động ấn BẮT ĐẦU CHẠY
  const handleStartTracking = () => {
    setIsTrackingActive(true);
    setIsTrackingPaused(false);
    if (runMode === 'outdoor_gps') {
      startGpsTracking();
    }
    playBeep(880, 0.25);
  };

  // Đặt lại buổi chạy về 0 (Reset)
  const handleResetRun = () => {
    if (elapsedSeconds > 0 || distanceKm > 0) {
      if (!confirm('Bạn có chắc muốn đặt lại buổi chạy về 0 không? Dữ liệu đang đếm sẽ bị xóa.')) {
        return;
      }
    }
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setIsTrackingActive(false);
    setIsTrackingPaused(false);
    setElapsedSeconds(0);
    setDistanceKm(0);
    setCurrentPaceSec(0);
    setGpsCoordinates([]);
    setManualDistanceInput('');
    setIntervalPhase('sprint');
    setIntervalCurrentSet(1);
    setIntervalPhaseSecondsLeft(60);
    setIsMetronomeActive(false);
  };

  const handlePauseResume = () => {
    setIsTrackingPaused(!isTrackingPaused);
  };

  const handleFinishRun = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setIsTrackingActive(false);
    setIsTrackingPaused(false);

    // Tính toán cự ly hoàn thành
    let finalDist = distanceKm;
    if (runMode === 'treadmill' && manualDistanceInput) {
      finalDist = parseFloat(manualDistanceInput) || distanceKm;
    }
    finalDist = Math.round(finalDist * 100) / 100;

    const avgPace = formatPace(finalDist > 0 ? elapsedSeconds / finalDist : 0);
    const avgSpeed = elapsedSeconds > 0 ? Math.round(((finalDist * 3600) / elapsedSeconds) * 10) / 10 : 0;
    const calories = Math.round(finalDist * 65);

    const titlePrefix = selectedDayPlanForRun 
      ? `Tuần ${selectedDayPlanForRun.week} - ${selectedDayPlanForRun.day.dayName}`
      : (runMode === 'outdoor_gps' ? 'Chạy Ngoài Trời GPS' : runMode === 'treadmill' ? 'Máy Chạy Bộ' : 'Biến Tốc Interval');

    const newSession: RunSession = {
      id: `run-${Date.now()}`,
      date: new Date().toISOString(),
      title: `${titlePrefix} (${finalDist} km)`,
      mode: runMode,
      distanceKm: finalDist,
      durationSeconds: elapsedSeconds,
      avgPace,
      avgSpeedKmh: avgSpeed,
      calories,
      inclinePercent: runMode === 'treadmill' ? inclinePercent : undefined,
      targetSub,
      weekNumber: selectedDayPlanForRun?.week,
      dayOfWeek: selectedDayPlanForRun?.day.dayOfWeek,
      routeCoordinates: gpsCoordinates
    };

    saveRunSession(newSession);
    const updated = getRunSessions();
    setSessions(updated);
    setPrs(calculateRunningPRs(updated));
    setCompletedDays(getCompletedDays());
    setSelectedDayPlanForRun(null);
    setManualDistanceInput('');
    setElapsedSeconds(0);
    setDistanceKm(0);
    setCurrentPaceSec(0);
    setGpsCoordinates([]);
    setActiveSubTab('history');
  };

  // Toggle hoàn thành ngày trong tuần
  const handleToggleDay = (weekNum: number, dayOfWeek: number) => {
    toggleCompletedDay(weekNum, dayOfWeek);
    setCompletedDays(getCompletedDays());
  };

  // Nhập từ đồng hồ Mibro / Máy chạy bộ / Nhập cứng thủ công
  const [inputSource, setInputSource] = useState<'treadmill' | 'mibro' | 'outdoor'>('treadmill');
  const [manualInputMethod, setManualInputMethod] = useState<'by_speed' | 'by_distance'>('by_speed');
  const [manualSpeedKmh, setManualSpeedKmh] = useState('10.0'); // km/h
  const [mibroKm, setMibroKm] = useState('5.0');
  const [mibroMin, setMibroMin] = useState('30');
  const [mibroSec, setMibroSec] = useState('0');
  const [mibroHr, setMibroHr] = useState('');
  const [mibroCadence, setMibroCadence] = useState('');
  const [treadmillIncline, setTreadmillIncline] = useState('0'); // Không ghi thì mặc định = 0!
  const [selectedPlanDayKey, setSelectedPlanDayKey] = useState<string>('');

  // Tính toán nhanh Live Preview trong Modal
  const inputDurationSec = (parseInt(mibroMin, 10) || 0) * 60 + (parseInt(mibroSec, 10) || 0);
  const inputIncline = parseFloat(treadmillIncline) || 0; // Mặc định = 0 nếu không điền

  let previewKm = 0;
  let previewSpeed = 0;
  let previewPace = '--:--';

  if (manualInputMethod === 'by_speed') {
    const spd = parseFloat(manualSpeedKmh) || 0;
    previewSpeed = spd;
    if (spd > 0 && inputDurationSec > 0) {
      previewKm = Math.round(((spd * inputDurationSec) / 3600) * 100) / 100;
      previewPace = formatPace(3600 / spd);
    }
  } else {
    previewKm = parseFloat(mibroKm) || 0;
    if (previewKm > 0 && inputDurationSec > 0) {
      previewSpeed = Math.round(((previewKm * 3600) / inputDurationSec) * 10) / 10;
      previewPace = formatPace(inputDurationSec / previewKm);
    }
  }

  // Tự động đồng bộ 2 chiều (Two-way auto conversion) giữa Tốc độ và Cự ly
  const handleSpeedChange = (spdVal: string) => {
    setManualSpeedKmh(spdVal);
    const spd = parseFloat(spdVal) || 0;
    if (spd > 0 && inputDurationSec > 0) {
      const calcKm = Math.round(((spd * inputDurationSec) / 3600) * 100) / 100;
      setMibroKm(calcKm.toString());
    }
  };

  const handleDistanceChange = (distVal: string) => {
    setMibroKm(distVal);
    const km = parseFloat(distVal) || 0;
    if (km > 0 && inputDurationSec > 0) {
      const calcSpeed = Math.round(((km * 3600) / inputDurationSec) * 10) / 10;
      setManualSpeedKmh(calcSpeed.toString());
    }
  };

  const handleMinutesChange = (minVal: string) => {
    setMibroMin(minVal);
    const durSec = (parseInt(minVal, 10) || 0) * 60 + (parseInt(mibroSec, 10) || 0);
    if (durSec > 0) {
      if (manualInputMethod === 'by_speed') {
        const spd = parseFloat(manualSpeedKmh) || 0;
        if (spd > 0) {
          const calcKm = Math.round(((spd * durSec) / 3600) * 100) / 100;
          setMibroKm(calcKm.toString());
        }
      } else {
        const km = parseFloat(mibroKm) || 0;
        if (km > 0) {
          const calcSpeed = Math.round(((km * 3600) / durSec) * 10) / 10;
          setManualSpeedKmh(calcSpeed.toString());
        }
      }
    }
  };

  // Calo có tính thêm hệ số độ dốc (mỗi 1% dốc tiêu hao thêm ~4% năng lượng)
  const previewCalo = Math.round(previewKm * 65 * (1 + (inputIncline * 0.04)));

  const handleSaveMibroRun = () => {
    const km = previewKm;
    const durSec = inputDurationSec;
    const speed = previewSpeed;
    const pace = previewPace;
    const incline = inputIncline;

    if (km <= 0 || durSec <= 0) {
      alert('Vui lòng nhập tốc độ (km/h) hoặc cự ly (km) và số phút hợp lệ lớn hơn 0!');
      return;
    }

    // Tách week & day nếu người dùng chọn gắn vào giáo án
    let weekNum: number | undefined;
    let dayOfWeek: number | undefined;
    if (selectedPlanDayKey) {
      const parts = selectedPlanDayKey.split('_');
      weekNum = parseInt(parts[0], 10);
      dayOfWeek = parseInt(parts[1], 10);
    }

    const titlePrefix = inputSource === 'treadmill'
      ? (incline > 0 
          ? `Máy Chạy Treadmill ${speed} km/h (Dốc ${incline}%)` 
          : `Máy Chạy Treadmill ${speed} km/h (Dốc 0%)`)
      : inputSource === 'mibro'
      ? `Chạy Đồng Hồ Mibro (${km} km)`
      : `Chạy Ngoài Trời Nhập Cứng (${km} km)`;

    const session: RunSession = {
      id: `run-input-${Date.now()}`,
      date: new Date().toISOString(),
      title: titlePrefix,
      mode: inputSource === 'treadmill' ? 'treadmill' : inputSource === 'mibro' ? 'manual_mibro' : 'outdoor_gps',
      distanceKm: km,
      durationSeconds: durSec,
      avgPace: pace,
      avgSpeedKmh: speed,
      calories: previewCalo,
      inclinePercent: incline,
      avgHeartRate: parseInt(mibroHr, 10) || undefined,
      cadence: parseInt(mibroCadence, 10) || undefined,
      targetSub,
      weekNumber: weekNum,
      dayOfWeek: dayOfWeek
    };

    saveRunSession(session);
    const updated = getRunSessions();
    setSessions(updated);
    setPrs(calculateRunningPRs(updated));
    setCompletedDays(getCompletedDays());
    setIsMibroModalOpen(false);
    setActiveSubTab('history');
  };

  // Nhập file GPX
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const xml = event.target?.result as string;
      if (xml) {
        const parsed = parseGPXFile(xml, `Chạy Ngoài Trời (${file.name.replace('.gpx', '')})`);
        if (parsed && parsed.distanceKm) {
          saveRunSession(parsed as RunSession);
          const updated = getRunSessions();
          setSessions(updated);
          setPrs(calculateRunningPRs(updated));
          alert(`Đã nhập thành công buổi chạy: ${parsed.distanceKm} km (${parsed.avgPace}/km) từ file GPX!`);
          setActiveSubTab('history');
        } else {
          alert('Không thể đọc dữ liệu tọa độ từ file GPX này.');
        }
      }
    };
    reader.readAsText(file);
  };

  // VDOT Calculator state
  const [vdotTestDistKm, setVdotTestDistKm] = useState('5');
  const [vdotTestMin, setVdotTestMin] = useState('27');
  const [vdotTestSec, setVdotTestSec] = useState('30');
  const [calculatedVDOT, setCalculatedVDOT] = useState<number | null>(null);

  const handleComputeVDOT = () => {
    const dist = parseFloat(vdotTestDistKm) || 5;
    const sec = (parseInt(vdotTestMin, 10) || 0) * 60 + (parseInt(vdotTestSec, 10) || 0);
    if (dist > 0 && sec > 0) {
      const v = calculateVDOT(dist, sec);
      setCalculatedVDOT(v);
    }
  };

  const handleApplySuggestedSub = () => {
    if (calculatedVDOT) {
      const sub = suggestSubFromVDOT(calculatedVDOT);
      setTargetSub(sub);
      setIsVDOTModalOpen(false);
      alert(`Đã áp dụng mục tiêu: ${SUB_PACE_TABLE[sub].label}!`);
    }
  };

  // Dữ liệu tuần hiện tại
  const currentWeekPlan = HM_TRAINING_PLAN.find((w) => w.weekNumber === currentWeekNum) || HM_TRAINING_PLAN[0];
  const currentSubDetails = SUB_PACE_TABLE[targetSub];

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-24 px-3 sm:px-4 animate-in fade-in duration-300">
      {/* 1. HERO HEADER: MỤC TIÊU SUB HM & BỘ CHỌN NHANH */}
      <div className="bg-gradient-to-br from-amber-950/70 via-zinc-900 to-zinc-950 border-2 border-amber-500/40 rounded-3xl p-5 sm:p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 opacity-15 pointer-events-none">
          <Footprints className="w-56 h-56 text-amber-400" />
        </div>

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-extrabold text-xs border border-amber-500/30">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>GIÁO ÁN CHINH PHỤC HALF MARATHON 21KM</span>
            </div>

            {/* Nút VDOT & Mibro */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsVDOTModalOpen(true)}
                className="px-2.5 py-1 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700 text-[11px] font-bold flex items-center space-x-1 transition active:scale-95 shadow-sm"
              >
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Tính VDOT</span>
              </button>

              <button
                onClick={() => setIsMibroModalOpen(true)}
                className="px-2.5 py-1 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-[11px] font-bold flex items-center space-x-1 transition active:scale-95 shadow-sm"
              >
                <Watch className="w-3 h-3 text-amber-400" />
                <span>Nhập Mibro / Máy Chạy</span>
              </button>

              <button
                onClick={() => setIsStravaModalOpen(true)}
                className="px-2.5 py-1 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30 text-[11px] font-bold flex items-center space-x-1 transition active:scale-95 shadow-sm"
              >
                <Share2 className="w-3 h-3 text-blue-400" />
                <span>Google Fit / Strava</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-zinc-400">Mục tiêu Half Marathon:</span>
                <span className="text-xs font-black text-amber-400 uppercase font-mono px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/30">
                  {currentSubDetails.label}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                Pace Thi Đấu: {currentSubDetails.racePace} <span className="text-xs text-zinc-400 font-normal">phút/km</span>
              </h2>
              <div className="text-[11px] text-zinc-300 mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono">
                <span>Pace Easy (E): <strong className="text-emerald-400">{currentSubDetails.easy}</strong></span>
                <span>Pace Long (L): <strong className="text-teal-400">{currentSubDetails.longRun}</strong></span>
                <span>Pace Interval (I): <strong className="text-rose-400">{currentSubDetails.interval}</strong></span>
              </div>
            </div>

            {/* Toggle Target Sub & Group */}
            <div className="flex flex-col space-y-2 bg-zinc-950/80 p-3 rounded-2xl border border-zinc-800">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-400 font-medium">Chọn Sub mục tiêu:</span>
                <select
                  value={targetSub}
                  onChange={(e) => setTargetSub(e.target.value as TargetSub)}
                  className="bg-zinc-900 border border-zinc-700 text-amber-300 font-black px-2 py-1 rounded-xl text-xs focus:outline-none focus:border-amber-400"
                >
                  <option value="sub130">Sub 1:30 (&lt; 1h30m)</option>
                  <option value="sub145">Sub 1:45 (&lt; 1h45m)</option>
                  <option value="sub200">Sub 2:00 (&lt; 2h00m)</option>
                  <option value="sub215">Sub 2:15 (&lt; 2h15m)</option>
                  <option value="sub230">Sub 2:30 (&lt; 2h30m)</option>
                  <option value="sub245">Sub 2:45 (&lt; 2h45m)</option>
                  <option value="sub300">Sub 3:00 (&lt; 3h00m)</option>
                </select>
              </div>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-zinc-800/80">
                <span className="text-zinc-400 font-medium">Nhóm người chạy:</span>
                <div className="inline-flex rounded-xl bg-zinc-900 p-0.5 border border-zinc-800">
                  <button
                    onClick={() => setRunningGroup('groupA')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                      runningGroup === 'groupA'
                        ? 'bg-amber-500 text-black shadow-sm font-black'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    Nhóm A (Km)
                  </button>
                  <button
                    onClick={() => setRunningGroup('groupB')}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                      runningGroup === 'groupB'
                        ? 'bg-amber-500 text-black shadow-sm font-black'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    Nhóm B (Phút)
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Action Start Run Bar */}
          <div className="pt-2 flex flex-wrap items-center gap-2">
            <button
              onClick={() => handlePrepareRun('outdoor_gps')}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-400 hover:from-amber-400 hover:to-orange-300 text-zinc-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-500/25 transition flex items-center space-x-2 active:scale-95"
            >
              <Compass className="w-4 h-4 text-zinc-950" />
              <span>Chạy Ngoài Trời (GPS Live)</span>
            </button>

            <button
              onClick={() => handlePrepareRun('treadmill')}
              className="px-4 py-3 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs sm:text-sm border border-zinc-700 transition flex items-center space-x-1.5 active:scale-95"
            >
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>Máy Chạy Treadmill</span>
            </button>

            <button
              onClick={() => handlePrepareRun('interval')}
              className="px-4 py-3 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs sm:text-sm border border-zinc-700 transition flex items-center space-x-1.5 active:scale-95"
            >
              <Zap className="w-4 h-4 text-rose-400" />
              <span>Biến Tốc Interval HIIT</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. SUB-TABS NAVIGATION: GIÁO ÁN | BẢNG PACE | LIVE TRACKER | CẨM NANG | KỶ LỤC */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
        <button
          onClick={() => setActiveSubTab('plan')}
          className={`px-3.5 py-2 rounded-xl font-bold transition whitespace-nowrap active:scale-95 flex items-center space-x-1.5 ${
            activeSubTab === 'plan'
              ? 'bg-amber-500 text-black font-black shadow-sm'
              : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Giáo Án Chạy HM</span>
        </button>

        <button
          onClick={() => setActiveSubTab('paces')}
          className={`px-3.5 py-2 rounded-xl font-bold transition whitespace-nowrap active:scale-95 flex items-center space-x-1.5 ${
            activeSubTab === 'paces'
              ? 'bg-amber-500 text-black font-black shadow-sm'
              : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
          }`}
        >
          <Gauge className="w-4 h-4" />
          <span>Bảng Tra Pace E/M/T/I</span>
        </button>

        <button
          onClick={() => setActiveSubTab('tracker')}
          className={`px-3.5 py-2 rounded-xl font-bold transition whitespace-nowrap active:scale-95 flex items-center space-x-1.5 ${
            activeSubTab === 'tracker'
              ? 'bg-amber-500 text-black font-black shadow-sm'
              : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
          }`}
        >
          <Play className="w-4 h-4" />
          <span>Màn Hình Chạy Live</span>
        </button>

        <button
          onClick={() => setActiveSubTab('knowledge')}
          className={`px-3.5 py-2 rounded-xl font-bold transition whitespace-nowrap active:scale-95 flex items-center space-x-1.5 ${
            activeSubTab === 'knowledge'
              ? 'bg-amber-500 text-black font-black shadow-sm'
              : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Cẩm Nang 6 Chương</span>
        </button>

        <button
          onClick={() => setActiveSubTab('history')}
          className={`px-3.5 py-2 rounded-xl font-bold transition whitespace-nowrap active:scale-95 flex items-center space-x-1.5 ${
            activeSubTab === 'history'
              ? 'bg-amber-500 text-black font-black shadow-sm'
              : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>Lịch Sử & PRs ({sessions.length})</span>
        </button>
      </div>

      {/* 3. NỘI DUNG TỪNG SUB-TAB */}

      {/* TAB 1: GIÁO ÁN 8 TUẦN HM */}
      {activeSubTab === 'plan' && (
        <div className="space-y-4">
          {/* Week Selector Bar */}
          <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-400 font-mono tracking-wider">
                  {currentWeekPlan.phase}
                </span>
                <h3 className="text-base sm:text-lg font-black text-white">
                  {currentWeekPlan.title}
                </h3>
              </div>
              <div className="text-right">
                <span className="text-xs text-zinc-400 block">Tổng km Nhóm A:</span>
                <span className="text-base font-black text-amber-400 font-mono">
                  {currentWeekPlan.totalKmA} km / tuần
                </span>
              </div>
            </div>

            <p className="text-xs text-zinc-300 italic border-l-2 border-amber-500 pl-2">
              “{currentWeekPlan.quote}”
            </p>

            {/* Week Pills */}
            <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none pt-1">
              {HM_TRAINING_PLAN.map((w) => (
                <button
                  key={w.weekNumber}
                  onClick={() => setCurrentWeekNum(w.weekNumber)}
                  className={`px-3.5 py-1.5 rounded-xl font-bold text-xs whitespace-nowrap transition active:scale-95 ${
                    currentWeekNum === w.weekNumber
                      ? 'bg-amber-500 text-black font-black shadow-md'
                      : 'bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  Tuần {w.weekNumber}
                </button>
              ))}
              <span className="px-2.5 py-1.5 rounded-xl text-[11px] text-zinc-400 border border-dashed border-zinc-800 shrink-0 font-medium">
                + Thêm Tuần 9+
              </span>
            </div>
          </div>

          {/* Days Grid in Selected Week */}
          <div className="space-y-3">
            {currentWeekPlan.days.map((day) => {
              const isDone = !!completedDays[`w${currentWeekPlan.weekNumber}_d${day.dayOfWeek}`];
              const plan = runningGroup === 'groupA' ? day.groupA : day.groupB;
              
              let typeBadgeBg = 'bg-zinc-800 text-zinc-300 border-zinc-700';
              if (plan.type === 'interval') typeBadgeBg = 'bg-rose-500/20 text-rose-300 border-rose-500/30';
              if (plan.type === 'long_run') typeBadgeBg = 'bg-amber-500/20 text-amber-300 border-amber-500/30';
              if (plan.type === 'easy') typeBadgeBg = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
              if (plan.type === 'rest') typeBadgeBg = 'bg-blue-500/10 text-blue-300 border-blue-500/20';

              return (
                <div
                  key={day.dayOfWeek}
                  className={`border rounded-2xl p-4 transition shadow-md ${
                    isDone 
                      ? 'bg-emerald-950/20 border-emerald-500/40 opacity-90'
                      : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start space-x-3">
                      <button
                        onClick={() => handleToggleDay(currentWeekPlan.weekNumber, day.dayOfWeek)}
                        className="mt-0.5 text-zinc-400 hover:text-emerald-400 transition"
                        title={isDone ? 'Bỏ đánh dấu hoàn thành' : 'Đánh dấu đã hoàn thành'}
                      >
                        {isDone ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-500/20" />
                        ) : (
                          <Circle className="w-5 h-5" />
                        )}
                      </button>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-xs font-black text-amber-400 font-mono px-2 py-0.5 rounded-lg bg-zinc-950 border border-zinc-800">
                            {day.dayName}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${typeBadgeBg}`}>
                            {plan.type === 'interval' ? '⚡ BIẾN TỐC' : plan.type === 'long_run' ? '🏃 LONG RUN' : plan.type === 'easy' ? '🍃 CHẠY NHẸ' : plan.type === 'rest' ? '💤 NGHỈ NGƠI' : '🚴 BỔ TRỢ'}
                          </span>
                          {day.strengthFocus && day.strengthFocus !== 'none' && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                              🏋️ BỔ TRỢ {day.strengthFocus === 'upper' ? 'THÂN TRÊN' : day.strengthFocus === 'lower' ? 'THÂN DƯỚI' : 'LINH HOẠT KHỚP'}
                            </span>
                          )}
                        </div>

                        <h4 className={`text-sm sm:text-base font-bold text-white ${isDone ? 'line-through text-zinc-400' : ''}`}>
                          {plan.title}
                        </h4>

                        <p className="text-xs text-zinc-300 leading-relaxed">
                          {plan.description}
                        </p>

                        {day.notes && (
                          <p className="text-[11px] text-amber-300/80 italic">
                            💡 Mẹo: {day.notes}
                          </p>
                        )}

                        {/* Danh sách bài tập bổ trợ chuyên biệt cho runner */}
                        {(() => {
                          const suppExercises = getSupplementaryExercises(day);
                          if (suppExercises.length === 0) return null;
                          const dayKey = `w${currentWeekPlan.weekNumber}_d${day.dayOfWeek}`;
                          const isExpanded = !!expandedSuppDays[dayKey];

                          return (
                            <div className="mt-2.5 pt-2.5 border-t border-zinc-800/80 space-y-1.5">
                              <div className="flex flex-wrap items-center justify-between gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setExpandedSuppDays((prev) => ({ ...prev, [dayKey]: !prev[dayKey] }));
                                  }}
                                  className="flex items-center space-x-1.5 text-xs font-black text-teal-400 hover:text-teal-300 transition"
                                >
                                  <Dumbbell className="w-3.5 h-3.5 text-teal-400" />
                                  <span>
                                    {suppExercises.length} Bài Bổ Trợ ({day.strengthFocus === 'lower' ? 'Thân Dưới' : day.strengthFocus === 'upper' ? 'Thân Trên & Core' : 'Khớp & Phục Hồi'})
                                  </span>
                                  {isExpanded ? <ChevronUp className="w-3.5 h-3.5 ml-0.5" /> : <ChevronDown className="w-3.5 h-3.5 ml-0.5" />}
                                </button>

                                <button
                                  type="button"
                                  onClick={() => setOpenSuppModalDay({ weekNum: currentWeekPlan.weekNumber, day, exercises: suppExercises })}
                                  className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border border-teal-500/30 transition flex items-center space-x-1 active:scale-95"
                                >
                                  <Layers className="w-3 h-3 text-teal-400" />
                                  <span>Mở đếm set & nghỉ</span>
                                </button>
                              </div>

                              {isExpanded && (
                                <div className="space-y-1.5 pt-1 animate-in fade-in duration-200">
                                  {suppExercises.map((ex, exIdx) => {
                                    const itemKey = `${dayKey}_${ex.id}`;
                                    const isItemDone = !!suppCompletedItems[itemKey];

                                    return (
                                      <div
                                        key={ex.id}
                                        className={`p-2.5 rounded-xl border transition ${
                                          isItemDone
                                            ? 'bg-emerald-950/20 border-emerald-500/40 text-zinc-300'
                                            : 'bg-zinc-950/80 border-zinc-800/80 text-white'
                                        }`}
                                      >
                                        <div className="flex items-start justify-between gap-2">
                                          <div className="flex items-start space-x-2">
                                            <button
                                              type="button"
                                              onClick={() => {
                                                setSuppCompletedItems((prev) => ({ ...prev, [itemKey]: !prev[itemKey] }));
                                              }}
                                              className="mt-0.5 text-zinc-400 hover:text-emerald-400 transition"
                                              title={isItemDone ? 'Bỏ tích' : 'Tích đã hoàn thành'}
                                            >
                                              {isItemDone ? (
                                                <CheckCircle2 className="w-4 h-4 text-emerald-400 fill-emerald-500/20" />
                                              ) : (
                                                <Circle className="w-4 h-4" />
                                              )}
                                            </button>

                                            {ex.startImageUrl && (
                                              <img
                                                src={ex.startImageUrl}
                                                alt={ex.name}
                                                className="w-12 h-12 rounded-lg object-cover bg-zinc-900 border border-zinc-800 shrink-0 mt-0.5"
                                                loading="lazy"
                                              />
                                            )}

                                            <div className="space-y-0.5">
                                              <span className={`text-xs font-bold ${isItemDone ? 'line-through text-zinc-400' : 'text-white'}`}>
                                                {exIdx + 1}. {ex.name}
                                              </span>
                                              <p className="text-[11px] text-zinc-400">
                                                🎯 <strong className="text-zinc-300">{ex.target}</strong>
                                              </p>
                                              <p className="text-[11px] text-teal-300/90 italic">
                                                ✨ {ex.benefit}
                                              </p>
                                            </div>
                                          </div>

                                          <span className="text-[11px] font-mono font-bold text-amber-400 px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 shrink-0">
                                            {ex.setsReps}
                                          </span>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        })()}
                      </div>
                    </div>

                    {/* Nút hành động */}
                    <div className="shrink-0 flex flex-col space-y-1.5 items-end">
                      {plan.type !== 'rest' && (
                        <button
                          onClick={() => {
                            handlePrepareRun(
                              plan.type === 'interval' ? 'interval' : 'outdoor_gps',
                              { week: currentWeekPlan.weekNumber, day }
                            );
                          }}
                          className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs flex items-center space-x-1 shadow-md transition active:scale-95"
                        >
                          <Play className="w-3 h-3 fill-black" />
                          <span>Vào bài chạy này</span>
                        </button>
                      )}

                      {/* Nút Tập bổ trợ Runner */}
                      {(() => {
                        const suppExercises = getSupplementaryExercises(day);
                        if (suppExercises.length === 0) return null;
                        return (
                          <button
                            type="button"
                            onClick={() => setOpenSuppModalDay({ weekNum: currentWeekPlan.weekNumber, day, exercises: suppExercises })}
                            className="px-2.5 py-1.5 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 font-bold text-xs flex items-center space-x-1 border border-teal-500/40 shadow-sm transition active:scale-95"
                            title="Mở bài tập bổ trợ chuyên biệt với đồng hồ đếm set"
                          >
                            <Dumbbell className="w-3 h-3 text-teal-400" />
                            <span>Tập bổ trợ ({suppExercises.length})</span>
                          </button>
                        );
                      })()}

                      {day.strengthFocus && day.strengthFocus !== 'none' && onGoToGymWorkout && (
                        <button
                          onClick={onGoToGymWorkout}
                          className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-[11px] font-medium flex items-center space-x-1 border border-zinc-700 transition"
                          title="Mở tab bài tập Gym để tập bổ trợ"
                        >
                          <Dumbbell className="w-3 h-3 text-zinc-400" />
                          <span>Tập Gym</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: BẢNG TRA PACE MỤC TIÊU E/M/T/I */}
      {activeSubTab === 'paces' && (
        <div className="space-y-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 space-y-3">
            <h3 className="text-base sm:text-lg font-black text-white flex items-center space-x-2">
              <Gauge className="w-5 h-5 text-amber-400" />
              <span>Bảng Sub HM Theo Mục Tiêu Cá Nhân</span>
            </h3>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Dựa trên phương pháp khoa học của <strong>Jack Daniels</strong> và <strong>Giang Mê Chạy</strong>. Chọn đúng mốc Sub mục tiêu để hệ thống cá nhân hóa dải Pace chuẩn xác nhất:
            </p>

            {/* Bảng Pace Table Responsive */}
            <div className="overflow-x-auto pt-2">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-zinc-700 text-amber-400 font-black uppercase text-[11px]">
                    <th className="py-2.5 px-3">Mục tiêu</th>
                    <th className="py-2.5 px-2 bg-emerald-950/40 text-emerald-300">Easy (E)</th>
                    <th className="py-2.5 px-2 bg-teal-950/40 text-teal-300">Long (L)</th>
                    <th className="py-2.5 px-2 bg-amber-950/40 text-amber-300">Marathon (M)</th>
                    <th className="py-2.5 px-2 bg-blue-950/40 text-blue-300">Tempo (T)</th>
                    <th className="py-2.5 px-2 bg-rose-950/40 text-rose-300">Interval (I)</th>
                    <th className="py-2.5 px-2">Rep (R)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/80 font-mono">
                  {Object.values(SUB_PACE_TABLE).map((row) => {
                    const isSelected = row.subId === targetSub;
                    return (
                      <tr
                        key={row.subId}
                        onClick={() => setTargetSub(row.subId)}
                        className={`cursor-pointer transition ${
                          isSelected 
                            ? 'bg-amber-500/20 font-bold border-l-4 border-amber-500 text-white' 
                            : 'hover:bg-zinc-800/50 text-zinc-300'
                        }`}
                      >
                        <td className="py-2.5 px-3 font-sans font-black flex items-center space-x-1.5">
                          {isSelected && <span className="text-amber-400">✓</span>}
                          <span>{row.subId.toUpperCase()}</span>
                        </td>
                        <td className="py-2.5 px-2 text-emerald-400">{row.easy}</td>
                        <td className="py-2.5 px-2 text-teal-300">{row.longRun}</td>
                        <td className="py-2.5 px-2 text-amber-400 font-bold">{row.marathon}</td>
                        <td className="py-2.5 px-2 text-blue-300">{row.tempo}</td>
                        <td className="py-2.5 px-2 text-rose-400">{row.interval}</td>
                        <td className="py-2.5 px-2 text-purple-300">{row.repetition}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="pt-2 text-[11px] text-zinc-400 italic">
              💡 Chạm vào bất kỳ hàng nào để chọn làm mục tiêu tập luyện của bạn.
            </div>
          </div>

          {/* Giải thích các vùng Pace */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-zinc-900 border border-emerald-500/30 space-y-1">
              <span className="font-black text-emerald-400 uppercase font-mono">🍃 Easy (E) - Chạy Nhẹ</span>
              <p className="text-zinc-300 leading-relaxed">
                Chiếm 75-80% khối lượng. Chạy thở đều nói chuyện được, rèn luyện hệ mao mạch, phục hồi cơ và đốt mỡ.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-zinc-900 border border-teal-500/30 space-y-1">
              <span className="font-black text-teal-300 uppercase font-mono">🏃 Long Run (L) - Chạy Dài</span>
              <p className="text-zinc-300 leading-relaxed">
                Chạy cuối tuần, rèn sức bền tâm lý và khả năng chuyển hóa chất béo khi cạn Glycogen.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-zinc-900 border border-blue-500/30 space-y-1">
              <span className="font-black text-blue-300 uppercase font-mono">⚡ Tempo (T) - Ngưỡng Axit Lactic</span>
              <p className="text-zinc-300 leading-relaxed">
                Chạy ở tốc độ "nặng vừa phải" duy trì 20-40 phút để nâng cao ngưỡng thanh thải axit lactic.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-zinc-900 border border-rose-500/30 space-y-1">
              <span className="font-black text-rose-400 uppercase font-mono">🔥 Interval (I) - Biến Tốc VO2max</span>
              <p className="text-zinc-300 leading-relaxed">
                Hiệp chạy bứt tốc 1 phút hoặc 200m xen kẽ đi bộ, nâng công suất tiêu thụ oxy tối đa VO2max.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: MÀN HÌNH CHẠY LIVE TRACKER */}
      {activeSubTab === 'tracker' && (
        <div className="space-y-4">
          <div className="bg-zinc-950 border-2 border-amber-500/50 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-5">
            {/* Header Chế Độ & Trạng Thái */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800 pb-3">
              <div className="flex items-center space-x-2">
                <span className={`w-3 h-3 rounded-full ${
                  isTrackingActive && !isTrackingPaused
                    ? 'bg-emerald-400 animate-pulse'
                    : isTrackingActive && isTrackingPaused
                    ? 'bg-amber-400'
                    : elapsedSeconds > 0
                    ? 'bg-blue-400'
                    : 'bg-zinc-500'
                }`} />
                <span className="text-xs font-black text-white uppercase font-mono">
                  {isTrackingActive
                    ? (isTrackingPaused ? 'TẠM DỪNG' : 'ĐANG CHẠY LIVE')
                    : (elapsedSeconds > 0 ? 'TẠM DỪNG (CHƯA LƯU)' : 'SẴN SÀNG CHẠY')}
                </span>
                {selectedDayPlanForRun && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono flex items-center space-x-1">
                    <span>{selectedDayPlanForRun.day.dayName}: {selectedDayPlanForRun.day.groupA.title}</span>
                    <button
                      onClick={() => setSelectedDayPlanForRun(null)}
                      className="ml-1 text-zinc-400 hover:text-white"
                      title="Bỏ gắn bài tập"
                    >
                      ×
                    </button>
                  </span>
                )}
              </div>

              {/* Action Buttons: Metronome + Reset */}
              <div className="flex items-center space-x-2">
                {/* Nút Reset Đặt Lại */}
                <button
                  onClick={handleResetRun}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-rose-400 hover:border-rose-500/50 transition flex items-center space-x-1 active:scale-95"
                  title="Đặt lại mọi thông số về 0 (Reset)"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Đặt lại (Reset)</span>
                </button>

                {/* Metronome 180 SPM Button */}
                <button
                  onClick={() => setIsMetronomeActive(!isMetronomeActive)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition flex items-center space-x-1.5 ${
                    isMetronomeActive
                      ? 'bg-amber-500 text-black border-amber-400 shadow-md animate-pulse'
                      : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
                  }`}
                  title="Bật/Tắt gõ nhịp chân Cadence 180 SPM chuẩn Jack Daniels"
                >
                  {isMetronomeActive ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                  <span>180 SPM</span>
                </button>
              </div>
            </div>

            {/* Chọn Chế Độ Chạy khi Chưa Bắt Đầu */}
            {!isTrackingActive && (
              <div className="p-3 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-2">
                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                  Chọn hình thức chạy:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setRunMode('outdoor_gps')}
                    className={`py-2 px-2 rounded-xl text-xs font-bold flex flex-col items-center justify-center space-y-1 transition border ${
                      runMode === 'outdoor_gps'
                        ? 'bg-amber-500 text-black border-amber-400 font-black shadow-md'
                        : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white'
                    }`}
                  >
                    <Compass className="w-4 h-4" />
                    <span>GPS Ngoài Trời</span>
                  </button>

                  <button
                    onClick={() => setRunMode('treadmill')}
                    className={`py-2 px-2 rounded-xl text-xs font-bold flex flex-col items-center justify-center space-y-1 transition border ${
                      runMode === 'treadmill'
                        ? 'bg-amber-500 text-black border-amber-400 font-black shadow-md'
                        : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white'
                    }`}
                  >
                    <Activity className="w-4 h-4" />
                    <span>Máy Treadmill</span>
                  </button>

                  <button
                    onClick={() => setRunMode('interval')}
                    className={`py-2 px-2 rounded-xl text-xs font-bold flex flex-col items-center justify-center space-y-1 transition border ${
                      runMode === 'interval'
                        ? 'bg-amber-500 text-black border-amber-400 font-black shadow-md'
                        : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white'
                    }`}
                  >
                    <Zap className="w-4 h-4" />
                    <span>Biến Tốc Interval</span>
                  </button>
                </div>

                {/* Lựa chọn Nhập Cứng nếu đã chạy xong hoặc không muốn bấm nút bắt đầu */}
                <div className="pt-1 flex items-center justify-between gap-2 p-2.5 rounded-xl bg-zinc-950/80 border border-amber-500/20">
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-amber-300 block truncate flex items-center space-x-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>Đã chạy xong máy mà không bật bấm giờ?</span>
                    </span>
                    <span className="text-[10px] text-zinc-400 block truncate">
                      Nhập cứng Tốc độ (km/h) + Số phút + Độ dốc (mặc định 0%)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setInputSource('treadmill');
                      setManualInputMethod('by_speed');
                      setIsMibroModalOpen(true);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs shrink-0 transition active:scale-95 shadow-sm flex items-center space-x-1"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Nhập Cứng</span>
                  </button>
                </div>
              </div>
            )}

            {/* Interval Status if in Interval Mode */}
            {runMode === 'interval' && isTrackingActive && (
              <div className={`p-4 rounded-2xl border text-center transition ${
                intervalPhase === 'sprint'
                  ? 'bg-rose-950/40 border-rose-500/50'
                  : 'bg-blue-950/40 border-blue-500/50'
              }`}>
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-400 block">
                  Hiệp {intervalCurrentSet} / {intervalTotalSets}
                </span>
                <h4 className="text-2xl font-black mt-1 text-white flex items-center justify-center space-x-2">
                  <span>{intervalPhase === 'sprint' ? '⚡ BỨT TỐC INTERVAL' : '🚶 ĐI BỘ HỒI SỨC'}</span>
                </h4>
                <div className="text-4xl font-black font-mono mt-1 text-amber-400">
                  {intervalPhaseSecondsLeft}s
                </div>
              </div>
            )}

            {/* Các thông số chính Dashboard lớn */}
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800">
                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                  Thời Gian
                </span>
                <span className="text-3xl sm:text-4xl font-black text-white font-mono mt-1 block">
                  {formatSecondsToTime(elapsedSeconds)}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800">
                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                  Quãng Đường
                </span>
                <span className="text-3xl sm:text-4xl font-black text-amber-400 font-mono mt-1 block">
                  {distanceKm.toFixed(2)} <span className="text-base font-normal text-zinc-400">km</span>
                </span>
              </div>
            </div>

            {/* Pace & Calories */}
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3.5 rounded-2xl bg-zinc-900/90 border border-zinc-800">
                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                  Pace Hiện Tại
                </span>
                <span className="text-2xl font-black text-emerald-400 font-mono mt-0.5 block">
                  {currentPaceSec > 0 ? formatPace(currentPaceSec) : (distanceKm > 0 ? formatPace(elapsedSeconds / distanceKm) : '--:--')}
                  <span className="text-xs text-zinc-400 font-normal"> /km</span>
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-zinc-900/90 border border-zinc-800">
                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                  Calo Tiêu Thụ
                </span>
                <span className="text-2xl font-black text-orange-400 font-mono mt-0.5 block">
                  {Math.round(distanceKm * 65)} <span className="text-xs text-zinc-400 font-normal">kcal</span>
                </span>
              </div>
            </div>

            {/* Input Treadmill Manual Distance if in Treadmill mode */}
            {runMode === 'treadmill' && (
              <div className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
                <span className="text-xs font-bold text-zinc-300 block">
                  Nhập thông số máy chạy bộ (Treadmill):
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] text-zinc-400 block">Số Km trên máy:</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="VD: 5.2"
                      value={manualDistanceInput}
                      onChange={(e) => {
                        setManualDistanceInput(e.target.value);
                        setDistanceKm(parseFloat(e.target.value) || 0);
                      }}
                      className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white font-mono font-bold mt-0.5"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-zinc-400 block">Độ dốc máy (%):</label>
                    <input
                      type="number"
                      step="0.5"
                      placeholder="VD: 1.5"
                      value={inclinePercent}
                      onChange={(e) => setInclinePercent(parseFloat(e.target.value) || 0)}
                      className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white font-mono font-bold mt-0.5"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Route GPS Drawing Canvas if available */}
            {runMode === 'outdoor_gps' && gpsCoordinates.length > 2 && (
              <div className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-1">
                <span className="text-[11px] text-zinc-400 font-mono block">
                  📍 Bản đồ GPS: {gpsCoordinates.length} điểm tọa độ đã ghi nhận
                </span>
                <div className="h-28 w-full bg-zinc-950 rounded-xl border border-zinc-800 flex items-center justify-center text-xs text-emerald-400 font-mono">
                  Đang ghi lộ trình GPS thời gian thực...
                </div>
              </div>
            )}

            {/* Nút Điều Khiển Chạy */}
            <div className="pt-2">
              {!isTrackingActive ? (
                elapsedSeconds === 0 ? (
                  <button
                    onClick={handleStartTracking}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 hover:from-emerald-400 hover:to-teal-300 text-zinc-950 font-black text-base shadow-xl shadow-emerald-500/25 transition active:scale-95 flex items-center justify-center space-x-2"
                  >
                    <Play className="w-5 h-5 fill-zinc-950" />
                    <span>BẮT ĐẦU BUỔI CHẠY</span>
                  </button>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={handleStartTracking}
                      className="flex-1 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-sm transition flex items-center justify-center space-x-1.5 shadow-md active:scale-95"
                    >
                      <Play className="w-4 h-4 fill-black" />
                      <span>TIẾP TỤC CHẠY</span>
                    </button>

                    <button
                      onClick={handleFinishRun}
                      className="flex-1 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-black text-sm transition flex items-center justify-center space-x-1.5 shadow-md active:scale-95"
                    >
                      <Square className="w-4 h-4 fill-black" />
                      <span>KẾT THÚC & LƯU</span>
                    </button>

                    <button
                      onClick={handleResetRun}
                      className="px-4 py-3.5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-rose-400 font-bold text-sm transition flex items-center justify-center space-x-1 active:scale-95"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>ĐẶT LẠI (RESET)</span>
                    </button>
                  </div>
                )
              ) : (
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={handlePauseResume}
                    className={`flex-1 py-3.5 rounded-2xl font-black text-sm transition flex items-center justify-center space-x-1.5 shadow-md active:scale-95 ${
                      isTrackingPaused
                        ? 'bg-emerald-500 hover:bg-emerald-400 text-black'
                        : 'bg-amber-500 hover:bg-amber-400 text-black'
                    }`}
                  >
                    {isTrackingPaused ? <Play className="w-4 h-4 fill-black" /> : <Pause className="w-4 h-4 fill-black" />}
                    <span>{isTrackingPaused ? 'TIẾP TỤC' : 'TẠM DỪNG'}</span>
                  </button>

                  <button
                    onClick={handleFinishRun}
                    className="flex-1 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-sm transition flex items-center justify-center space-x-1.5 shadow-md active:scale-95"
                  >
                    <Square className="w-4 h-4 fill-white" />
                    <span>KẾT THÚC & LƯU</span>
                  </button>

                  <button
                    onClick={handleResetRun}
                    className="px-4 py-3.5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-rose-400 font-bold text-sm transition flex items-center justify-center space-x-1 active:scale-95"
                    title="Hủy buổi tập và đặt lại về 0"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>ĐẶT LẠI</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: CẨM NANG & GIÁO TRÌNH 6 CHƯƠNG */}
      {activeSubTab === 'knowledge' && (
        <div className="space-y-4">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-zinc-500" />
            <input
              type="text"
              placeholder="Tìm kiếm kỹ thuật: tiếp đất, thở cơ hoành, chấn thương, gel, cadence..."
              value={knowledgeSearch}
              onChange={(e) => setKnowledgeSearch(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Chapter Selector Tabs */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
            {RUNNING_KNOWLEDGE_CHAPTERS.map((ch) => (
              <button
                key={ch.id}
                onClick={() => setActiveKnowledgeChapter(ch.id)}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition active:scale-95 ${
                  activeKnowledgeChapter === ch.id
                    ? 'bg-amber-500 text-black font-black shadow-sm'
                    : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                <span>{ch.chapterNumber}</span>
              </button>
            ))}
          </div>

          {/* Render Active Chapter */}
          {(() => {
            const chapter = RUNNING_KNOWLEDGE_CHAPTERS.find((c) => c.id === activeKnowledgeChapter) || RUNNING_KNOWLEDGE_CHAPTERS[0];
            const filteredSections = chapter.sections.filter((sec) => {
              if (!knowledgeSearch.trim()) return true;
              const q = knowledgeSearch.toLowerCase();
              return sec.heading.toLowerCase().includes(q) || sec.content.some((c) => c.toLowerCase().includes(q));
            });

            return (
              <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
                <div>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono">
                    {chapter.chapterNumber}
                  </span>
                  <h3 className="text-lg sm:text-xl font-black text-white mt-1">
                    {chapter.title}
                  </h3>
                  <p className="text-xs text-zinc-300 mt-1 italic">
                    {chapter.summary}
                  </p>
                </div>

                <div className="space-y-4 pt-2 border-t border-zinc-800">
                  {filteredSections.map((sec, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-amber-400">
                          {sec.heading}
                        </h4>
                        {sec.badge && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            {sec.badge}
                          </span>
                        )}
                      </div>

                      <div className="space-y-1.5 text-xs text-zinc-300 leading-relaxed">
                        {sec.content.map((p, pIdx) => (
                          <p key={pIdx}>• {p}</p>
                        ))}
                      </div>

                      {sec.tips && sec.tips.length > 0 && (
                        <div className="pt-1.5 text-[11px] text-amber-300/90 font-medium space-y-1 border-t border-zinc-800/80">
                          {sec.tips.map((tip, tIdx) => (
                            <div key={tIdx} className="flex items-start space-x-1.5">
                              <span>💡</span>
                              <span>{tip}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* TAB 5: LỊCH SỬ BUỔI CHẠY & KỶ LỤC CÁ NHÂN (PRs) */}
      {activeSubTab === 'history' && (
        <div className="space-y-4">
          {/* Personal Bests (PR) Cards */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 space-y-3 shadow-xl">
            <h3 className="text-base sm:text-lg font-black text-white flex items-center space-x-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <span>Bảng Kỷ Lục Cá Nhân (Personal Bests)</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
              <div className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800 text-center">
                <span className="text-[10px] uppercase font-bold text-zinc-400 block font-mono">1KM Nhanh Nhất</span>
                <span className="text-lg font-black text-amber-400 font-mono mt-0.5 block">
                  {prs.best1k ? prs.best1k.pace : '--:--'}
                </span>
                <span className="text-[10px] text-zinc-500">{prs.best1k?.date ? new Date(prs.best1k.date).toLocaleDateString('vi-VN') : 'Chưa có'}</span>
              </div>

              <div className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800 text-center">
                <span className="text-[10px] uppercase font-bold text-zinc-400 block font-mono">3KM Tốt Nhất</span>
                <span className="text-lg font-black text-amber-400 font-mono mt-0.5 block">
                  {prs.best3k ? formatSecondsToTime(prs.best3k.timeSeconds) : '--:--'}
                </span>
                <span className="text-[10px] text-zinc-500">{prs.best3k?.date ? new Date(prs.best3k.date).toLocaleDateString('vi-VN') : 'Chưa có'}</span>
              </div>

              <div className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800 text-center">
                <span className="text-[10px] uppercase font-bold text-zinc-400 block font-mono">5KM Tốt Nhất</span>
                <span className="text-lg font-black text-amber-400 font-mono mt-0.5 block">
                  {prs.best5k ? formatSecondsToTime(prs.best5k.timeSeconds) : '--:--'}
                </span>
                <span className="text-[10px] text-zinc-500">{prs.best5k?.date ? new Date(prs.best5k.date).toLocaleDateString('vi-VN') : 'Chưa có'}</span>
              </div>

              <div className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800 text-center">
                <span className="text-[10px] uppercase font-bold text-zinc-400 block font-mono">10KM Tốt Nhất</span>
                <span className="text-lg font-black text-amber-400 font-mono mt-0.5 block">
                  {prs.best10k ? formatSecondsToTime(prs.best10k.timeSeconds) : '--:--'}
                </span>
                <span className="text-[10px] text-zinc-500">{prs.best10k?.date ? new Date(prs.best10k.date).toLocaleDateString('vi-VN') : 'Chưa có'}</span>
              </div>

              <div className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800 text-center">
                <span className="text-[10px] uppercase font-bold text-zinc-400 block font-mono">21KM Half Marathon</span>
                <span className="text-lg font-black text-rose-400 font-mono mt-0.5 block">
                  {prs.best21k ? formatSecondsToTime(prs.best21k.timeSeconds) : '--:--'}
                </span>
                <span className="text-[10px] text-zinc-500">{prs.best21k?.date ? new Date(prs.best21k.date).toLocaleDateString('vi-VN') : 'Chưa có'}</span>
              </div>

              <div className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800 text-center">
                <span className="text-[10px] uppercase font-bold text-zinc-400 block font-mono">Tổng Km Tích Lũy</span>
                <span className="text-lg font-black text-emerald-400 font-mono mt-0.5 block">
                  {prs.totalMileageKm} km
                </span>
                <span className="text-[10px] text-zinc-500">{prs.totalRunsCount} buổi chạy</span>
              </div>
            </div>

            {/* Upload File GPX / Sync Mibro Quick Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-2">
              <label className="cursor-pointer px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs flex items-center space-x-1.5 border border-zinc-700 transition active:scale-95 shadow-sm">
                <Upload className="w-3.5 h-3.5 text-amber-400" />
                <span>Tải lên file GPX từ Đồng Hồ</span>
                <input type="file" accept=".gpx" onChange={handleFileUpload} className="hidden" />
              </label>

              <button
                onClick={() => setIsMibroModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-amber-300 font-bold text-xs flex items-center space-x-1.5 border border-zinc-700 transition active:scale-95 shadow-sm"
              >
                <Watch className="w-3.5 h-3.5 text-amber-400" />
                <span>Nhập từ Mibro / Máy Chạy</span>
              </button>
            </div>
          </div>

          {/* PHÂN TÍCH TÍCH LŨY CHẠY BỘ HÀNG TUẦN & QUY TẮC 10% */}
          <WeeklyRunningCard sessions={sessions} targetWeeklyKm={currentWeekPlan.totalKmA || 24} />

          {/* Run Sessions List */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-bold text-zinc-400 tracking-wider">
              Nhật Ký Các Buổi Chạy ({sessions.length}):
            </h4>

            {sessions.length === 0 ? (
              <div className="text-center py-10 bg-zinc-950/60 rounded-3xl border border-zinc-800/80 p-6 space-y-2">
                <Footprints className="w-10 h-10 text-zinc-600 mx-auto" />
                <h4 className="text-sm font-bold text-white">Chưa có buổi chạy nào</h4>
                <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                  Hãy bấm bắt đầu chạy bằng GPS ngoài trời, máy chạy Treadmill hoặc nhập từ đồng hồ Mibro!
                </p>
              </div>
            ) : (
              sessions.map((sess) => (
                <div
                  key={sess.id}
                  className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-md"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold">
                        {sess.mode === 'outdoor_gps' ? 'GPS' : sess.mode === 'treadmill' ? 'Treadmill' : sess.mode === 'manual_mibro' ? 'Mibro' : 'Interval'}
                      </span>
                      <span className="text-xs text-zinc-400">
                        {new Date(sess.date).toLocaleDateString('vi-VN')} {new Date(sess.date).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-white truncate">
                      {sess.title}
                    </h4>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-300 font-mono">
                      <span>Cự ly: <strong className="text-amber-400">{sess.distanceKm} km</strong></span>
                      <span>Thời gian: <strong className="text-white">{formatSecondsToTime(sess.durationSeconds)}</strong></span>
                      <span>Pace TB: <strong className="text-emerald-400">{sess.avgPace}/km</strong></span>
                      {sess.cadence && <span>Cadence: <strong>{sess.cadence} spm</strong></span>}
                      {sess.avgHeartRate && <span>Tim: <strong>{sess.avgHeartRate} bpm</strong></span>}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (confirm('Bạn có chắc muốn xóa buổi chạy này?')) {
                        deleteRunSession(sess.id);
                        const updated = getRunSessions();
                        setSessions(updated);
                        setPrs(calculateRunningPRs(updated));
                      }
                    }}
                    className="p-2 text-zinc-500 hover:text-red-400 transition"
                    title="Xóa buổi chạy"
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* MODAL 1: TÍNH CHỈ SỐ VDOT JACK DANIELS */}
      {isVDOTModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl max-w-md w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-black text-white">BỘ TÍNH VDOT JACK DANIELS</h3>
              </div>
              <button onClick={() => setIsVDOTModalOpen(false)} className="text-zinc-400 hover:text-white">✕</button>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">
              Nhập thành tích chạy thử tốt nhất gần đây của bạn (3km, 5km hoặc 10km) để tính chỉ số VDOT và nhận đề xuất Sub HM chuẩn khoa học:
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-zinc-400 font-medium block">Cự ly chạy thử (km):</label>
                <select
                  value={vdotTestDistKm}
                  onChange={(e) => setVdotTestDistKm(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white font-bold mt-1"
                >
                  <option value="3">3 KM</option>
                  <option value="5">5 KM (Khuyến nghị)</option>
                  <option value="10">10 KM</option>
                  <option value="21.1">21.1 KM (Half Marathon)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-zinc-400 font-medium block">Số Phút:</label>
                  <input
                    type="number"
                    value={vdotTestMin}
                    onChange={(e) => setVdotTestMin(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white font-bold mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-400 font-medium block">Số Giây:</label>
                  <input
                    type="number"
                    value={vdotTestSec}
                    onChange={(e) => setVdotTestSec(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white font-bold mt-1"
                  />
                </div>
              </div>

              <button
                onClick={handleComputeVDOT}
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs transition shadow-md"
              >
                TÍNH TOÁN VDOT NGAY
              </button>

              {calculatedVDOT !== null && (
                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-center space-y-1.5 animate-in fade-in">
                  <span className="text-xs text-zinc-400">Chỉ số VDOT của bạn:</span>
                  <div className="text-3xl font-black text-amber-400 font-mono">
                    {calculatedVDOT}
                  </div>
                  <p className="text-xs text-white font-medium">
                    Đề xuất mục tiêu: <strong>{SUB_PACE_TABLE[suggestSubFromVDOT(calculatedVDOT)].label}</strong>
                  </p>
                  <button
                    onClick={handleApplySuggestedSub}
                    className="px-4 py-1.5 rounded-xl bg-amber-500 text-black font-black text-xs mt-2"
                  >
                    Áp Dụng Mục Tiêu Này
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: NHẬP TỪ ĐỒNG HỒ MIBRO / MÁY CHẠY BỘ / NHẬP CỨNG */}
      {isMibroModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto p-5 sm:p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center space-x-2">
                <Watch className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-black text-white">NHẬP CỨNG KẾT QUẢ CHẠY</h3>
              </div>
              <button onClick={() => setIsMibroModalOpen(false)} className="text-zinc-400 hover:text-white">✕</button>
            </div>

            {/* Toggle Nguồn tập: Máy Chạy Bộ vs Đồng Hồ Mibro vs Ngoài Trời */}
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-zinc-900 rounded-2xl border border-zinc-800">
              <button
                type="button"
                onClick={() => setInputSource('treadmill')}
                className={`py-2 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1 ${
                  inputSource === 'treadmill'
                    ? 'bg-amber-500 text-black font-black shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                <span>Máy Treadmill</span>
              </button>

              <button
                type="button"
                onClick={() => setInputSource('mibro')}
                className={`py-2 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1 ${
                  inputSource === 'mibro'
                    ? 'bg-amber-500 text-black font-black shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Watch className="w-3.5 h-3.5" />
                <span>Đồng Hồ Mibro</span>
              </button>

              <button
                type="button"
                onClick={() => setInputSource('outdoor')}
                className={`py-2 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1 ${
                  inputSource === 'outdoor'
                    ? 'bg-amber-500 text-black font-black shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Ngoài Trời</span>
              </button>
            </div>

            {/* Chọn Cách Nhập: Theo Tốc Độ (km/h) vs Theo Quãng Đường (km) */}
            <div className="flex rounded-xl bg-zinc-900/90 border border-zinc-800 p-1 text-xs">
              <button
                type="button"
                onClick={() => setManualInputMethod('by_speed')}
                className={`flex-1 py-1.5 rounded-lg font-bold transition flex items-center justify-center space-x-1 ${
                  manualInputMethod === 'by_speed'
                    ? 'bg-zinc-800 text-amber-400 shadow-sm border border-zinc-700'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Nhập Tốc Độ (km/h) & Số Phút</span>
              </button>

              <button
                type="button"
                onClick={() => setManualInputMethod('by_distance')}
                className={`flex-1 py-1.5 rounded-lg font-bold transition flex items-center justify-center space-x-1 ${
                  manualInputMethod === 'by_distance'
                    ? 'bg-zinc-800 text-amber-400 shadow-sm border border-zinc-700'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Footprints className="w-3.5 h-3.5 text-amber-400" />
                <span>Nhập Quãng Đường (km) & Số Phút</span>
              </button>
            </div>

            {/* Live Calculation Preview Banner */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-zinc-900 to-zinc-900 border border-amber-500/30 grid grid-cols-4 gap-2 text-center">
              <div>
                <span className="text-[10px] uppercase font-bold text-zinc-400 block font-mono">Quãng Đường</span>
                <span className="text-base font-black text-amber-400 font-mono mt-0.5 block">{previewKm} km</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-zinc-400 block font-mono">Tốc Độ</span>
                <span className="text-base font-black text-white font-mono mt-0.5 block">{previewSpeed} km/h</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-zinc-400 block font-mono">Pace TB</span>
                <span className="text-base font-black text-emerald-400 font-mono mt-0.5 block">{previewPace}/km</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-zinc-400 block font-mono">Calo</span>
                <span className="text-base font-black text-orange-400 font-mono mt-0.5 block">{previewCalo} kcal</span>
              </div>
            </div>

            <div className="space-y-3.5">
              {/* CHẾ ĐỘ 1: NHẬP THEO TỐC ĐỘ (KM/H) & SỐ PHÚT */}
              {manualInputMethod === 'by_speed' ? (
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between">
                      <label className="text-xs text-zinc-300 font-bold block">
                        Tốc độ chạy máy (km/h):
                      </label>
                      <span className="text-[11px] text-amber-400 font-mono font-bold">
                        {previewSpeed > 0 ? `Tương đương Pace ${previewPace}/km` : ''}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <input
                        type="number"
                        step="0.1"
                        placeholder="VD: 10.0"
                        value={manualSpeedKmh}
                        onChange={(e) => handleSpeedChange(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-base text-white font-bold font-mono focus:border-amber-500 focus:outline-none"
                      />
                      <span className="text-xs font-bold text-zinc-400 font-mono shrink-0">km/h</span>
                    </div>

                    {/* Nút chọn nhanh tốc độ */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1.5">
                      <span className="text-[10px] text-zinc-500 font-mono">Chọn nhanh:</span>
                      {['8.0', '9.0', '10.0', '10.5', '11.0', '12.0', '13.0'].map((spd) => (
                        <button
                          key={spd}
                          type="button"
                          onClick={() => handleSpeedChange(spd)}
                          className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold border transition ${
                            manualSpeedKmh === spd
                              ? 'bg-amber-500 text-black border-amber-400 font-black'
                              : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-zinc-700'
                          }`}
                        >
                          {spd}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Thời gian: Số Phút & Số Giây */}
                  <div>
                    <label className="text-xs text-zinc-300 font-bold block">
                      Thời gian chạy:
                    </label>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          placeholder="30"
                          value={mibroMin}
                          onChange={(e) => handleMinutesChange(e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-base text-white font-bold font-mono focus:border-amber-500 focus:outline-none"
                        />
                        <span className="text-xs font-bold text-zinc-400 font-mono shrink-0">phút</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          placeholder="0"
                          value={mibroSec}
                          onChange={(e) => setMibroSec(e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-base text-white font-bold font-mono focus:border-amber-500 focus:outline-none"
                        />
                        <span className="text-xs font-bold text-zinc-400 font-mono shrink-0">giây</span>
                      </div>
                    </div>

                    {/* Nút chọn nhanh thời gian */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1.5">
                      <span className="text-[10px] text-zinc-500 font-mono">Chọn phút:</span>
                      {['15', '20', '30', '40', '45', '60'].map((mins) => (
                        <button
                          key={mins}
                          type="button"
                          onClick={() => {
                            setMibroSec('0');
                            handleMinutesChange(mins);
                          }}
                          className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold border transition ${
                            mibroMin === mins && (mibroSec === '0' || mibroSec === '00' || !mibroSec)
                              ? 'bg-amber-500 text-black border-amber-400 font-black'
                              : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-zinc-700'
                          }`}
                        >
                          {mins}p
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                /* CHẾ ĐỘ 2: NHẬP THEO QUÃNG ĐƯỜNG (KM) & THỜI GIAN */
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-zinc-300 font-bold block">Quãng đường (km):</label>
                    <div className="flex items-center space-x-2 mt-1">
                      <input
                        type="number"
                        step="0.01"
                        placeholder="VD: 5.0"
                        value={mibroKm}
                        onChange={(e) => handleDistanceChange(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-base text-white font-bold font-mono focus:border-amber-500 focus:outline-none"
                      />
                      <span className="text-xs font-bold text-zinc-400 font-mono shrink-0">km</span>
                    </div>

                    {/* Nút chọn nhanh cự ly */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1.5">
                      <span className="text-[10px] text-zinc-500 font-mono">Chọn nhanh:</span>
                      {['3.0', '5.0', '7.0', '10.0', '15.0', '21.1'].map((k) => (
                        <button
                          key={k}
                          type="button"
                          onClick={() => handleDistanceChange(k)}
                          className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold border transition ${
                            mibroKm === k
                              ? 'bg-amber-500 text-black border-amber-400 font-black'
                              : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-zinc-700'
                          }`}
                        >
                          {k}km
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-zinc-300 font-bold block">Thời gian chạy:</label>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          placeholder="30"
                          value={mibroMin}
                          onChange={(e) => handleMinutesChange(e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-base text-white font-bold font-mono focus:border-amber-500 focus:outline-none"
                        />
                        <span className="text-xs font-bold text-zinc-400 font-mono shrink-0">phút</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          placeholder="0"
                          value={mibroSec}
                          onChange={(e) => setMibroSec(e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-base text-white font-bold font-mono focus:border-amber-500 focus:outline-none"
                        />
                        <span className="text-xs font-bold text-zinc-400 font-mono shrink-0">giây</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ĐỘ DỐC MÁY CHẠY BỘ (% INCLINE) - MẶC ĐỊNH BẰNG 0 NẾU KHÔNG GHI */}
              <div className="pt-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs text-zinc-300 font-bold block">
                    Độ dốc máy chạy bộ (% Incline):
                  </label>
                  <span className="text-[10px] text-zinc-400 font-mono">
                    (Không ghi thì mặc định = <strong>0%</strong>)
                  </span>
                </div>
                <div className="flex items-center space-x-2 mt-1">
                  <input
                    type="number"
                    step="0.5"
                    placeholder="0"
                    value={treadmillIncline}
                    onChange={(e) => setTreadmillIncline(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-base text-white font-bold font-mono focus:border-amber-500 focus:outline-none"
                  />
                  <span className="text-xs font-bold text-zinc-400 font-mono shrink-0">%</span>
                </div>

                {/* Nút chọn nhanh độ dốc */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1.5">
                  <span className="text-[10px] text-zinc-500 font-mono">Chọn nhanh:</span>
                  {[
                    { val: '0', label: '0% (Mặc định)' },
                    { val: '1.0', label: '1.0% (Chuẩn ngoài trời)' },
                    { val: '1.5', label: '1.5%' },
                    { val: '2.0', label: '2.0%' },
                    { val: '3.0', label: '3.0%' }
                  ].map((inc) => (
                    <button
                      key={inc.val}
                      type="button"
                      onClick={() => setTreadmillIncline(inc.val)}
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold border transition ${
                        treadmillIncline === inc.val || (treadmillIncline === '' && inc.val === '0')
                          ? 'bg-amber-500 text-black border-amber-400 font-black'
                          : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-zinc-700'
                      }`}
                    >
                      {inc.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Thông số Nhịp tim & Cadence (Tùy chọn) */}
              {inputSource === 'mibro' && (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <label className="text-xs text-zinc-400 font-medium block">Nhịp tim TB (BPM):</label>
                    <input
                      type="number"
                      placeholder="VD: 145"
                      value={mibroHr}
                      onChange={(e) => setMibroHr(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white font-bold font-mono mt-1"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <label className="text-xs text-zinc-400 font-medium">Cadence (SPM):</label>
                      <span className="text-[10px] text-amber-400 font-bold">175-185 tối ưu</span>
                    </div>
                    <input
                      type="number"
                      placeholder="VD: 178"
                      value={mibroCadence}
                      onChange={(e) => setMibroCadence(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-white font-bold font-mono mt-1"
                    />
                  </div>
                </div>
              )}

              {/* Gắn vào giáo án 8 tuần để tự động tích hoàn thành */}
              <div className="pt-1">
                <label className="text-xs text-zinc-400 font-medium block">
                  Đánh dấu hoàn thành cho bài tập trong giáo án (Tùy chọn):
                </label>
                <select
                  value={selectedPlanDayKey}
                  onChange={(e) => setSelectedPlanDayKey(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white font-medium mt-1 focus:outline-none focus:border-amber-500"
                >
                  <option value="">-- Không gắn (Chỉ lưu vào nhật ký & tích luỹ) --</option>
                  {HM_TRAINING_PLAN.map((week) => (
                    <optgroup key={week.weekNumber} label={`Tuần ${week.weekNumber}: ${week.title}`}>
                      {week.days.filter(d => (runningGroup === 'groupA' ? d.groupA.type : d.groupB.type) !== 'rest').map((d) => (
                        <option key={`${week.weekNumber}_${d.dayOfWeek}`} value={`${week.weekNumber}_${d.dayOfWeek}`}>
                          Tuần {week.weekNumber} - {d.dayName}: {runningGroup === 'groupA' ? d.groupA.title : d.groupB.title}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              {/* Nút Submit Lưu Buổi Tập */}
              <button
                type="button"
                onClick={handleSaveMibroRun}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-400 hover:from-amber-400 hover:to-orange-300 text-black font-black text-xs transition shadow-lg shadow-amber-500/20 active:scale-95 flex items-center justify-center space-x-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>LƯU BUỔI CHẠY VÀO APP ({previewKm} KM • {previewPace}/KM)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: KẾT NỐI ĐỒNG BỘ GOOGLE FIT & STRAVA CHO MIBRO FIT */}
      {isStravaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto p-5 sm:p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center space-x-2">
                <Share2 className="w-5 h-5 text-blue-400" />
                <h3 className="text-base font-black text-white">ĐỒNG BỘ MIBRO QUA GOOGLE FIT & STRAVA</h3>
              </div>
              <button onClick={() => setIsStravaModalOpen(false)} className="text-zinc-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-3 text-xs text-zinc-300 leading-relaxed">
              {/* Lựa chọn 1: Google Fit (Khuyên dùng - Miễn phí 100%) */}
              <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-blue-400 text-xs flex items-center space-x-1.5">
                    <span>🌟 1. Kết nối qua Google Fit (Hoàn toàn MIỄN PHÍ)</span>
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">
                    Khuyên dùng
                  </span>
                </div>
                <p className="text-[11px] text-zinc-300">
                  Google Fit không yêu cầu tài khoản trả phí như Strava và tương thích trực tiếp 100% với app Mibro Fit.
                </p>
                <ol className="list-decimal list-inside space-y-1 text-zinc-300 text-[11px] pt-1">
                  <li>Mở ứng dụng <strong>Mibro Fit</strong> trên điện thoại.</li>
                  <li>Vào mục <strong>Cá nhân (Me)</strong> &gt; <strong>Dịch vụ bên thứ ba (Third-party data)</strong>.</li>
                  <li>Bấm vào biểu tượng <strong>Google Fit</strong> &gt; Đăng nhập tài khoản Google của bạn.</li>
                  <li>Cấp quyền chia sẻ: Bước chân, Nhịp tim, Cự ly &amp; Thời gian.</li>
                  <li>Từ nay, mỗi khi chạy xong bằng đồng hồ Mibro, dữ liệu sẽ tự động đẩy sang Google Fit!</li>
                </ol>
              </div>

              {/* Lựa chọn 2: Strava */}
              <div className="p-3.5 rounded-2xl bg-orange-500/10 border border-orange-500/30 space-y-2">
                <span className="font-bold text-orange-400 block text-xs">
                  ⚡ 2. Kết nối qua Strava:
                </span>
                <p className="text-[11px] text-zinc-400">
                  Trong Mibro Fit, anh cũng có thể liên kết với Strava. Tuy nhiên hiện tại Strava yêu cầu tài khoản người dùng phải có gói thuê bao trả phí (Strava Subscriber) thì mới cho phép tạo ứng dụng API bên thứ ba.
                </p>
              </div>

              {/* Lựa chọn 3: File GPX & Nhập Mibro */}
              <div className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-1.5">
                <span className="font-bold text-amber-400 block text-xs">
                  🎯 3. Cách nhanh nhất không cần cài đặt:
                </span>
                <p className="text-[11px] text-zinc-300">
                  Dùng nút <strong>&quot;Nhập Mibro / Máy Chạy&quot;</strong> để gõ kết quả trong 5 giây, hoặc tải file <strong>.GPX</strong> buổi chạy lên app để lưu trữ trọn vẹn bản đồ GPS và nhịp tim!
                </p>
              </div>

              <button
                onClick={() => {
                  setIsStravaModalOpen(false);
                }}
                className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs transition shadow-lg shadow-blue-600/20 active:scale-95"
              >
                ĐÃ HIỂU HƯỚNG DẪN KẾT NỐI
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: BÀI TẬP BỔ TRỢ CHUYÊN SÂU RUNNER (STRENGTH & CONDITIONING) */}
      {openSuppModalDay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-zinc-800 flex items-center justify-between shrink-0">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center">
                  <Dumbbell className="w-5 h-5 text-teal-400" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">BÀI TẬP BỔ TRỢ RUNNER</h3>
                  <p className="text-xs text-amber-400 font-mono">
                    Tuần {openSuppModalDay.weekNum} - {openSuppModalDay.day.dayName}: {openSuppModalDay.day.groupA.title}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setOpenSuppModalDay(null);
                  setSuppRestTimer(null);
                }}
                className="p-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
              {/* Focus Banner */}
              <div className="p-3.5 rounded-2xl bg-teal-950/30 border border-teal-500/30 space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider text-teal-400 block font-mono">
                  {openSuppModalDay.day.strengthFocus === 'lower'
                    ? '🦵 BỔ TRỢ THÂN DƯỚI (LOWER BODY)'
                    : openSuppModalDay.day.strengthFocus === 'upper'
                    ? '💪 BỔ TRỢ THÂN TRÊN & CORE (UPPER & CORE)'
                    : '🧘 GIÃN CƠ & LINH HOẠT KHỚP'}
                </span>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  {openSuppModalDay.day.strengthFocus === 'lower'
                    ? 'Tăng sức mạnh đùi, mông, bắp chuối và cơ cẳng chân trước. Giúp bảo vệ khớp gối, chống đau ống đồng (Shin Splints) và tiếp đất đàn hồi.'
                    : openSuppModalDay.day.strengthFocus === 'upper'
                    ? 'Gia cố cơ trọng tâm (Core) và lưng xô. Giữ thân người thẳng đứng khi chạy kiệt sức ở nửa cuối cự ly 21km và duy trì nhịp đánh tay 180 SPM.'
                    : 'Giải tỏa căng cơ, phục hồi dây chằng và mở rộng biên độ sải chân.'}
                </p>
              </div>

              {/* Đồng hồ nghỉ thông minh (Rest Timer) */}
              <div className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-300 flex items-center space-x-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Đồng hồ nghỉ giữa hiệp (Rest Timer):</span>
                  </span>
                  {suppRestTimer !== null && (
                    <button
                      onClick={() => setSuppRestTimer(null)}
                      className="text-[10px] text-rose-400 hover:underline"
                    >
                      Dừng hẹn giờ
                    </button>
                  )}
                </div>

                {suppRestTimer !== null ? (
                  <div className="flex items-center justify-center space-x-3 py-2 bg-zinc-950 rounded-xl border border-amber-500/40 animate-pulse">
                    <span className="text-xs text-zinc-400">Nghỉ ngơi thả lỏng:</span>
                    <span className="text-3xl font-black text-amber-400 font-mono">
                      {suppRestTimer}s
                    </span>
                  </div>
                ) : (
                  <div className="grid grid-cols-4 gap-2 pt-1">
                    {[30, 45, 60, 90].map((sec) => (
                      <button
                        key={sec}
                        onClick={() => setSuppRestTimer(sec)}
                        className="py-1.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 border border-zinc-700 text-xs font-bold text-white transition active:scale-95"
                      >
                        {sec}s
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Danh sách bài tập bổ trợ chi tiết */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-zinc-400">
                  <span className="font-bold uppercase tracking-wider text-[11px]">
                    Danh sách {openSuppModalDay.exercises.length} bài tập:
                  </span>
                  <span>Chạm vào ô để đánh dấu đã tập</span>
                </div>

                {openSuppModalDay.exercises.map((ex, exIdx) => {
                  const dayKey = `w${openSuppModalDay.weekNum}_d${openSuppModalDay.day.dayOfWeek}`;
                  const itemKey = `${dayKey}_${ex.id}`;
                  const isItemDone = !!suppCompletedItems[itemKey];

                  return (
                    <div
                      key={ex.id}
                      className={`p-4 rounded-2xl border transition space-y-2.5 ${
                        isItemDone
                          ? 'bg-emerald-950/20 border-emerald-500/40 text-zinc-300'
                          : 'bg-zinc-900 border-zinc-800 text-white'
                      }`}
                    >
                      {/* Tiêu đề bài tập */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start space-x-2.5">
                          <button
                            type="button"
                            onClick={() => {
                              setSuppCompletedItems((prev) => ({ ...prev, [itemKey]: !prev[itemKey] }));
                            }}
                            className="mt-0.5 text-zinc-400 hover:text-emerald-400 transition"
                            title={isItemDone ? 'Bỏ hoàn thành' : 'Đánh dấu hoàn thành'}
                          >
                            {isItemDone ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-500/20" />
                            ) : (
                              <Circle className="w-5 h-5" />
                            )}
                          </button>

                          <div>
                            <h4 className={`text-sm font-bold ${isItemDone ? 'line-through text-zinc-400' : 'text-white'}`}>
                              {exIdx + 1}. {ex.name}
                            </h4>
                            <p className="text-xs text-zinc-400 mt-0.5">
                              🎯 <strong className="text-zinc-300">{ex.target}</strong>
                            </p>
                          </div>
                        </div>

                        <span className="text-xs font-mono font-black text-amber-400 px-2.5 py-1 rounded-xl bg-zinc-950 border border-zinc-800 shrink-0">
                          {ex.setsReps}
                        </span>
                      </div>

                      {/* Lợi ích đối với runner */}
                      <div className="p-2.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80 text-xs text-teal-300/90 leading-relaxed">
                        ✨ <strong>Tác dụng:</strong> {ex.benefit}
                      </div>

                      {/* Ảnh minh họa động tác (Tư thế Bắt đầu & Kết thúc) */}
                      {(ex.startImageUrl || ex.endImageUrl) && (
                        <div className="grid grid-cols-2 gap-2 pt-1">
                          {ex.startImageUrl && (
                            <div className="relative rounded-xl overflow-hidden bg-zinc-950 border border-zinc-800 aspect-video flex items-center justify-center group">
                              <img
                                src={ex.startImageUrl}
                                alt={`${ex.name} - Tư thế bắt đầu`}
                                className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                                loading="lazy"
                              />
                              <div className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-sm text-[10px] font-bold text-zinc-300">
                                1. Tư thế bắt đầu
                              </div>
                            </div>
                          )}

                          {ex.endImageUrl && (
                            <div className="relative rounded-xl overflow-hidden bg-zinc-950 border border-zinc-800 aspect-video flex items-center justify-center group">
                              <img
                                src={ex.endImageUrl}
                                alt={`${ex.name} - Đỉnh điểm siết cơ`}
                                className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
                                loading="lazy"
                              />
                              <div className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-sm text-[10px] font-bold text-amber-300 border border-amber-500/30">
                                2. Siết cơ đỉnh điểm
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* 3 Hiệp thực hiện (Set 1, Set 2, Set 3 checklist) */}
                      <div className="flex items-center space-x-2 pt-1">
                        <span className="text-[11px] text-zinc-400 font-medium">Đánh dấu hiệp:</span>
                        {[1, 2, 3].map((setNum) => {
                          const setKey = `${itemKey}_set_${setNum}`;
                          const isSetDone = !!suppCompletedItems[setKey];

                          return (
                            <button
                              key={setNum}
                              type="button"
                              onClick={() => {
                                const nextState = !isSetDone;
                                setSuppCompletedItems((prev) => ({ ...prev, [setKey]: nextState }));
                                if (nextState && suppRestTimer === null) {
                                  setSuppRestTimer(60); // Tự động bật nghỉ 60s sau mỗi hiệp
                                }
                              }}
                              className={`px-3 py-1 rounded-xl text-xs font-mono font-bold transition border ${
                                isSetDone
                                  ? 'bg-emerald-500 text-black border-emerald-400 shadow-sm'
                                  : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white'
                              }`}
                            >
                              Hiệp {setNum} {isSetDone ? '✓' : ''}
                            </button>
                          );
                        })}
                      </div>

                      {/* Hướng dẫn kỹ thuật từng bước */}
                      {ex.instructions && ex.instructions.length > 0 && (
                        <div className="pt-1.5 border-t border-zinc-800/60 space-y-1">
                          <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                            Hướng dẫn động tác:
                          </span>
                          <ol className="list-decimal list-inside space-y-0.5 text-[11px] text-zinc-300">
                            {ex.instructions.map((step: string, sIdx: number) => (
                              <li key={sIdx} className="leading-relaxed">{step}</li>
                            ))}
                          </ol>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-zinc-800 bg-zinc-950 flex items-center justify-between gap-3 shrink-0">
              <button
                type="button"
                onClick={() => {
                  const dayKey = `w${openSuppModalDay.weekNum}_d${openSuppModalDay.day.dayOfWeek}`;
                  const allDone: Record<string, boolean> = { ...suppCompletedItems };
                  openSuppModalDay.exercises.forEach((ex) => {
                    allDone[`${dayKey}_${ex.id}`] = true;
                    [1, 2, 3].forEach((s) => {
                      allDone[`${dayKey}_${ex.id}_set_${s}`] = true;
                    });
                  });
                  setSuppCompletedItems(allDone);
                  setOpenSuppModalDay(null);
                  setSuppRestTimer(null);
                }}
                className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-400 hover:from-teal-400 hover:to-emerald-300 text-zinc-950 font-black text-xs shadow-lg transition active:scale-95 text-center"
              >
                ✓ HOÀN THÀNH TẤT CẢ BÀI BỔ TRỢ HÔM NAY
              </button>

              <button
                type="button"
                onClick={() => {
                  setOpenSuppModalDay(null);
                  setSuppRestTimer(null);
                }}
                className="px-4 py-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 font-bold text-xs transition"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
