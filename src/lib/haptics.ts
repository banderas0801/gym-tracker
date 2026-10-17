/**
 * Haptic feedback utility cho thiết bị di động khi tập gym
 * Giúp người tập cảm nhận rung nhẹ khi bấm nút với ngón tay ướt mồ hôi hoặc đang gồng tạ
 */
export function triggerHaptic(type: 'light' | 'medium' | 'success' | 'warning' = 'light'): void {
  if (typeof window === 'undefined' || !('vibrate' in navigator)) return;
  try {
    if (type === 'light') {
      navigator.vibrate(25);
    } else if (type === 'medium') {
      navigator.vibrate(45);
    } else if (type === 'success') {
      navigator.vibrate([30, 40, 60]);
    } else if (type === 'warning') {
      navigator.vibrate([50, 50, 50]);
    }
  } catch {
    // Không làm gián đoạn nếu trình duyệt không hỗ trợ hoặc bị chặn
  }
}
