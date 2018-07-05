const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');

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

  socket.on('join', (params, callback) => {
    if(!isRealString(params.name) || !isRealString(params.room)){
      callback('Name and Room name are required');
    }

    socket.join(params.room);
    // socket.leave(params.room);


    // io.to('roomname').emit -> send to every one to the room
    // io.emit -> emits to every single connected user
    // socket.broadcast.emit
    // socket.broadcast.to('room').emit -> every body to room expcept the current user
    // socket.emit

    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));

    socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined`));

    callback();
  })

  socket.on('createMessage', (message, callback) => {
    console.log('new from client', message)
    // Socket emits to single connection
    // io emits to every connection
  
    io.emit('newMessage', generateMessage(message.from, message.text))
    callback();
  })

  socket.on('createLocationMessage', (coords) => {
    // io.emit('newMessage', generateMessage('Admin', `${coords.latitude}, ${coords.longitude}`));
    io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude))
  })
});

server.listen(port, () => {
  console.log(`server is up on port ${port}`);
});
