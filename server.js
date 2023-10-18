const grpc = require('grpc');
const express = require('express');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

// gRPC setup
const grpcServer = new grpc.Server();
const PROTO_PATH = path.join(__dirname, 'hello.proto'); // Replace with your proto file
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);

grpcServer.addService(protoDescriptor.benchmark.BenchmarkService.service, {
    BenchmarkResponse: (req, callback) => {
        console.log(req.request.size)
      const BenchmarkResponse = {
        objects: [],
      };
      // Generate a large response with objects
      for (let i = 1; i <= req.request.size; i++) {
    BenchmarkResponse.objects.push({
  field1: `Value${i}`,
        field2: `Value${i}`,
        field3: `Value${i}`,
        field4: `Value${i}`,
        field5: `Value${i}`,
        field6: `Value${i}`,
        field7: `Value${i}`,
        field8: `Value${i}`,
        field9: `Value${i}`,
        field10: `Value${i}`,
        field11: `Value${i}`,
        field12: `Value${i}`,
        field13: `Value${i}`,
        field14: `Value${i}`,
        field15: `Value${i}`,
        field16: `Value${i}`,
        field17: `Value${i}`,
        field18: `Value${i}`,
        field19: `Value${i}`,
        field20: `Value${i}`,
        field21: `Value${i}`,
        field22: `Value${i}`,
        field23: `Value${i}`,
        field24: `Value${i}`,
        field25: `Value${i}`,
        field26: `Value${i}`,
        field27: `Value${i}`,
        field28: `Value${i}`,
        field29: `Value${i}`,
        field30: `Value${i}`,
      })};
  
      callback(null, BenchmarkResponse);
    },
  });

const grpcPort = 50051; // gRPC server port
grpcServer.bind(`0.0.0.0:${grpcPort}`, grpc.ServerCredentials.createInsecure());
grpcServer.start();
console.log(`gRPC Server running on port ${grpcPort}`);

// REST setup
const app = express();

app.get('/api/helloworld', (req, res) => {
  // Implement your REST endpoint logic here
  // Example:
  res.json({ message: 'Hello from REST' });
});


app.get('/api/large-response', (req, res) => {
    console.log(+req.query.size)
    const BenchmarkResponse = {
      objects: [],
    };
  
    // Generate a large response with objects, each containing 30 fields
    for (let i = 1; i <= +req.query.size; i++) {
      BenchmarkResponse.objects.push({
        field1: `Value${i}`,
        field2: `Value${i}`,
        field3: `Value${i}`,
        field4: `Value${i}`,
        field5: `Value${i}`,
        field6: `Value${i}`,
        field7: `Value${i}`,
        field8: `Value${i}`,
        field9: `Value${i}`,
        field10: `Value${i}`,
        field11: `Value${i}`,
        field12: `Value${i}`,
        field13: `Value${i}`,
        field14: `Value${i}`,
        field15: `Value${i}`,
        field16: `Value${i}`,
        field17: `Value${i}`,
        field18: `Value${i}`,
        field19: `Value${i}`,
        field20: `Value${i}`,
        field21: `Value${i}`,
        field22: `Value${i}`,
        field23: `Value${i}`,
        field24: `Value${i}`,
        field25: `Value${i}`,
        field26: `Value${i}`,
        field27: `Value${i}`,
        field28: `Value${i}`,
        field29: `Value${i}`,
        field30: `Value${i}`,
      });
    }
    res.json(BenchmarkResponse);
  });
const restPort = 3000; // REST server port
app.listen(restPort, () => {
  console.log(`REST Server running on port ${restPort}`);
});
