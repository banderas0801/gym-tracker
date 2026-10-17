export interface BodyMeasurements {
  chestCm?: number;       // Vòng ngực
  waistCm?: number;       // Vòng eo / bụng
  hipsCm?: number;        // Vòng mông
  leftBicepCm?: number;   // Bắp tay trái
  rightBicepCm?: number;  // Bắp tay phải
  leftThighCm?: number;   // Đùi trái
  rightThighCm?: number;  // Đùi phải
  calvesCm?: number;      // Bắp chuối
  shouldersCm?: number;   // Vòng vai
  neckCm?: number;        // Vòng cổ
}

export interface BodyMetricLog {
  id: string;
  date: string; // YYYY-MM-DD or ISO string
  weightKg: number;
  bodyFatPercent?: number;
  muscleMassKg?: number;
  measurements?: BodyMeasurements;
  notes?: string;
}

export type GoalType = 'cut' | 'bulk' | 'maintain';

export interface BodyGoal {
  goalType: GoalType;
  heightCm: number;
  startingWeightKg: number;
  targetWeightKg: number;
  startDate: string;
  targetDate?: string;
}
