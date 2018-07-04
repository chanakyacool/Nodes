var socket = io();

socket.on('connect', function (){
  console.log('Server is connected');
  // socket.emit('createEmail', {
  //   to: 'test@exmaple.com',
  //   text: 'This is fromt he cloent side'
  // })

  socket.emit('createMessage', {
    from: 'nuick',
    text: 'This is first message from the client'
  })
  
});


socket.on('disconnect', function() {
  console.log('Server is disconnected');
});

// socket.on('newEmail', function(email) {
//   console.log('New Email');
//   console.log(email);
// });

socket.on('newMessage', function(message) {
  console.log('meesage', message);
})