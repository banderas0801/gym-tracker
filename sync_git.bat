@echo off
chcp 65001 > nul
echo ========================================================
echo   DONG BO GYM TRACKER LEN GITHUB VA MAY CHU ONLINE
echo ========================================================
cd /d C:\Users\Admin\gym-tracker

echo.
echo [1/3] Dang them cac file thay doi (Running module, clean body data)...
git add .

echo.
echo [2/3] Dang commit...
git commit -m "feat: tich hop phan he chay bo, giao an HM, VDOT, cẩm nang 6 chuong, Mibro va don sach data mau"

echo.
echo [3/3] Dang day code len GitHub (origin master)...
git push origin master

echo.
echo ========================================================
echo   DA DAY CODE LEN GITHUB THANH CONG!
echo ========================================================
pause
