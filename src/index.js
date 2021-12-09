/* global require, console */

const prompt = require('prompt');
const { exec } = require('child_process');

const properties = [
  {
    name: 'iterations',
    description: 'Number of iteration you want to run collection for',
    type: 'number',
    default: 1,
    message: 'Iteration count should be a number'
  },
  {
    name: 'delayRequest',
    type: 'number',
    description: 'Delay between each request in milliseconds',
    default: 10,
    message: 'Delay bewteen each request should be a number in milliseconds'
  }
];

prompt.start();

prompt.get(properties, function (err, result) {
  if (err) { return onErr(err); }
  console.log("\n")
  console.log(`Running test with ${result.iterations} times & with a delay of ${result.delayRequest}`);

  exec(`yarn test -n ${result.iterations} --delay-request ${result.delayRequest}`, (error, stdout) => {
    if (error) {
      console.error(error)
    }
    console.log(stdout)
  })
});

function onErr(err) {
  console.log(err);
  return 1;
}
