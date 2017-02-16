while true
do
    echo "Restarting in ten seconds..."
    sleep 10
    git pull
    tsc -p ./
    npm start
done