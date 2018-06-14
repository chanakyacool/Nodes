const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

var app = express();

hbs.registerPartials(__dirname + '/views/partials');

app.set('view engine', 'hbs');


// middleware custom

app.use((req, res, next) => {
  var now = new Date().toString();
  var log = `${now}: ${req.method} ${req.url}`
  console.log(log);
  fs.appendFile('server.log', log + '\n', (err) => {
    if(err) {
      console.log('Unable to append server.log');
    }
  });
  next();
});

hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear()
});

hbs.registerHelper('screamIt', (message) => {
  return message.toUpperCase();
});

// app.use((req, res, next) => {
//  res.render('maintainence');
// });

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.send('test');
});

app.get('/about', (req, res) => {
  res.render('about.hbs', {
    pageTitle: 'AboutPage'
  });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});