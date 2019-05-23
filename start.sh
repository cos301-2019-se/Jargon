#!/bin/sh
cd backend/services/neural-network/
python server.py &
cd ../api/
ng serve &
cd ../listeners/
node server.js
