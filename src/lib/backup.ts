export function exportAllData(): void {
  if (typeof window === 'undefined') return;
  const backup = {
    exportDate: new Date().toISOString(),
    version: '1.0',
    workouts: localStorage.getItem('gym_tracker_workout_history_v1'),
    routines: localStorage.getItem('gym_tracker_routines_v1'),
    bodyLogs: localStorage.getItem('gym_tracker_body_logs_v1'),
    bodyGoal: localStorage.getItem('gym_tracker_body_goal_v1'),
  };

  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `gym-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importAllData(jsonString: string): boolean {
  try {
    const data = JSON.parse(jsonString);
    if (data.workouts) localStorage.setItem('gym_tracker_workout_history_v1', data.workouts);
    if (data.routines) localStorage.setItem('gym_tracker_routines_v1', data.routines);
    if (data.bodyLogs) localStorage.setItem('gym_tracker_body_logs_v1', data.bodyLogs);
    if (data.bodyGoal) localStorage.setItem('gym_tracker_body_goal_v1', data.bodyGoal);
    return true;
  } catch (e) {
    console.error('Lỗi nhập dữ liệu backup:', e);
    return false;
  }
}
