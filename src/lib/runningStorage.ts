import { TargetSub, RunningGroup, RunSession, RunningPRs, StravaProfile } from '@/types/running';

const TARGET_SUB_KEY = 'gym_runner_target_sub_v1';
const RUNNING_GROUP_KEY = 'gym_runner_group_v1';
const CURRENT_WEEK_KEY = 'gym_runner_current_week_v1';
const RUN_SESSIONS_KEY = 'gym_running_sessions_v1';
const COMPLETED_DAYS_KEY = 'gym_runner_completed_days_v1';
const STRAVA_PROFILE_KEY = 'gym_strava_profile_v1';

export function getTargetSub(): TargetSub {
  if (typeof window === 'undefined') return 'sub215';
  try {
    const saved = localStorage.getItem(TARGET_SUB_KEY);
    if (saved) return saved as TargetSub;
  } catch {}
  return 'sub215';
}

export function saveTargetSub(sub: TargetSub): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(TARGET_SUB_KEY, sub);
  } catch {}
}

export function getRunningGroup(): RunningGroup {
  if (typeof window === 'undefined') return 'groupA';
  try {
    const saved = localStorage.getItem(RUNNING_GROUP_KEY);
    if (saved === 'groupA' || saved === 'groupB') return saved;
  } catch {}
  return 'groupA';
}

export function saveRunningGroup(group: RunningGroup): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(RUNNING_GROUP_KEY, group);
  } catch {}
}

export function getCurrentTrainingWeek(): number {
  if (typeof window === 'undefined') return 1;
  try {
    const saved = localStorage.getItem(CURRENT_WEEK_KEY);
    if (saved) {
      const num = parseInt(saved, 10);
      if (!isNaN(num) && num >= 1 && num <= 8) return num;
    }
  } catch {}
  return 1;
}

export function saveCurrentTrainingWeek(week: number): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CURRENT_WEEK_KEY, String(week));
  } catch {}
}

export function getCompletedDays(): Record<string, boolean> {
  if (typeof window === 'undefined') return {};
  try {
    const saved = localStorage.getItem(COMPLETED_DAYS_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return {};
}

export function toggleCompletedDay(weekNum: number, dayOfWeek: number): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const completed = getCompletedDays();
    const key = `w${weekNum}_d${dayOfWeek}`;
    const nextState = !completed[key];
    if (nextState) {
      completed[key] = true;
    } else {
      delete completed[key];
    }
    localStorage.setItem(COMPLETED_DAYS_KEY, JSON.stringify(completed));
    return nextState;
  } catch {
    return false;
  }
}

export function getRunSessions(): RunSession[] {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem(RUN_SESSIONS_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return [];
}

export function saveRunSession(session: RunSession): void {
  if (typeof window === 'undefined') return;
  try {
    const list = getRunSessions();
    const updated = [session, ...list.filter(s => s.id !== session.id)];
    localStorage.setItem(RUN_SESSIONS_KEY, JSON.stringify(updated));

    // Nếu buổi chạy có gắn tuần & ngày, tự động đánh dấu hoàn thành
    if (session.weekNumber && session.dayOfWeek) {
      const completed = getCompletedDays();
      completed[`w${session.weekNumber}_d${session.dayOfWeek}`] = true;
      localStorage.setItem(COMPLETED_DAYS_KEY, JSON.stringify(completed));
    }
  } catch (e) {
    console.error('Lỗi lưu buổi chạy:', e);
  }
}

export function deleteRunSession(sessionId: string): void {
  if (typeof window === 'undefined') return;
  try {
    const list = getRunSessions();
    const updated = list.filter(s => s.id !== sessionId);
    localStorage.setItem(RUN_SESSIONS_KEY, JSON.stringify(updated));
  } catch {}
}

export function calculateRunningPRs(sessions: RunSession[]): RunningPRs {
  const prs: RunningPRs = {
    totalMileageKm: 0,
    totalRunsCount: sessions.length
  };

  let maxDist = 0;
  let maxDistDate = '';

  for (const s of sessions) {
    prs.totalMileageKm += s.distanceKm;

    if (s.distanceKm > maxDist) {
      maxDist = s.distanceKm;
      maxDistDate = s.date;
    }

    // Ước tính thành tích mốc cự ly
    if (s.distanceKm >= 1.0) {
      const secPerKm = s.durationSeconds / s.distanceKm;
      if (!prs.best1k || secPerKm < prs.best1k.timeSeconds) {
        prs.best1k = {
          distanceKm: 1.0,
          timeSeconds: Math.round(secPerKm),
          pace: s.avgPace,
          date: s.date
        };
      }
    }

    if (s.distanceKm >= 3.0) {
      const sec3k = (s.durationSeconds / s.distanceKm) * 3;
      if (!prs.best3k || sec3k < prs.best3k.timeSeconds) {
        prs.best3k = {
          distanceKm: 3.0,
          timeSeconds: Math.round(sec3k),
          pace: s.avgPace,
          date: s.date
        };
      }
    }

    if (s.distanceKm >= 5.0) {
      const sec5k = (s.durationSeconds / s.distanceKm) * 5;
      if (!prs.best5k || sec5k < prs.best5k.timeSeconds) {
        prs.best5k = {
          distanceKm: 5.0,
          timeSeconds: Math.round(sec5k),
          pace: s.avgPace,
          date: s.date
        };
      }
    }

    if (s.distanceKm >= 10.0) {
      const sec10k = (s.durationSeconds / s.distanceKm) * 10;
      if (!prs.best10k || sec10k < prs.best10k.timeSeconds) {
        prs.best10k = {
          distanceKm: 10.0,
          timeSeconds: Math.round(sec10k),
          pace: s.avgPace,
          date: s.date
        };
      }
    }

    if (s.distanceKm >= 21.0) {
      const sec21k = (s.durationSeconds / s.distanceKm) * 21.0975;
      if (!prs.best21k || sec21k < prs.best21k.timeSeconds) {
        prs.best21k = {
          distanceKm: 21.1,
          timeSeconds: Math.round(sec21k),
          pace: s.avgPace,
          date: s.date
        };
      }
    }
  }

  prs.totalMileageKm = Math.round(prs.totalMileageKm * 10) / 10;
  if (maxDist > 0) {
    prs.longestDistanceKm = { distance: Math.round(maxDist * 10) / 10, date: maxDistDate };
  }

  return prs;
}

export function getStravaProfile(): StravaProfile {
  if (typeof window === 'undefined') return { isConnected: false };
  try {
    const raw = localStorage.getItem(STRAVA_PROFILE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { isConnected: false };
}

export function saveStravaProfile(profile: StravaProfile): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STRAVA_PROFILE_KEY, JSON.stringify(profile));
  } catch {}
}

