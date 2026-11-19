@echo off
chcp 65001 > nul
title CAP NHAT GYM TRACKER - DON DEP LAYOUT & BANG TRA PACE 5KM
color 0A
echo ====================================================================
echo   CAP NHAT GYM TRACKER: DON DEP TRUNG LAP LAYOUT & TRA PACE 5KM
echo ====================================================================
cd /d C:\Users\Admin\gym-tracker

echo.
echo [1/3] Day thay doi len GitHub...
git add .
git commit -m "feat(ui): deduplicate back buttons & banners, clean expanded run cards, add interactive 5KM Race Pace Chart"
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
