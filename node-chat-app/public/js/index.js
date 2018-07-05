var socket = io();

socket.on('connect', function (){
  console.log('Server is connected');
});


socket.on('disconnect', function() {
  console.log('Server is disconnected');
});

socket.on('newMessage', function(message) {
  console.log('meesage', message);
  var li = $('<li></li>');
  li.text(`${message.from}: ${message.text}`)

  $('#messages').append(li);
})

// socket.emit('createMessage', {
//   from: "Chan",
//   text: 'Hi'
// }, function(message) {
//   console.log('From server', message);
// })

$(document).ready(function(){
  $('#message-form').on('submit', function(e) {
    e.preventDefault();
    socket.emit('createMessage', {
      from: 'User',
      text: $('[name=message]').val()
    }, function(){

    });
  })
})
