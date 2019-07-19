#! /bin/sh
# to be used on travis-ci

# install node modules
cd services
npm install -g mocha
npm install chai chai-http chai-arrays
cd ..
# install hidden files
cd ../services/listeners/db
wget --no-check-certificate "$DBCONFIGLINK" -O dbconfig.js
cd ../platforms
wget --no-check-certificate "$TWITTERLISTENERLINK" -O twitterConfig
cd ../../controller/db
wget --no-check-certificate "$DBCONFIGLINK" -O dbconfig.js
cd ../../flagger/db
wget --no-check-certificate "$DBCONFIGLINK" -O dbconfig.js
# go back to test dir
cd ../../../tests
