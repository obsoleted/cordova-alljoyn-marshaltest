cordova-alljoyn-marshaltest
===========================

A Cordova app used to validate the marshaling implementation in the [Cordova AllJoyn plugin](https://github.com/stefangordon/cordova-plugin-alljoyn). 

This app is currently being built to work against the [alljoyn-testing service](https://github.com/phongcao/alljoyn-testing-service).

In its current form the application lists a few different types that the app should either be able to marshal or unmarshal (via a method invocation). The app displays each type and corresponding test status in a row with 3 blocks. The first is the type string, the second is the status of the Get test, and the third is the status of the Set test. Currently only Get tests are wired up. When successful the state should turn to green and the result of the call should be displayed in the output below the test list.


## Current State
- App is still under development
- Current version connects to Bus, finds test service and joins a session on startup
- Some minimal type gets are supported. 
- Very little error handling currently
- It is a rough design but should work for now

## Next Steps
- Error checking/reporting
- Determine a default type set that gets good coverage
- Implement Sets for each type
- Provide an automated test types all mode
- Ad-hoc mode to test non-preset types
