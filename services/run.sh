#!/usr/bin/env bash
# cd docker/compose
# docker-compose up &
# cd ../..
cd analysis && npm start & 
cd ../controller && npm start & 
cd ../cleaners && npm start & 
cd ../flagger && npm start & 
cd ../listeners && npm start & 
cd ../wbsocket && npm start & 
cd ../neural-network && python3 receive.py & 
cd .. && docker start compose_web_1 &
