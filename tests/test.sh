#! /bin/sh
# This shell script executes each services unit test procedure.

cd services
status=0

# cleaner service
mocha cleaners/test.js --timeout 15000
#status+=$?

# controller service
mocha controller/test.js --exit 
#status+=$?

# flagger service
mocha flagger/test.js --timeout 15000
#status+=$?

# listener service
mocha listeners/test.js --timeout 150000
#status+=$?

#mocha listeners/test.js --exit && status +=$(( $? ))
#mocha cleaners/test.js --exit && status +=$(( $? ))

cd ..
exit $status
