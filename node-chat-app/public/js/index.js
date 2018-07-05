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

socket.on('newLocationMessage', function(message) {
  var li = $('<li></li>');
  var a = $('<a target="_blank"> My Current Location</a>');

  li.text(`${message.from}: `);
  a.attr('href', message.url);
  li.append(a);
  $('#messages').append(li);
});

$(document).ready(function(){
  $('#message-form').on('submit', function(e) {
    e.preventDefault();
    socket.emit('createMessage', {
      from: 'User',
      text: $('[name=message]').val()
    }, function(){

    });
  });

  var locationButton = $('#send-location');
  locationButton.on('click', function(e){
    e.preventDefault();
    if(!navigator.geolocation) {
      return alert('Update your browser, Geo location not supported by your browser');
    }

    navigator.geolocation.getCurrentPosition(function(position) {
      console.log('Position', position);
      socket.emit('createLocationMessage', {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      })
    }, function(){
      alert('Unable to fetch the location')
    });
  })
})
