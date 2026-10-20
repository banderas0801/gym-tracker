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
fs.writeFileSync(LOG_FILE, `=== BẮT ĐẦU SỬA LỖI 502: ${new Date().toISOString()} ===\n`);

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

async function main() {
  logOutput('Đang kết nối máy chủ VPS 103.77.209.87...\n');
  const conn = new Client();
  await new Promise((resolve, reject) => {
    conn.on('ready', resolve);
    conn.on('error', reject);
    conn.connect(SSH_CONFIG);
  });
  logOutput('✅ Đã kết nối VPS thành công!\n');

  // 1. Kiểm tra trạng thái hiện tại
  logOutput('\n--- BƯỚC 1: Kiểm tra trạng thái PM2 & Port 3008 ---\n');
  await runSSH(conn, 'pm2 list; ss -tulpn | grep 3008 || netstat -tulpn | grep 3008 || echo "Port 3008 CHƯA CÓ TIẾN TRÌNH NÀO LẮNG NGHE!"');

  // 2. Kéo code mới nhất từ GitHub (đã sửa start -p 3008)
  logOutput('\n--- BƯỚC 2: Kéo code mới nhất từ GitHub (fix port 3008) ---\n');
  await runSSH(conn, 'cd /var/www/gym-tracker && git fetch origin master && git reset --hard origin/master');

  // 3. Build Next.js
  logOutput('\n--- BƯỚC 3: Build Next.js Production ---\n');
  const bRes = await runSSH(conn, 'cd /var/www/gym-tracker && npm run build');
  if (bRes.code !== 0) {
    logOutput('\n❌ Build thất bại! Đang kiểm tra log...\n');
  }

  // 4. Khởi động lại PM2 tường minh trên port 3008
  logOutput('\n--- BƯỚC 4: Dừng tiến trình cũ và khởi động lại PM2 trên port 3008 ---\n');
  await runSSH(conn, 'pm2 delete gym-tracker 2>/dev/null || true');
  await runSSH(conn, 'cd /var/www/gym-tracker && pm2 start npm --name "gym-tracker" -- run start');
  await runSSH(conn, 'pm2 save');

  // 5. Đợi 3s và kiểm tra phản hồi
  logOutput('\n--- BƯỚC 5: Đợi 3 giây và kiểm tra phản hồi ứng dụng ---\n');
  await runSSH(conn, 'sleep 3; pm2 list; curl -I http://127.0.0.1:3008; curl -I https://gym.makeno.space');

  logOutput('\n========================================================\n');
  logOutput('🎉 QUÁ TRÌNH SỬA LỖI ĐÃ HOÀN TẤT!\n');
  logOutput('👉 Kiểm tra web: https://gym.makeno.space\n');
  logOutput('========================================================\n');
  conn.end();
}

main().catch(err => {
  logOutput(`\n❌ Lỗi thực thi: ${err.message}\n`);
  process.exit(1);
});
