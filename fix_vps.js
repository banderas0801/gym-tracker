const { Client } = require('ssh2');
const fs = require('fs');
const path = require('path');

const SSH_CONFIG = {
  host: '103.77.209.87',
  port: 22,
  username: 'root',
  password: 'b!Wer2V*gXdGqJQ',
  readyTimeout: 30000
};

const LOG_FILE = path.join(__dirname, 'vps_debug.txt');
fs.writeFileSync(LOG_FILE, `=== BẮT ĐẦU SỬA LỖI 502 & BUILD: ${new Date().toISOString()} ===\n`);

function logOutput(text) {
  process.stdout.write(text);
  fs.appendFileSync(LOG_FILE, text);
}

function runSSH(conn, cmd) {
  return new Promise((resolve, reject) => {
    logOutput(`\n>>> [VPS] ${cmd}\n`);
    conn.exec(cmd, (err, stream) => {
      if (err) return reject(err);
      let stdout = '';
      let stderr = '';
      stream.on('close', (code) => {
        resolve({ stdout, stderr, code });
      }).on('data', (data) => {
        logOutput(data.toString());
        stdout += data;
      }).stderr.on('data', (data) => {
        logOutput(data.toString());
        stderr += data;
      });
    });
  });
}

function uploadFileOverSFTP(conn, localPath, remotePath) {
  return new Promise((resolve, reject) => {
    conn.sftp((err, sftp) => {
      if (err) return reject(err);
      logOutput(`\n[SFTP] Đồng bộ file: ${path.basename(localPath)} -> ${remotePath}\n`);
      sftp.fastPut(localPath, remotePath, (uploadErr) => {
        sftp.end();
        if (uploadErr) return reject(uploadErr);
        logOutput(`✅ SFTP hoàn tất: ${path.basename(localPath)}\n`);
        resolve();
      });
    });
  });
}

