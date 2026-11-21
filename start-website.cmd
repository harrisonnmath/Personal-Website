@echo off
cd /d "%~dp0"
echo Website: http://127.0.0.1:3000
echo Editor:  http://127.0.0.1:3000/editor.html
echo Keep this window open while editing. Press Ctrl+C to stop.
node scripts/serve.mjs
if errorlevel 1 pause
