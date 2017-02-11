while true
do
    echo "Restarting in ten seconds..."
    sleep 10
    git pull
    npm start
done