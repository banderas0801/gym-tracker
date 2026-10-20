@echo off
chcp 65001 > nul
title CAP NHAT PHAN HE CHAY BO - ANH MINH HOA DONG TAC BO TRO RUNNER
color 0A
echo ========================================================
echo   CAP NHAT GYM TRACKER: ANH MINH HOA DONG TAC BO TRO
echo ========================================================
cd /d C:\Users\Admin\gym-tracker

echo.
echo [1/3] Day thay doi len GitHub...
git add .
git commit -m "feat: tich hop anh minh hoa tu the 1 va tu the 2 cho toan bo bai tap bo tro runner"
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
