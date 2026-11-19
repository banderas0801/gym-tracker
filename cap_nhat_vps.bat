@echo off
chcp 65001 > nul
title CAP NHAT GYM TRACKER - XOA TRUNG LAP MAN HINH CHAY BO
color 0A
echo ====================================================================
echo   CAP NHAT GYM TRACKER: XOA TRUNG LAP MAN HINH CHAY BO & BUILD
echo ====================================================================
cd /d C:\Users\Admin\gym-tracker

echo.
echo [1/3] Day thay doi len GitHub...
git add .
git commit -m "fix(running): remove duplicate Treadmill manual input banner, prevent pace text truncation on mobile"
git push origin master

echo.
echo [2/3] Dong bo VPS 103.77.209.87 va Build Next.js...
set NODE_PATH=C:\Users\Admin\novelcraft_app\node_modules
node fix_vps.js

echo.
echo ====================================================================
echo   HOAN TAT! KIEM TRA KET QUA TREN WEBSITE: https://gym.makeno.space
echo ====================================================================
pause
