import exercisesData from '@/data/exercises.json';
import { Exercise } from '@/types/workout';

const exercisesList = exercisesData as unknown as Exercise[];

// Cache tra cứu nhanh theo ID và tên đã chuẩn hóa
const exerciseCache = new Map<string, Exercise>();

// Khởi tạo cache
exercisesList.forEach((ex) => {
  exerciseCache.set(ex.id.toLowerCase(), ex);
  exerciseCache.set(ex.name.toLowerCase(), ex);
});

export interface ExerciseMediaInfo {
  id: string;
  name: string;
  images: string[];
  startImageUrl: string | null;
  endImageUrl: string | null;
  instructions: string[];
  primaryMuscles: string[];
  secondaryMuscles: string[];
  equipment?: string | null;
  level?: string;
  category?: string;
}

export function getExerciseMedia(exerciseId: string, exerciseName?: string): ExerciseMediaInfo {
  const idKey = (exerciseId || '').toLowerCase().trim();
  const nameKey = (exerciseName || '').toLowerCase().trim();

  // 1. Tìm chính xác theo ID
  let match = exerciseCache.get(idKey);

  // 2. Tìm theo Tên
  if (!match && nameKey) {
    match = exerciseCache.get(nameKey);
  }

  // 3. Tìm theo ID dạng thay thế gạch dưới
  if (!match && idKey) {
    const unslugged = idKey.replace(/_/g, ' ');
    match = exerciseCache.get(unslugged);
  }

  // 4. Tìm kiếm gần đúng (partial match)
  if (!match) {
    const cleanSearch = (idKey || nameKey).replace(/[_\-\(\)]/g, ' ').trim();
    match = exercisesList.find((e) => {
      const eName = e.name.toLowerCase();
      const eId = e.id.toLowerCase().replace(/_/g, ' ');
      return eName.includes(cleanSearch) || cleanSearch.includes(eName) || eId.includes(cleanSearch);
    });
  }

  const images = match?.images || [];
  const startImg = images[0]
    ? `https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/${images[0]}`
    : null;
  const endImg = images[1]
    ? `https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/${images[1]}`
    : startImg;

  return {
    id: match?.id || exerciseId,
    name: match?.name || exerciseName || exerciseId,
    images,
    startImageUrl: startImg,
    endImageUrl: endImg,
    instructions: match?.instructions || [],
    primaryMuscles: match?.primaryMuscles || [],
    secondaryMuscles: match?.secondaryMuscles || [],
    equipment: match?.equipment || null,
    level: match?.level || 'Mọi cấp độ',
    category: match?.category || 'Strength',
  };
}
