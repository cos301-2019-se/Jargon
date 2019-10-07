#!/usr/bin/env bash
#
#    Filename: test.sh
#    Author  : Herbert Magaya
#    Type    : Script
#
#       This shell script executes each service's unit test procedure.
##

# start
cd services
status=0

# cleaner service
echo "->    Begin testing cleaner service."
mocha cleaners/test.js --timeout 15000
status=$(( $status + $? ))
echo "->    Done testing cleaner service."

# # controller service
# echo "->    Begin testing controller service."
# mocha controller/test.js --timeout 15000 --exit 
# status=$(( $status + $? ))
# echo "->    Done testing controller service.\n\n"

# flagger service
echo "->    Begin testing flagger service."
mocha flagger/test.js --timeout 15000
status=$(( $status + $? ))
echo "->    Done testing flagger service."

# # listener service
# echo "->    Begin testing listeners service."
# mocha listeners/test.js --timeout 150000
# status=$(( $status + $? ))
# echo "->    Done testing listeners service.\n\n"

# finish
cd ..
exit $status
