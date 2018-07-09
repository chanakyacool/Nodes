 require('./config/config.js');

const _ = require('lodash');

const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');
const {authenticate} = require('./middleware/authenticate');

const app = express();

const port = process.env.PORT

app.use(bodyParser.json());

app.post('/todos', authenticate, (req, res) => {
  var todo = new Todo({
    text: req.body.text,
    _creator: req.user._id
  });

  todo.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

app.get('/todos', authenticate, (req, res) => {
  Todo.find({
    _creator: req.user._id
  }).then((todos) => {
    res.send({todos});
  },(e) => {
    res.status(400).send(e);
  });
});

app.get('/todos/:id', authenticate, (req, res) => {
  var id = req.params.id;

  if(!ObjectID.isValid(id)) {
    res.status(404).send();
  }


  Todo.findOne({_id: id, _creator: req.user._id}).then((todo) => {
    if(!todo) {
      res.status(404).send({todo: 'Todo not found'});
    }
    res.send({todo});
  }, (e) => {
    res.status(400).send();
  });
});


app.delete('/todos/:id', authenticate, (req, res) => {
  var id = req.params.id;

  if(!ObjectID.isValid(id)) {
    res.status(404).send();
  };

  Todo.findOneAndRemove({_id: id, _creator: req.user._id}).then((todo) => {
    if(!todo) {
      res.status(404).send({todo: 'Todo not found'});
    }
    res.send({todo});
  }, (e) => {
    res.status(404).send();
  });
});

app.patch('/todos/:id', authenticate, (req, res) => {
  var id = req.params.id;
  var body = _.pick(req.body, ['text', 'completed']);
  
  if(!ObjectID.isValid(id)) {
    res.status(404).send();
  };

  if(_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime(); // return in millisecond from mindnight
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findOneAndUpdate({_id: id, _creator: req.user._id}, {$set: body}, {new: true}).then((todo) => {
    if(!todo) {
      res.status(404).send({todo: 'Todo not found'});
    }

    res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  })
});

// POST /users

app.post('/users', (req, res) => {
  var body = _.pick(req.body, ['email', 'password'])
  var user = new User(body);
  user.save().then(() => {
    return user.generateAuthToken();
    // res.send(doc);
  }).then((token) => {
    res.header('x-auth', token).send(user);
  }).catch((e) => {
    res.status(400).send(e);
  })
});

app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

// POST
// app.post('/users/login', (req, res) => {
//   var body = _.pick(req.body, ['email', 'password'])
//   User.findByCredentials(body.email, body.password).then((user) => {
//     user.generateAuthToken().then((token) => {
//       res.header('x-auth', token).send(user);
//     });
//   }).catch((e) => {
//     res.status(400).send();
//   });
// });

// ASync
app.post('/users/login', async (req, res) => {
 try {
  const body = await _.pick(req.body, ['email', 'password'])
  const user = await User.findByCredentials(body.email, body.password);
  const token = await user.generateAuthToken();
  res.header('x-auth', token).send(user);
 } catch(e) {
    res.status(400).send();
  };
});


// DELETE 
// app.delete('/users/logout', authenticate, (req, res) => {
//   req.user.removeToken(req.token).then(() => {
//     res.status(200).send();
//   }, () => {
//     res.status(400).send();
//   })
// });

// ASync
app.delete('/users/logout', authenticate, async (req, res) => {
  try {
    await req.user.removeToken(req.token)
    res.status(200).send();
  } catch(e) {
    res.status(400).send();
  }
});


app.listen(port, () => {
  console.log(`Server is up on ${port}`);
});

module.exports = {app};