const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public')
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);


app.use(express.static(publicPath));

// io.on('connection', function(socket){
//   socket.emit('request', /* */); // emit an event to the socket
//   io.emit('broadcast', /* */); // emit an event to all connected sockets
//   socket.on('reply', function(){ /* */ }); // listen to the event
// });

io.on('connection', (socket) => {
  console.log('New user is connected');

  socket.on('disconnect', () => {
    console.log('User was disconnected');
  })

  // socket.emit('newEmail', {
  //   from: 'user@example.com',
  //   text: 'This is socket email',
  //   createdAt: 1234
  // });

  // socket.on('createEmail', (newEmail) => {
  //   console.log("New email", newEmail);
  // })

  socket.emit('newMessage', {
    from: 'chan',
    text: 'This is first message',
    createdAt: new Date()
  });

  socket.on('createMessage', (message) => {
    console.log('message from client', message)
  })
});

server.listen(port, () => {
  console.log(`server is up on port ${port}`);
});
