# to be used of travis-ci

# install node modules
npm install -g mocha
npm install chai chai-http chai-arrays
# install hidden files
cd ../services/listeners/db
wget --no-check-certificate "$DBCONFIGLINK" -O dbconfig.js
ls
cd ../platforms
wget --no-check-certificate "$TWITTERLISTENERLINK" -O twitterListener.js
cd ../../controller/db
ls
wget --no-check-certificate "$DBCONFIGLINK" -O dbconfig.js
cd ../../../tests
ls