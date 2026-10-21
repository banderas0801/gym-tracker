@echo off
chcp 65001 > nul
title CAP NHAT GYM TRACKER - TOI UU LAYOUT MOBILE & FIX ZOOM CACHE
color 0A
echo ========================================================
echo   CAP NHAT GYM TRACKER: TOI UU TOAN DIEN LAYOUT MOBILE
echo ========================================================
cd /d C:\Users\Admin\gym-tracker

echo.
echo [1/3] Day thay doi len GitHub...
git add .
git commit -m "fix(ui): overhaul mobile layout, eliminate layout-breaking zoom, and refresh sw cache"
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
