@echo off
cd /d %~dp0

if exist api-financeira (
    echo Iniciando api-financeira...
    start cmd /k "cd api-financeira && npm start"
)

if exist frontend (
    echo Iniciando frontend...
    start cmd /k "cd frontend && npm start"
)

echo O Site foi iniciado
pause

