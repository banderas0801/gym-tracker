const { Client } = require('ssh2');

const SSH_CONFIG = {
  host: '103.77.209.87',
  port: 22,
  username: 'root',
  password: 'b!Wer2V*gXdGqJQ',
  readyTimeout: 30000
};

function runSSH(conn, cmd) {
  return new Promise((resolve, reject) => {
    console.log(`\n>>> [VPS] ${cmd}`);
    conn.exec(cmd, (err, stream) => {
      if (err) return reject(err);
      let stdout = '';
      let stderr = '';
      stream.on('close', (code) => {
        resolve({ stdout, stderr, code });
      }).on('data', (data) => {
        process.stdout.write(data);
        stdout += data;
      }).stderr.on('data', (data) => {
        process.stderr.write(data);
        stderr += data;
      });
    });
  });
}

async function main() {
  console.log('Đang kết nối máy chủ VPS 103.77.209.87...');
  const conn = new Client();
  await new Promise((resolve, reject) => {
    conn.on('ready', resolve);
    conn.on('error', reject);
    conn.connect(SSH_CONFIG);
  });
  console.log('✅ Đã kết nối VPS thành công!');

  console.log('\n--- BƯỚC 1: Kéo code mới nhất từ GitHub ---');
  await runSSH(conn, 'cd /var/www/gym-tracker && git pull origin master');

  console.log('\n--- BƯỚC 2: Build bản production Next.js mới ---');
  await runSSH(conn, 'cd /var/www/gym-tracker && npm run build');

  console.log('\n--- BƯỚC 3: Khởi động lại ứng dụng PM2 ---');
  await runSSH(conn, 'pm2 restart gym-tracker');

  console.log('\n========================================================');
  console.log('🎉 ĐÃ CẬP NHẬT TRANG ONLINE THÀNH CÔNG RỰC RỠ!');
  console.log('👉 Truy cập: https://gym.makeno.space');
  console.log('========================================================');
  conn.end();
}

main().catch(err => {
  console.error('\n❌ Lỗi deploy:', err);
  process.exit(1);
});
