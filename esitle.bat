@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo 📦 Değişiklikler ekleniyor...
git add -A

echo 💬 Commit mesajı giriliyor...
set /p msg="Commit mesajı (boş bırakırsan 'Güncelleme' yazılır): "
if "%msg%"=="" set msg=Güncelleme

git commit -m "%msg%"

echo 🚀 GitHub'a gönderiliyor...
git push origin main

echo.
echo ✅ Tamamlandı!
pause
