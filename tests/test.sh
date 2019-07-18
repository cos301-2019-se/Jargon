cd services
status = 0
mocha controller/test.js --exit && status += $?
mocha listeners/test.js --exit && status += $?
mocha cleaners/test.js --exit && status += $?
cd ..
exit $status
