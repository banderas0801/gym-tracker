@echo off
chcp 65001 > nul
title CAP NHAT GYM TRACKER - TICH HOP 5 VUNG NHIP TIM (HEART RATE ZONES 21K)
color 0A
echo ========================================================
echo   CAP NHAT GYM TRACKER: TICH HOP NHIP TIM & 5 ZONE 21K
echo ========================================================
cd /d C:\Users\Admin\gym-tracker

echo.
echo [1/3] Day thay doi len GitHub...
git add .
git commit -m "feat(running): integrate 5 heart rate zones, Tanaka max HR calculator, and HR recovery test"
git push origin master

echo.
echo [2/3] Dong bo VPS 103.77.209.87 va Build Next.js...
set NODE_PATH=C:\Users\Admin\novelcraft_app\node_modules
node fix_vps.js

echo.
echo ========================================================
echo   HOAN TAT! XEM KET QUA PHAN HOI BEN TREN
echo ========================================================
pause