@echo off
rmdir /q /s wwwroot
mkdir wwwroot
xcopy dist\setup\*.blockmap wwwroot
xcopy dist\setup\*.yml wwwroot
xcopy dist\setup\*.exe wwwroot
