@echo off
cd /d %~dp0

:: Fecha
set FECHA=%date%

:: Hora sin segundos
for /f "tokens=1-2 delims=:" %%a in ("%time%") do (
    set HORA=%%a:%%b
)

:: Mensaje con "Actualizado el" y la fecha/hora
set msg=Actualizado el %FECHA% %HORA%

git add .
git commit -m "%msg%"
git push

echo.
echo ==== Cambios subidos correctamente ====
pause
