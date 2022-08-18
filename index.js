process.env.UV_THREADPOOL_SIZE = 1;
const cluster = require('cluster');
const crypto = require('crypto');

const numCore = process.env.NUMBER_OF_PROCESSORS;
console.log(cluster.isMaster, cluster.isWorker, numCore);

// if (cluster.isMaster) {
//   // Cause index.js to be executed Again but
//   // in Child mode
//   for (let i = 0; i < numCore; i++) {
//     cluster.fork();
//   };
// } else {
// Im a child, I'm going to act like a server and do nothing else.
// }

const Worker = require('webworker-threads').Worker;


const express = require('express');
const app = express();

function doWork(duration) {
  const start = Date.now();
  // setTimeout는 블로킹이 아님
  while (Date.now() - start < duration) {
    // empty space
  }
}

app.get('/', (req, res) => {
  crypto.pbkdf2('a', 'b', 100000, 512, 'sha512', () => {
    res.send('Hi there!');
  });
  // doWork(5000);
});

app.get('/worker', (req, res) => {
  // const a = 1;
  const worker = new Worker(function () {
    // console.log(a);   // 접근 불가임. 워커를 따로 분리해내서 스코프가 다름
    this.onmessage = function () {
      let counter = 0;
      while (counter < 1e9) {
        counter++;
      };

      // do Work for something, invoked by worker.postMessage();
      postMessage(counter);
    }

  });

  worker.onmessage = function (message) {
    console.log(message);
    res.send('' + message.data);
  };

  worker.postMessage();
});

app.get('/fast', (req, res) => {
  res.send('This was fast!');
})

app.listen(3000, () => {
  console.log('port ont 3000');
});

