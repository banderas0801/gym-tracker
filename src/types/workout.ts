export interface Exercise {
  id: string;
  name: string;
  nameVi?: string;
  force?: string | null;
  level?: string;
  mechanic?: string | null;
  equipment?: string | null;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  instructions: string[];
  instructionsVi?: string[];
  category: string;
  images: string[];
}

export type SetType = 'warmup' | 'normal' | 'drop' | 'failure';

export interface SetLog {
  id: string;
  setNumber: number;
  setType: SetType;
  weightKg: number;
  reps: number;
  rpe?: number;
  isCompleted: boolean;
  previousWeightKg?: number;
  previousReps?: number;
}

export interface WorkoutExerciseItem {
  exerciseId: string;
  exerciseName: string;
  primaryMuscle: string;
  sets: SetLog[];
}

export interface WorkoutSession {
  id: string;
  title: string;
  startTime: string; // ISO
  endTime?: string;
  durationSeconds: number;
  exercises: WorkoutExerciseItem[];
  totalVolumeKg: number;
  totalSets: number;
  notes?: string;
  prsAchieved?: string[];
}

export interface RoutineTemplate {
  id: string;
  name: string;
  targetFocus: string;
  level?: 'Newbie' | 'Intermediate' | 'Advanced';
  description?: string;
  exercises: {
    exerciseId: string;
    exerciseName: string;
    defaultSets: number;
    defaultReps: number;
    suggestedWeightKg?: number;
  }[];
}