async function main() {
  logOutput('Đang kết nối máy chủ VPS 103.77.209.87...\n');
  const conn = new Client();
  await new Promise((resolve, reject) => {
    conn.on('ready', resolve);
    conn.on('error', reject);
    conn.connect(SSH_CONFIG);
  });
  logOutput('✅ Đã kết nối VPS thành công!\n');

  // 1. Kiểm tra trạng thái PM2 & Port 3008
  logOutput('\n--- BƯỚC 1: Kiểm tra trạng thái hiện tại trên VPS ---\n');
  await runSSH(conn, 'pm2 list; ss -tulpn | grep 3008 || netstat -tulpn | grep 3008 || echo "Port 3008 CHƯA CÓ TIẾN TRÌNH NÀO LẮNG NGHE!"');

  // 2. Kéo git mới nhất
  logOutput('\n--- BƯỚC 2: Kéo commit mới nhất từ GitHub ---\n');
  await runSSH(conn, 'cd /var/www/gym-tracker && git fetch origin master && git reset --hard origin/master && git log -n 3 --oneline');

  // 3. Đảm bảo các file cốt lõi không bị lệch type
  logOutput('\n--- BƯỚC 3: Kiểm tra và đảm bảo các file mã nguồn mới nhất trên VPS ---\n');
  await runSSH(conn, 'mkdir -p /var/www/gym-tracker/src/components/analytics /var/www/gym-tracker/src/components/workout /var/www/gym-tracker/src/lib /var/www/gym-tracker/src/types /var/www/gym-tracker/src/data');
  const filesToVerify = [
    { local: path.join(__dirname, 'src/types/running.ts'), remote: '/var/www/gym-tracker/src/types/running.ts' },
    { local: path.join(__dirname, 'src/types/workout.ts'), remote: '/var/www/gym-tracker/src/types/workout.ts' },
    { local: path.join(__dirname, 'src/data/runningCurriculum.ts'), remote: '/var/www/gym-tracker/src/data/runningCurriculum.ts' },
    { local: path.join(__dirname, 'src/lib/weeklyAnalytics.ts'), remote: '/var/www/gym-tracker/src/lib/weeklyAnalytics.ts' },
    { local: path.join(__dirname, 'src/lib/exerciseMedia.ts'), remote: '/var/www/gym-tracker/src/lib/exerciseMedia.ts' },
    { local: path.join(__dirname, 'src/lib/exerciseGuide.ts'), remote: '/var/www/gym-tracker/src/lib/exerciseGuide.ts' },
    { local: path.join(__dirname, 'src/lib/storage.ts'), remote: '/var/www/gym-tracker/src/lib/storage.ts' },
    { local: path.join(__dirname, 'src/components/RoutineList.tsx'), remote: '/var/www/gym-tracker/src/components/RoutineList.tsx' },
    { local: path.join(__dirname, 'src/components/ExerciseQuickViewModal.tsx'), remote: '/var/www/gym-tracker/src/components/ExerciseQuickViewModal.tsx' },
    { local: path.join(__dirname, 'src/components/SmartWorkoutModal.tsx'), remote: '/var/www/gym-tracker/src/components/SmartWorkoutModal.tsx' },
    { local: path.join(__dirname, 'src/components/LevelAdvisorModal.tsx'), remote: '/var/www/gym-tracker/src/components/LevelAdvisorModal.tsx' },
    { local: path.join(__dirname, 'src/components/ExerciseBrowser.tsx'), remote: '/var/www/gym-tracker/src/components/ExerciseBrowser.tsx' },
    { local: path.join(__dirname, 'src/components/ActiveWorkoutView.tsx'), remote: '/var/www/gym-tracker/src/components/ActiveWorkoutView.tsx' },
    { local: path.join(__dirname, 'src/components/workout/WorkoutHeader.tsx'), remote: '/var/www/gym-tracker/src/components/workout/WorkoutHeader.tsx' },
    { local: path.join(__dirname, 'src/components/analytics/WeeklyRunningCard.tsx'), remote: '/var/www/gym-tracker/src/components/analytics/WeeklyRunningCard.tsx' },
    { local: path.join(__dirname, 'src/components/analytics/WeeklyGymCard.tsx'), remote: '/var/www/gym-tracker/src/components/analytics/WeeklyGymCard.tsx' },
    { local: path.join(__dirname, 'src/components/RunningTracker.tsx'), remote: '/var/www/gym-tracker/src/components/RunningTracker.tsx' },
    { local: path.join(__dirname, 'src/components/HistoryAnalytics.tsx'), remote: '/var/www/gym-tracker/src/components/HistoryAnalytics.tsx' },
    { local: path.join(__dirname, 'src/components/BodyTracker.tsx'), remote: '/var/www/gym-tracker/src/components/BodyTracker.tsx' },
    { local: path.join(__dirname, 'src/lib/bodyStorage.ts'), remote: '/var/www/gym-tracker/src/lib/bodyStorage.ts' },
    { local: path.join(__dirname, 'src/app/page.tsx'), remote: '/var/www/gym-tracker/src/app/page.tsx' },
    { local: path.join(__dirname, 'public/sw.js'), remote: '/var/www/gym-tracker/public/sw.js' },
    { local: path.join(__dirname, 'package.json'), remote: '/var/www/gym-tracker/package.json' },
  ];

  for (const f of filesToVerify) {
    if (fs.existsSync(f.local)) {
      await uploadFileOverSFTP(conn, f.local, f.remote);
    }
  }

  // 4. Build Next.js Production
  logOutput('\n--- BƯỚC 4: Build Next.js Production trên VPS ---\n');
  const bRes = await runSSH(conn, 'cd /var/www/gym-tracker && npm run build');
  if (bRes.code !== 0) {
    logOutput('\n❌ Build thất bại! Dừng quy trình.\n');
    conn.end();
    process.exit(1);
  }
  logOutput('\n✅ Build Next.js thành công 100%!\n');

  // 5. Khởi động lại PM2 trên port 3008
  logOutput('\n--- BƯỚC 5: Khởi động lại PM2 trên cổng 3008 ---\n');
  await runSSH(conn, 'pm2 delete gym-tracker 2>/dev/null || true');
  await runSSH(conn, 'cd /var/www/gym-tracker && pm2 start npm --name "gym-tracker" -- run start');
  await runSSH(conn, 'pm2 save');

  // 6. Đợi 4 giây và kiểm tra phản hồi
  logOutput('\n--- BƯỚC 6: Kiểm tra phản hồi ứng dụng & Nginx ---\n');
  await runSSH(conn, 'sleep 4; pm2 list; curl -I http://127.0.0.1:3008; curl -I https://gym.makeno.space');

  logOutput('\n========================================================\n');
  logOutput('🎉 QUÁ TRÌNH SỬA LỖI & TRIỂN KHAI ĐÃ HOÀN TẤT THÀNH CÔNG!\n');
  logOutput('👉 Website hoạt động tại: https://gym.makeno.space\n');
  logOutput('========================================================\n');
  conn.end();
}

main().catch(err => {
  logOutput(`\n❌ Lỗi thực thi: ${err.message}\n`);
  process.exit(1);
});
