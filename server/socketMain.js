const socketMain = (io) => {
  io.on('connection', (socket) => {
    let machineMacA;

    const auth = socket.handshake.auth;
    console.log(auth.token);
    if (auth.token === '209382j4hkl2j34lj234jjj234lk') {
      // valid nodeClient
      socket.join('nodeClient');
    } else if (auth.token === '1412423525325sdfsf') {
      // valid reactClient
      socket.join('reactClient');
    } else {
      socket.disconnect();
      console.log('YOU HAVE BEEN DISONNECTED');
    }

    console.log(`Client connected to worker ${process.pid}`);
    socket.emit('welcome', `Hello from worker ${process.pid}`);

    socket.on('perfData', (data) => {
      console.log('Tick...');
      console.log(data);
      if (!machineMacA) {
        machineMacA = data.macA;
        io.to('reactClient').emit('connectedOrNot', {
          machineMacA,
          isAlive: true,
        });
      }
      io.to('reactClient').emit('perfData', data);
    });

    socket.on('testConnection', (data) => {
      console.log(data);
    });

    socket.on('secondTest', (data) => {
      console.log(data);
    });

    socket.on('disconnect', (reason) => {
      // a nodeClient just disconnected. Let the front end know!
      io.to('reactClient').emit('connectedOrNot', {
        machineMacA,
        isAlive: false,
      });
    });
  });
};

module.exports = socketMain;
