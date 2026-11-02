@echo off
chcp 65001 > nul
title CAP NHAT GYM TRACKER - FIX PRERENDER & DONG BO VPS
color 0A
echo ========================================================
echo   CAP NHAT GYM TRACKER: FIX PRERENDER & DONG BO VPS
echo ========================================================
cd /d C:\Users\Admin\gym-tracker

echo.
echo [1/3] Day thay doi len GitHub...
git add .
git commit -m "fix: defer HomeDashboardOverview calculations to useEffect to resolve Next.js 16 prerender error"
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
