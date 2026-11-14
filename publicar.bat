@echo off
rem Publica la web: sube los commits a GitHub (deploy automatico en ~40 s) y avisa a los buscadores (IndexNow).
rem Doble clic. No hace commit: eso lo deja hecho Claude.
cd /d "%~dp0"
echo Subiendo cambios a GitHub...
git push origin main
if errorlevel 1 (
  echo.
  echo ERROR: no se ha podido subir. Avisa a Claude con este mensaje.
  pause
  exit /b 1
)
echo.
echo Esperando 60 s a que termine el deploy...
timeout /t 60 /nobreak >nul
echo Avisando a los buscadores (IndexNow)...
node scripts\indexnow.mjs
echo.
echo Listo. Comprueba el tic verde en https://github.com/Mishuko-WoW/Guia-BM-Hunter/actions
pause
