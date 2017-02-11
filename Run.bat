:start

echo Restarting in ten seconds...

ping -n 10 127.0.0.1 > nul

echo 'Pulling fresh code'

git pull

echo 'Running npm start'

call npm start

goto start