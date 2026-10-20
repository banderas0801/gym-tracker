@echo off
chcp 65001 > nul
title CAP NHAT GYM TRACKER LEN VPS (FIX 502)
color 0A
echo ========================================================
echo   CAP NHAT GYM TRACKER LEN VPS & KHAC PHUC LOI 502
echo ========================================================
cd /d C:\Users\Admin\gym-tracker

echo.
echo [1/3] Day tat ca thay doi len GitHub...
git add .
git commit -m "fix: sync running types and update vps build"
git push origin master

echo.
echo [2/3] Ket noi truc tiep VPS 103.77.209.87 va Build Next.js...
set NODE_PATH=C:\Users\Admin\novelcraft_app\node_modules
node fix_vps.js

echo.
echo ========================================================
echo   HOAN TAT! KIEM TRA KET QUA BEN TREN
echo ========================================================
pause
