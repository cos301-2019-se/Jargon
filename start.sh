#!/bin/sh
cd services/contoller/
node server.js &
cd ../listeners/
node server.js &
cd ../neural-network/
python3 server.py &
