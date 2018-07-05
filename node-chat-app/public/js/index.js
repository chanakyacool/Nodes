var socket = io();

socket.on('connect', function (){
  console.log('Server is connected');
});


socket.on('disconnect', function() {
  console.log('Server is disconnected');
});

socket.on('newMessage', function(message) {
  console.log('meesage', message);
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var li = $('<li></li>');
  li.text(`${message.from} ${formattedTime}: ${message.text}`)

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
  var formattedTime = moment(message.createdAt).format('h:mm a');

  li.text(`${message.from} ${formattedTime}: `);
  a.attr('href', message.url);
  li.append(a);
  $('#messages').append(li);
});

$(document).ready(function(){
  $('#message-form').on('submit', function(e) {
    e.preventDefault();

    var messageTextBox =  $('[name=message]')
    socket.emit('createMessage', {
      from: 'User',
      text: messageTextBox.val()
    }, function(){
      // clear the value after the message
      messageTextBox.val('');
    });
  });

  var locationButton = $('#send-location');
  locationButton.on('click', function(e){
    e.preventDefault();
    if(!navigator.geolocation) {
      return alert('Update your browser, Geo location not supported by your browser');
    }
    locationButton.attr('disabled', 'disabled').text('Sending Location....');

    navigator.geolocation.getCurrentPosition(function(position) {
      locationButton.removeAttr('disabled').text('Send Location');
      console.log('Position', position);
      socket.emit('createLocationMessage', {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });
    }, function(){
      alert('Unable to fetch the location');
      locationButton.removeAttr('disabled').text('Send Location');
    });
  })
})
