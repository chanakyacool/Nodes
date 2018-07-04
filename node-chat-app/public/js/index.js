var socket = io();

socket.on('connect', function (){
  console.log('Server is connected');
});


socket.on('disconnect', function() {
  console.log('Server is disconnected');
});

socket.on('newMessage', function(message) {
  console.log('meesage', message);
})