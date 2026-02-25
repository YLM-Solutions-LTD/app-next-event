@echo off
setlocal

set "ROOT=%~dp0..\..\.."
set "SCRIPT=%ROOT%\docs\skills\simplylog-mini-app-builder\deploy-app.ps1"

if not exist "%SCRIPT%" (
  echo Missing deployment script: %SCRIPT%
  exit /b 1
)

pwsh -File "%SCRIPT%" -AppName next-event
exit /b %ERRORLEVEL%
