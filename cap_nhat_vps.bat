@echo off
chcp 65001 > nul
title CAP NHAT GYM TRACKER - TRON BO GIAO TRINH TUAN 1 DEN 12
color 0A
echo ====================================================================
echo   CAP NHAT GYM TRACKER: TRON BO GIAO TRINH CHAY BO TUAN 1 - 12
echo ====================================================================
cd /d C:\Users\Admin\gym-tracker

echo.
echo [1/3] Day thay doi len GitHub...
git add .
git commit -m "feat(running): complete weeks 1-12 HM training plan, peak 44km, sleep science and 4 injury recovery protocols"
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
