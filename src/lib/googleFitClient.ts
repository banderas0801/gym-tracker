import { RunSession } from '@/types/running';
import { formatPace } from '@/data/runningCurriculum';

const GOOGLE_FIT_TOKEN_KEY = 'gym_google_fit_token_v1';
const GOOGLE_FIT_CLIENT_ID_KEY = 'gym_google_fit_client_id_v1';
const GOOGLE_FIT_EXPIRY_KEY = 'gym_google_fit_expiry_v1';

export interface GoogleFitAuthState {
  isConnected: boolean;
  accessToken?: string;
  expiresAt?: number;
  clientId?: string;
}

export function getGoogleFitAuthState(): GoogleFitAuthState {
  if (typeof window === 'undefined') return { isConnected: false };
  try {
    const token = localStorage.getItem(GOOGLE_FIT_TOKEN_KEY);
    const expiry = localStorage.getItem(GOOGLE_FIT_EXPIRY_KEY);
    const clientId = localStorage.getItem(GOOGLE_FIT_CLIENT_ID_KEY) || undefined;

    if (token) {
      const expiresAt = expiry ? parseInt(expiry, 10) : 0;
      const isValid = !expiresAt || Date.now() < expiresAt;
      return {
        isConnected: isValid,
        accessToken: token,
        expiresAt,
        clientId
      };
    }
  } catch {}
  return { isConnected: false };
}

export function saveGoogleFitAuth(accessToken: string, expiresInSeconds = 3600, clientId?: string): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(GOOGLE_FIT_TOKEN_KEY, accessToken);
    const expiresAt = Date.now() + expiresInSeconds * 1000;
    localStorage.setItem(GOOGLE_FIT_EXPIRY_KEY, String(expiresAt));
    if (clientId) {
      localStorage.setItem(GOOGLE_FIT_CLIENT_ID_KEY, clientId);
    }
  } catch {}
}

export function disconnectGoogleFit(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(GOOGLE_FIT_TOKEN_KEY);
    localStorage.removeItem(GOOGLE_FIT_EXPIRY_KEY);
  } catch {}
}

// Gọi Google Fit REST API để lấy các buổi chạy từ đồng hồ Mibro
export async function syncGoogleFitRunningSessions(accessToken: string, daysBack = 14): Promise<RunSession[]> {
  try {
    const startTimeMillis = Date.now() - daysBack * 24 * 60 * 60 * 1000;
    const startTimeIso = new Date(startTimeMillis).toISOString();

    // 1. Lấy danh sách sessions chạy bộ (activityType 8 = Running)
    const sessionsUrl = `https://fitness.googleapis.com/fitness/v1/users/me/sessions?startTime=${startTimeIso}&activityType=8`;
    const res = await fetch(sessionsUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) {
      if (res.status === 401) {
        disconnectGoogleFit();
        throw new Error('Phiên đăng nhập Google Fit đã hết hạn. Vui lòng kết nối lại.');
      }
      throw new Error(`Lỗi Google Fit API (${res.status}): ${res.statusText}`);
    }

    const data = await res.json();
    const sessionList = data.session || [];
    const runSessions: RunSession[] = [];

    // 2. Với mỗi session, lấy dữ liệu chi tiết
    for (const item of sessionList) {
      const startTime = parseInt(item.startTimeMillis, 10);
      const endTime = parseInt(item.endTimeMillis, 10);
      const durationSeconds = Math.max(1, Math.round((endTime - startTime) / 1000));

      // Gọi Aggregate API để lấy quãng đường, calo, nhịp tim, bước chân
      const aggUrl = 'https://fitness.googleapis.com/fitness/v1/users/me/dataset:aggregate';
      const aggBody = {
        aggregateBy: [
          { dataTypeName: 'com.google.distance.delta' },
          { dataTypeName: 'com.google.calories.expended' },
          { dataTypeName: 'com.google.heart_rate.bpm' },
          { dataTypeName: 'com.google.step_count.delta' }
        ],
        startTimeMillis: startTime,
        endTimeMillis: endTime
      };

      let distKm = 0;
      let calories = 0;
      let avgHeartRate: number | undefined;
      let totalSteps = 0;

      try {
        const aggRes = await fetch(aggUrl, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(aggBody)
        });

        if (aggRes.ok) {
          const aggData = await aggRes.json();
          const buckets = aggData.bucket || [];
          for (const b of buckets) {
            for (const ds of b.dataset || []) {
              for (const pt of ds.point || []) {
                const type = pt.dataTypeName;
                const vals = pt.value || [];

                if (type === 'com.google.distance.delta' && vals[0]?.fpVal) {
                  distKm += vals[0].fpVal / 1000;
                }
                if (type === 'com.google.calories.expended' && vals[0]?.fpVal) {
                  calories += Math.round(vals[0].fpVal);
                }
                if (type === 'com.google.heart_rate.bpm' && vals[0]?.fpVal) {
                  avgHeartRate = Math.round(vals[0].fpVal);
                }
                if (type === 'com.google.step_count.delta' && vals[0]?.intVal) {
                  totalSteps += vals[0].intVal;
                }
              }
            }
          }
        }
      } catch (err) {
        console.warn('Lỗi lấy dữ liệu aggregate Google Fit:', err);
      }

      // Ước tính cự ly nếu aggregate rỗng (VD: Mibro chỉ lưu name hoặc duration)
      if (distKm <= 0 && durationSeconds > 0) {
        // Dự phòng cự ly trung bình
        distKm = Math.round(((durationSeconds / 360) * 1) * 100) / 100;
      }

      distKm = Math.round(distKm * 100) / 100;
      if (calories <= 0 && distKm > 0) {
        calories = Math.round(distKm * 65);
      }

      const avgPace = formatPace(distKm > 0 ? durationSeconds / distKm : 0);
      const avgSpeed = durationSeconds > 0 ? Math.round(((distKm * 3600) / durationSeconds) * 10) / 10 : 0;
      const cadence = durationSeconds > 0 && totalSteps > 0 ? Math.round((totalSteps / durationSeconds) * 60) : undefined;

      runSessions.push({
        id: `googlefit-${item.id}`,
        date: new Date(startTime).toISOString(),
        title: item.name ? `Chạy Mibro: ${item.name}` : `Chạy Bộ Mibro / Google Fit (${distKm} km)`,
        mode: 'manual_mibro',
        distanceKm: distKm,
        durationSeconds,
        avgPace,
        avgSpeedKmh: avgSpeed,
        calories,
        avgHeartRate,
        cadence
      });
    }

    return runSessions;
  } catch (error) {
    console.error('Lỗi sync Google Fit:', error);
    throw error;
  }
}
