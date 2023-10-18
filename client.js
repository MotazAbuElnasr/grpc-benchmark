const grpc = require('grpc');
const path = require('path');
const request = require('request');
const stats = require('fast-stats').Stats;
const util = require('util');

// gRPC setup
const PROTO_PATH = path.join(__dirname, 'hello.proto'); // Replace with your proto file
const packageDefinition = grpc.load(PROTO_PATH);
const client = new packageDefinition.benchmark.BenchmarkService('localhost:50051', grpc.credentials.createInsecure());
const responseArraySize = 50
const numRequests = 15

// REST endpoint URL
const restUrl = 'http://localhost:3000/api/large-response?size='+responseArraySize;

// Make gRPC requests and REST requests 1000 times
const grpcTimings = new stats();
const restTimings = new stats();

// Define separate functions to measure request time for gRPC and REST
function measureGrpcTime(requestFunction, timingsArray) {
  return new Promise((resolve, reject) => {
    const start = process.hrtime();
    requestFunction((error, response) => {
      if (error) {
        reject(error);
      } else {
        const end = process.hrtime(start);
        const elapsed = end[0] * 1000 + end[1] / 1e6; // Convert to milliseconds
        timingsArray.push(elapsed);
        resolve(response);
      }
    });
  });
}

function measureRestTime(requestFunction, timingsArray) {
  return new Promise((resolve, reject) => {
    const start = process.hrtime();
    requestFunction((error, response, body) => {
      if (error) {
        reject(error);
      } else {
        const end = process.hrtime(start);
        const elapsed = end[0] * 1000 + end[1] / 1e6; // Convert to milliseconds
        timingsArray.push(elapsed);
        resolve(body);
      }
    });
  });
}


// // Make gRPC requests and capture timings
const grpcRequests = Array.from({ length: numRequests }, (_, i) => i);
async function main () {
console.log("start gRPC test")
  await (async () => {
  await Promise.all(grpcRequests.map(async (i) => {
  return  measureGrpcTime(
        (callback) => client.BenchmarkResponse({size:responseArraySize}, callback),
        grpcTimings
      );
  }))

  // Calculate and display gRPC statistics
  console.log(`gRPC Average Time: ${grpcTimings.amean().toFixed(2)} ms`);
  console.log(`gRPC Median Time: ${grpcTimings.median().toFixed(2)} ms`);
  console.log(`gRPC 50th Percentile: ${grpcTimings.percentile(50).toFixed(2)} ms`);
  console.log(`gRPC 90th Percentile: ${grpcTimings.percentile(90).toFixed(2)} ms`);
  console.log(`gRPC 95th Percentile: ${grpcTimings.percentile(95).toFixed(2)} ms`);
  console.log(`gRPC 99th Percentile: ${grpcTimings.percentile(99).toFixed(2)} ms`);
})();
console.log("............")
console.log("start REST test")

// Make REST requests and capture timings
const restRequests = Array.from({ length: numRequests }, (_, i) => i);

await (async () => {
 const res =  await Promise.all(restRequests.map(async (i) => {
  return  measureRestTime(
        (callback) => request.get(restUrl, (error, response, body) => {
          if (error) {
            callback(error);
          } else {
            callback(null, response, body);
          }
        }),
        restTimings
      );
  }))

  // Calculate and display REST statistics
  console.log(`REST Average Time: ${restTimings.amean().toFixed(2)} ms`);
  console.log(`REST Median Time: ${restTimings.median().toFixed(2)} ms`);
  console.log(`REST 50th Percentile: ${restTimings.percentile(50).toFixed(2)} ms`);
  console.log(`REST 90th Percentile: ${restTimings.percentile(90).toFixed(2)} ms`);
  console.log(`REST 95th Percentile: ${restTimings.percentile(95).toFixed(2)} ms`);
  console.log(`REST 99th Percentile: ${restTimings.percentile(99).toFixed(2)} ms`);
})();
}

main()