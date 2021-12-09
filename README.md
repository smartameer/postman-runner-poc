# Postman Collection CLI Runner POC

> This uses `json-server` & `faker` to create a poc server.
> It uses `newman` to test postman collection using cli. Load test is done using `async`

### Install
    yarn install

### Start Server
    yarn start

### Test while Server running
    yarn test

### Load test
    yarn load-test  // interactive

    yarn load-test --concurrency 10 --iterationCount 10 --delayRequest 10 --exportReport json // non interactive
