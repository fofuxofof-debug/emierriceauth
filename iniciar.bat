@echo off
chcp 65001 >nul
title Painel de Controle - Smooth Store (Preto e Rosa)

cd /d "%~dp0"

if exist "package.json" goto FOUND
if exist "%~dp0mrcrlq-auth2-main\package.json" goto SUBDIR
goto NOT_FOUND

:SUBDIR
cd /d "%~dp0mrcrlq-auth2-main"
goto FOUND

:NOT_FOUND
echo.
echo ========================================================
echo  [ERRO] Nao foi possivel encontrar o arquivo package.json!
echo  Certifique-se de que o arquivo .bat esta na pasta correta.
echo ========================================================
echo.
pause
exit /b 1

:FOUND
where node >nul 2>&1
if errorlevel 1 goto NO_NODE

if not exist "node_modules" goto INSTALL_DEPS
goto START_SERVER

:NO_NODE
echo.
echo ========================================================
echo  [ERRO] Node.js nao foi encontrado no sistema!
echo  Por favor, faca o download e instale o Node.js em:
echo  https://nodejs.org/
echo ========================================================
echo.
pause
exit /b 1

:INSTALL_DEPS
echo.
echo [INFO] Instalando dependencias com npm install...
echo Aguarde um momento...
echo.
call npm install
if errorlevel 1 (
    echo.
    echo [ERRO] Ocorreu uma falha ao instalar as dependencias.
    pause
    exit /b 1
)

:START_SERVER
echo.
echo =====================================================================
echo   Iniciando Painel de Controle - Smooth Store (Preto e Rosa)
echo   URL: http://localhost:3000
echo.
echo   Credenciais de Acesso:
echo   1. Administrador (Acesso Total):
echo      - Usuario: mrcrlq
echo      - Senha:   1964f
echo.
echo   2. Moderador (Keys, Logs, Parar/Status):
echo      - Usuario: SamucaX
echo      - Senha:   Bebela
echo.
echo   Pressione Ctrl + C para encerrar o servidor.
echo =====================================================================
echo.

start "" cmd /c "timeout /t 2 /nobreak >nul & start http://localhost:3000"

call npm run dev

pause
