var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
// var expressValidator = require('express-validator');
const { check, validationResult } = require('express-validator/check');
var mongojs = require('mongojs');
var objectId = mongojs.ObjectId;
var mongodb = require('mongodb');
var db = mongojs('customerapp', ['users']);


var app = express();

/*
// Custom Middleware
var logger = (req, res, next) => {
  console.log('Loggging....');
  next();
}

// user of custom middleware, order is important
app.use(logger);
*/

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Set Static Path
app.use(express.static(path.join(__dirname, 'public')))

app.get('/',(req, res) => {

  db.users.find((err, docs) => {
    res.render('index', {
      title: "Customers",
      users: docs
    });
  })
});


app.post('/users/add', [
  // check email
  check('first_name').isLength({ min: 3 }),
  check('last_name').isLength({ min: 3 }),
  check('email').isEmail()
  ], (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(422).json(
      { 
        errors: errors.array()
      }
    );
  }

  var newUser = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email   
  }
  db.users.insert(newUser, (err, result) => {
    if(err){
      return res.status(422).json(
        { 
          errors: err
        }
      );
    }
    res.redirect('/');
  });
});


app.delete('/users/delete/:id', (req, res) => {
  db.users.remove({_id: objectId(req.params.id)}, (err, result) => {
    if(err){
      console.log(err);
    }
    res.redirect('/');
  });
});
app.listen(3000, () => {
  console.log('Server started on port 3000')
});