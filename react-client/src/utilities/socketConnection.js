// ***** THIS MODULE RUNS/CONNECTS ONLY 1 TIME

import io from 'socket.io-client';

const options = {
  auth: {
    token: '1412423525325sdfsf',
  },
};

const socket = io('http://localhost:3000', options); // our server is running on port 3000

// socket.on('connect', (data) => {
//   console.log(data);
// });

export default socket;