// Bộ phân tích file GPX (tải từ đồng hồ Mibro / Strava / Garmin)
export function parseGPXFile(xmlText: string, titleFallback?: string): Partial<RunSession> | null {
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
    const trkpts = xmlDoc.getElementsByTagName('trkpt');
    if (!trkpts || trkpts.length === 0) return null;

    const coords: [number, number][] = [];
    let totalDistMeters = 0;
    let firstTime: Date | null = null;
    let lastTime: Date | null = null;
    let heartRates: number[] = [];
    let cadences: number[] = [];

    // Haversine
    const toRad = (x: number) => (x * Math.PI) / 180;
    const calcDist = (lat1: number, lon1: number, lat2: number, lon2: number) => {
      const R = 6371000;
      const dLat = toRad(lat2 - lat1);
      const dLon = toRad(lon2 - lon1);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    };

    for (let i = 0; i < trkpts.length; i++) {
      const pt = trkpts[i];
      const lat = parseFloat(pt.getAttribute('lat') || '0');
      const lon = parseFloat(pt.getAttribute('lon') || '0');
      if (lat && lon) {
        coords.push([lat, lon]);
        if (coords.length > 1) {
          const prev = coords[coords.length - 2];
          totalDistMeters += calcDist(prev[0], prev[1], lat, lon);
        }
      }

      const timeEl = pt.getElementsByTagName('time')[0];
      if (timeEl && timeEl.textContent) {
        const d = new Date(timeEl.textContent);
        if (!firstTime) firstTime = d;
        lastTime = d;
      }

      // Check extensions for heart rate & cadence
      const hrEl = pt.getElementsByTagName('hr')[0] || pt.getElementsByTagName('heartrate')[0];
      if (hrEl && hrEl.textContent) {
        const hr = parseInt(hrEl.textContent, 10);
        if (hr > 40 && hr < 220) heartRates.push(hr);
      }

      const cadEl = pt.getElementsByTagName('cad')[0] || pt.getElementsByTagName('cadence')[0];
      if (cadEl && cadEl.textContent) {
        const cad = parseInt(cadEl.textContent, 10);
        if (cad > 50 && cad < 240) cadences.push(cad);
      }
    }

    const distKm = Math.round((totalDistMeters / 1000) * 100) / 100;
    let durationSeconds = 0;
    if (firstTime && lastTime) {
      durationSeconds = Math.max(1, Math.round((lastTime.getTime() - firstTime.getTime()) / 1000));
    }

    const avgPaceSec = distKm > 0 ? durationSeconds / distKm : 0;
    const paceMin = Math.floor(avgPaceSec / 60);
    const paceSec = Math.round(avgPaceSec % 60);
    const avgPace = `${paceMin}:${paceSec.toString().padStart(2, '0')}`;

    const avgSpeed = durationSeconds > 0 ? Math.round(((distKm * 3600) / durationSeconds) * 10) / 10 : 0;
    const calories = Math.round(distKm * 65); // ước lượng tiêu chuẩn 65 kcal / km

    const avgHeartRate = heartRates.length > 0 ? Math.round(heartRates.reduce((a, b) => a + b, 0) / heartRates.length) : undefined;
    const maxHeartRate = heartRates.length > 0 ? Math.max(...heartRates) : undefined;
    const cadence = cadences.length > 0 ? Math.round(cadences.reduce((a, b) => a + b, 0) / cadences.length) : undefined;

    return {
      id: `run-gpx-${Date.now()}`,
      date: firstTime ? firstTime.toISOString() : new Date().toISOString(),
      title: titleFallback || `Buổi Chạy File GPX (${distKm} km)`,
      mode: 'manual_mibro',
      distanceKm: distKm,
      durationSeconds,
      avgPace,
      avgSpeedKmh: avgSpeed,
      calories,
      avgHeartRate,
      maxHeartRate,
      cadence,
      routeCoordinates: coords
    };
  } catch (err) {
    console.error('Lỗi đọc GPX:', err);
    return null;
  }
}
