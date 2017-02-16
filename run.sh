while true
do
    git pull
    tsc -p ./
    npm start
    
    echo "Restarting in ten seconds..."
    sleep 10
done