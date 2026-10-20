import { BodyMetricLog, BodyGoal } from '@/types/body';

const BODY_LOGS_KEY = 'gym_tracker_body_logs_v1';
const BODY_GOAL_KEY = 'gym_tracker_body_goal_v1';

export const DEFAULT_GOAL: BodyGoal = {
  goalType: 'maintain',
  heightCm: 170,
  startingWeightKg: 70.0,
  targetWeightKg: 70.0,
  startDate: new Date().toISOString().split('T')[0],
  targetDate: new Date(Date.now() + 60 * 24 * 3600 * 1000).toISOString().split('T')[0],
};

export const INITIAL_SAMPLE_LOGS: BodyMetricLog[] = [];

export function getBodyLogs(): BodyMetricLog[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(BODY_LOGS_KEY);
    if (!raw) {
      return [];
    }
    const list: BodyMetricLog[] = JSON.parse(raw);
    // Tự động loại bỏ dữ liệu mẫu có prefix sample- nếu còn sót lại từ bản build trước
    const realList = list.filter(item => !item.id?.startsWith('sample-'));
    if (realList.length !== list.length) {
      localStorage.setItem(BODY_LOGS_KEY, JSON.stringify(realList));
    }
    return realList.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
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
