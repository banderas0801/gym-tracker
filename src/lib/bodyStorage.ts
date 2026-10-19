import { BodyMetricLog, BodyGoal } from '@/types/body';

const BODY_LOGS_KEY = 'gym_tracker_body_logs_v1';
const BODY_GOAL_KEY = 'gym_tracker_body_goal_v1';

export const DEFAULT_GOAL: BodyGoal = {
  goalType: 'cut',
  heightCm: 172,
  startingWeightKg: 75.0,
  targetWeightKg: 69.5,
  startDate: new Date(Date.now() - 28 * 24 * 3600 * 1000).toISOString().split('T')[0],
  targetDate: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().split('T')[0],
};

export const INITIAL_SAMPLE_LOGS: BodyMetricLog[] = [
  {
    id: 'sample-1',
    date: new Date(Date.now() - 28 * 24 * 3600 * 1000).toISOString().split('T')[0],
    weightKg: 75.0,
    bodyFatPercent: 21.5,
    measurements: {
      chestCm: 98,
      waistCm: 85,
      hipsCm: 96,
      leftBicepCm: 34.5,
      rightBicepCm: 35.0,
      leftThighCm: 56,
      rightThighCm: 56.5
    },
    notes: 'Bắt đầu siết mỡ (Cut). Thể lực tốt.'
  },
  {
    id: 'sample-2',
    date: new Date(Date.now() - 21 * 24 * 3600 * 1000).toISOString().split('T')[0],
    weightKg: 74.2,
    bodyFatPercent: 20.8,
    measurements: {
      chestCm: 98,
      waistCm: 84,
      hipsCm: 95.5,
      leftBicepCm: 34.5,
      rightBicepCm: 35.0,
      leftThighCm: 55.5,
      rightThighCm: 56.0
    },
    notes: 'Giảm được 0.8kg nước và mỡ tuần đầu.'
  },
  {
    id: 'sample-3',
    date: new Date(Date.now() - 14 * 24 * 3600 * 1000).toISOString().split('T')[0],
    weightKg: 73.5,
    bodyFatPercent: 20.1,
    measurements: {
      chestCm: 97.5,
      waistCm: 82.5,
      hipsCm: 95.0,
      leftBicepCm: 34.8,
      rightBicepCm: 35.2,
      leftThighCm: 55.0,
      rightThighCm: 55.5
    },
    notes: 'Bụng gọn thấy rõ, tay giữ nguyên kích thước.'
  },
  {
    id: 'sample-4',
    date: new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString().split('T')[0],
    weightKg: 72.8,
    bodyFatPercent: 19.4,
    measurements: {
      chestCm: 97.5,
      waistCm: 81.0,
      hipsCm: 94.5,
      leftBicepCm: 35.0,
      rightBicepCm: 35.3,
      leftThighCm: 55.0,
      rightThighCm: 55.0
    },
    notes: 'Tập cường độ cao, cơ bắp nét hơn.'
  },
  {
    id: 'sample-5',
    date: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString().split('T')[0],
    weightKg: 72.1,
    bodyFatPercent: 18.8,
    measurements: {
      chestCm: 98.0,
      waistCm: 79.5,
      hipsCm: 94.0,
      leftBicepCm: 35.2,
      rightBicepCm: 35.5,
      leftThighCm: 55.0,
      rightThighCm: 55.0
    },
    notes: 'Eo xuống dưới 80cm! Cơ ngực và xô lộ rõ.'
  }
];

export function getBodyLogs(): BodyMetricLog[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(BODY_LOGS_KEY);
    if (!raw) {
      localStorage.setItem(BODY_LOGS_KEY, JSON.stringify(INITIAL_SAMPLE_LOGS));
      return INITIAL_SAMPLE_LOGS;
    }
    const list: BodyMetricLog[] = JSON.parse(raw);
    return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (e) {
    console.error('Lỗi đọc chỉ số cơ thể:', e);
    return [];
  }
}

export function saveBodyLog(log: BodyMetricLog): void {
  if (typeof window === 'undefined') return;
  try {
    const list = getBodyLogs();
    const existingIndex = list.findIndex(item => item.id === log.id || item.date === log.date);
    let updated: BodyMetricLog[];
    if (existingIndex >= 0) {
      updated = [...list];
      updated[existingIndex] = log;
    } else {
      updated = [log, ...list];
    }
    localStorage.setItem(BODY_LOGS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Lỗi lưu chỉ số cơ thể:', e);
  }
}

export function deleteBodyLog(id: string): void {
  if (typeof window === 'undefined') return;
  try {
    const list = getBodyLogs();
    const filtered = list.filter(item => item.id !== id);
    localStorage.setItem(BODY_LOGS_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.error('Lỗi xóa chỉ số cơ thể:', e);
  }
}

export function getLatestBodyLog(): BodyMetricLog | null {
  const logs = getBodyLogs();
  return logs.length > 0 ? logs[0] : null;
}

export function getBodyGoal(): BodyGoal {
  if (typeof window === 'undefined') return DEFAULT_GOAL;
  try {
    const raw = localStorage.getItem(BODY_GOAL_KEY);
    if (!raw) {
      localStorage.setItem(BODY_GOAL_KEY, JSON.stringify(DEFAULT_GOAL));
      return DEFAULT_GOAL;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_GOAL;
  }
}

export function saveBodyGoal(goal: BodyGoal): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(BODY_GOAL_KEY, JSON.stringify(goal));
  } catch (e) {
    console.error('Lỗi lưu mục tiêu:', e);
  }
}

export function calculateBMI(weightKg: number, heightCm: number): { bmi: number; category: string; color: string } {
  if (heightCm <= 0 || weightKg <= 0) {
    return { bmi: 0, category: 'Chưa xác định', color: 'text-zinc-400' };
  }
  const heightM = heightCm / 100;
  const bmi = Math.round((weightKg / (heightM * heightM)) * 10) / 10;

  if (bmi < 18.5) return { bmi, category: 'Thiếu cân', color: 'text-amber-400' };
  if (bmi < 24.9) return { bmi, category: 'Chuẩn dáng / Cân đối', color: 'text-emerald-400' };
  if (bmi < 29.9) return { bmi, category: 'Thừa cân nhẹ', color: 'text-orange-400' };
  return { bmi, category: 'Béo phì', color: 'text-red-400' };
}
