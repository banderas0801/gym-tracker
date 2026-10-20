export type TargetSub = 
  | 'sub130' 
  | 'sub145' 
  | 'sub200' 
  | 'sub215' 
  | 'sub230' 
  | 'sub245' 
  | 'sub300';

export interface SubPaceDetail {
  subId: TargetSub;
  label: string;
  targetTime: string;
  racePace: string;
  easy: string;
  longRun: string;
  marathon: string;
  tempo: string;
  interval: string;
  repetition: string;
  vdotEquivalent: number;
}

export type RunningGroup = 'groupA' | 'groupB';

export type WorkoutDayType = 
  | 'rest' 
  | 'easy' 
  | 'interval' 
  | 'long_run' 
  | 'cross' 
  | 'recovery';

export interface DayTrainingPlan {
  dayOfWeek: number; // 2=Thứ 2 ... 7=Thứ 7, 8=Chủ Nhật
  dayName: string;
  groupA: {
    title: string;
    distanceKm: number;
    description: string;
    type: WorkoutDayType;
  };
  groupB: {
    title: string;
    durationMinutes: number;
    description: string;
    type: WorkoutDayType;
  };
  crossTraining?: string;
  strengthFocus?: 'upper' | 'lower' | 'mobility' | 'none';
  notes?: string;
}

export interface WeekTrainingPlan {
  weekNumber: number;
  phase: string;
  title: string;
  focus: string;
  quote: string;
  totalKmA: number;
  days: DayTrainingPlan[];
}

export type RunMode = 'outdoor_gps' | 'treadmill' | 'interval' | 'manual_mibro' | 'strava';

export interface RunSession {
  id: string;
  date: string;
  title: string;
  mode: RunMode;
  distanceKm: number;
  durationSeconds: number;
  avgPace: string;
  avgSpeedKmh: number;
  calories: number;
  avgHeartRate?: number;
  maxHeartRate?: number;
  cadence?: number; // SPM (Steps Per Minute)
  elevationGainM?: number;
  inclinePercent?: number; // Độ dốc máy chạy bộ (%)
  targetSub?: TargetSub;
  weekNumber?: number;
  dayOfWeek?: number;
  notes?: string;
  routeCoordinates?: [number, number][]; // [lat, lng]
}

export interface RunningPRItem {
  timeSeconds: number;
  pace: string;
  date: string;
  distanceKm: number;
}

export interface RunningPRs {
  best1k?: RunningPRItem;
  best3k?: RunningPRItem;
  best5k?: RunningPRItem;
  best10k?: RunningPRItem;
  best21k?: RunningPRItem;
  longestDistanceKm?: { distance: number; date: string };
  totalMileageKm: number;
  totalRunsCount: number;
}

export interface StravaProfile {
  isConnected: boolean;
  athleteName?: string;
  athleteId?: string;
  avatarUrl?: string;
  lastSyncTime?: string;
}
