/* global require, console, process */

const prompt = require('prompt');
const optimist = require('optimist');
const path = require('path');
const async = require('async');
const newman = require('newman');

const properties = [
  {
    name: 'concurrency',
    description: 'Concurrent running collection for',
    type: 'number',
    default: 1,
    message: 'Concurrency count should be a number'
  },
  {
    name: 'iterationCount',
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
  },
  {
    name: 'exportReport',
    type: 'string',
    description: 'Export the report in format of (html/json/cli)',
    default: 'cli',
    message: 'Report should be only type of html/json/cli'
  }
];

prompt.override = optimist.argv

prompt.start({ noHandleSIGINT: true });

prompt.get(properties, function (err, result) {
  if (err) { return onErr(err); }

  runTests(result)
});

process.on('SIGINT', function() {
  console.log("Thank you for showing interest.");
  process.exit();
});

function onErr(err) {
  console.log(err);
  return 1;
}

function runTests({ concurrency, iterationCount, delayRequest, exportReport }) {
  const options = {
    collection: path.join(__dirname, 'collection.json'),
    iterationCount,
    delayRequest,
    environment: path.join(__dirname, 'environment.json'),
    reporters: exportReport,
    reporter: {
      json: {
        export: path.join(__dirname, '../reports/index.json')
      },
      html: {
        export: path.join(__dirname, '../reports/index.html')
      }
    }
  }
  const parallelCollectionRun = function (done) {
    newman.run(options, done);
  }
  const parallelCollections = []

  for(let i = 0; i < concurrency ; i++) {
    parallelCollections.push(parallelCollectionRun)
  }

  console.log("\n")
  console.info(`Running ${concurrency} test with ${iterationCount} times & with a delay of ${delayRequest}`);

  async.parallel(parallelCollections, function (err, results) {
    err && console.error(err);

    results.forEach(function (result, index) {
      var failures = result.run.failures;
      console.info(failures.length ? JSON.stringify(failures.failures, null, 2) : `    ${index} - ${result.collection.name} ran successfully.`);
    });
  });
}
