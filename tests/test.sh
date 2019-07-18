#! /bin/sh
# This shell script executes each services unit test procedure.

cd services
status=0

# controller service
mocha controller/test.js --exit 
status+=$?

# flagger service
mocha flagger/test.js --timeout 15000
status+=$?

#mocha listeners/test.js --exit && status +=$(( $? ))
#mocha cleaners/test.js --exit && status +=$(( $? ))

cd ..
exit $status
