cd services
mocha services/controller/test.js --exit
mocha services/listeners/test.js --exit
mocha services/cleaners/test.js --exit
cd ..
exit 0
