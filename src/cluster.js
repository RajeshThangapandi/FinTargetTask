const cluster = require('cluster');
const os = require('os');
const numCPUs = os.cpus().length;
const app = require('./index'); 

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
  });
} else {
  const PORT = process.env.PORT || 3002;
  const server = app.listen(PORT, () => {
    console.log(`Worker ${process.pid} started on port ${PORT}`);
  });

  server.on('error', (err) => {
    console.error('Server error:', err);
  });
}
