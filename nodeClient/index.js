// The node program that captures local performane data and sends it via socket to the server
// Req
// - farmhash
// - socket.io-client

const os = require('os'); // native to node
const io = require('socket.io-client');
const options = {
  auth: {
    token: '209382j4hkl2j34lj234jjj234lk',
  },
};

const socket = io('http://127.0.0.1:3000', options); // server is running at 3000

socket.on('connect', () => {
  // console.log("We connected to the server")
  // we need a way to identify this machine to the server, for front end useage
  // we could use, socket.id, randomHash, ipAddress, mac
  const nI = os.networkInterfaces();
  let macA;
  // loop through all nI until we find a non-internal one.
  for (let key in nI) {
    const isInternetFacing = !nI[key][0].internal;
    if (isInternetFacing) {
      // we have a macA we can use!
      macA = nI[key][0].mac;
      break;
    }
  }
  const perfDataInterval = setInterval(async () => {
    // every second call performance data and emit
    const perfData = await performanceLoadData();
    perfData.macA = macA;
    socket.emit('perfData', perfData);
  }, 1000);

  socket.on('disconnect', () => {
    clearInterval(perfDataInterval);
    //this includes!!! reconnect
  });
});

const cpuAverage = () => {
  const cpus = os.cpus();

  // cpu is an array of all cores. We need the average of all the cores which will give us the cpu average.
  let idleMs = 0; // idle milliseconds
  let totalMs = 0; // total milliseconds
  // loop through each core (thread)
  cpus.forEach((aCore) => {
    // loop through each property of the current core
    for (mode in aCore.times) {
      // we need all modes for this core added to totalMs
      totalMs += aCore.times[mode];
    }
    // we need idle mode for this core added to idleMs
    idleMs += aCore.times.idle;
  });
  return {
    idle: idleMs / cpus.length,
    total: totalMs / cpus.length,
  };
};

const getCpuLoad = () =>
  new Promise((resolve, reject) => {
    const start = cpuAverage();
    setTimeout(() => {
      const end = cpuAverage();
      const idleDiff = end.idle - start.idle;
      const totalDiff = end.total - start.total;
      // console.log(idleDiff, totalDiff);
      // calculate the % of the used cpu
      const percentageCpu = 100 - Math.floor((100 * idleDiff) / totalDiff);
      //   console.log(`CPU Load: ${percentageCpu} %`);
      resolve(percentageCpu);
    }, 100);
  });

// What do we need to know FROM NODE about performance?
// - CPU load (current)
// - Memory usage
// - total memory
// - free memory
// - used memory
// - OS type
// - uptime
// - CPU info
// - Type
// - Number of cores
// - Clock Speed
const performanceLoadData = () =>
  new Promise(async (resolve, reject) => {
    const totalMem = os.totalmem(); // in bytes
    const freeMem = os.freemem(); // in bytes
    const usedMem = totalMem - freeMem; // in bytes
    const memUsage = Math.floor((usedMem / totalMem) * 100); // in percentage
    const osType = os.type() === 'Linux' ? 'Ubuntu' : os.type();
    const upTime = os.uptime();
    const cpus = os.cpus();
    const cpuType = cpus[0].model;
    const numCores = cpus.length;
    const cpuSpeed = cpus[0].speed;
    const cpuLoad = await getCpuLoad();
    resolve({
      freeMem,
      usedMem,
      totalMem,
      memUsage,
      osType,
      upTime,
      cpuType,
      numCores,
      cpuSpeed,
      cpuLoad,
    });
  });

// const run = async () => {
//   const data = await performanceLoadData();
//   console.log(data);
// };
// run();
