@echo off
title FilmTV TikTok Server
cd /d "%~dp0"

echo =======================================================
echo         Iniciando FilmTV TikTok Clone Local
echo =======================================================
echo.

:: Verificar si el servidor ya esta corriendo
netstat -ano | findstr ":3000" >nul
if %errorlevel% equ 0 (
    echo El servidor local ya esta activo en el puerto 3000.
) else (
    echo Iniciando servidor local en segundo plano...
    start /min "FilmTV Server (Cerrar para detener)" node server.js
    timeout /t 2 /nobreak >nul
)

echo Abriendo en tu navegador...
start http://localhost:3000

echo.
echo Listo! Disfruta de FilmTV TikTok con reproduccion fluida.
echo (Puedes minimizar esta ventana)
timeout /t 3 /nobreak >nul
exit
