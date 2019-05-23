#!/bin/sh
cd backend/
node server.js &
cd services/listeners/
node server.js &
cd ../neural-network/
python3 server.py &
cd ../api/
ng serve