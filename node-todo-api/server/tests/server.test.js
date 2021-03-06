const expect = require('expect');
const request = require('supertest');

const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');

const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    var text = "From the test cases";

    request(app)
      .post('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find({text: text}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((err) => done(err));
      })
  }); 

  it('should not create todo with invalid boddy data', (done) => {
    request(app)
    .post('/todos')
    .set('x-auth', users[0].tokens[0].token)
    .send({})
    .expect(400)
    .end((err, res) => {
      if (err) {
        return done(err);
      }


      Todo.find({}).then((todos) => {
        expect(todos.length).toBe(2);
        done();
      }).catch((err) => done(err));
    });
  });

});

describe('GET /todos', () => {
 it('should get all todos', (done) =>{
   request(app).get('/todos').set('x-auth', users[0].tokens[0].token).expect(200)
    .expect((res) => {
      expect(res.body.todos.length).toBe(1);
    })
    .end(done);
 });
});

describe('GET /todos/:id', () => {
  it('should return todo doc', (done) => {
    request(app)
     .get(`/todos/${todos[0]._id.toHexString()}`)
     .set('x-auth', users[0].tokens[0].token)
     .expect(200)
     .expect((res) => {
       expect(res.body.todo.text).toBe(todos[0].text);
     })
     .end(done);
  });

  it('should not return todo doc created by other user', (done) => {
    request(app)
     .get(`/todos/${todos[1]._id.toHexString()}`)
     .set('x-auth', users[0].tokens[0].token)
     .expect(404)
     .end(done);
  });

  it('should return 404 if todo is not found', (done) =>{
    var hexId = new ObjectID().toHexString();
    request(app)
    .get(`/todos/${hexId}`)
    .set('x-auth', users[0].tokens[0].token)
    .expect(404)
     done();
  });

  it('should return 404for non-object ids', (done) =>{
    request(app)
    .get('/todos/123abc')
    .set('x-auth', users[0].tokens[0].token)
    .expect(404)
    done();
  });
});

describe('DELETE /todos/:id', () => {
  it('should remove a todo', (done) => {
    var hexId = todos[1]._id.toHexString();

    request(app)
      .delete(`/todos/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo._id).toBe(hexId);
      })
      .end((err, res) => {
        if(err) {
          console.log(err);
          return done(err);
        }

        // query database by find by id
        Todo.findById(hexId).then((todo) => {
          expect(todo).toBeFalsy();
          done();
        }).catch((e) => done(e));
      })
  });

  it('should not remove a todo, which is not owned by user', (done) => {
    var hexId = todos[1]._id.toHexString();

    request(app)
      .delete(`/todos/${hexId}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end((err, res) => {
        if(err) {
          console.log(err);
          return done(err);
        }

        // query database by find by id
        Todo.findById(hexId).then((todo) => {
          expect(todo).toBeTruthy();
          done();
        }).catch((e) => done(e));
      })
  });

  it('should return 404, if todo not found',(done) => {
    var hexId = new ObjectID().toHexString();
    request(app)
    .delete(`/todos/${hexId}`)
    .set('x-auth', users[1].tokens[0].token)
    .expect(404)
     done();
  });


 it('should return 404 for non-object ids', (done) =>{
    request(app)
    .delete('/todos/123abc')
    .set('x-auth', users[1].tokens[0].token)
    .expect(404)
    done();
  });
});


describe('PATCH /todos/:id', () => {
  it('should update todo', (done) => {
    var hexId = todos[0]._id.toHexString();

    var body = {
      text: 'updated from test case',
      completed: true
    }

    request(app)
    .patch(`/todos/${hexId}`)
    .set('x-auth', users[0].tokens[0].token)
    .send({
      completed: body.completed,
      text: body.text
    })
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.text).toBe(body.text);
      expect(res.body.todo.completed).toBe(true);
      // expect(res.body.todo.completedAt).toBeA('number');
      expect(typeof res.body.todo.completedAt).toBe('number');
    })
    .end(done);
  })

  it('should not update todo of other user', (done) => {
    var hexId = todos[0]._id.toHexString();

    var body = {
      text: 'updated from test case',
      completed: true
    }

    request(app)
    .patch(`/todos/${hexId}`)
    .set('x-auth', users[1].tokens[0].token)
    .send({
      completed: body.completed,
      text: body.text
    })
    .expect(404)
    .end(done);
  })

  it('should clear completedAt when todo is not completed', (done) => {
    var hexId = todos[0]._id.toHexString();

    var body = {
      text: 'updated from test case',
      completed: false
    }

    request(app)
    .patch(`/todos/${hexId}`)
    .set('x-auth', users[0].tokens[0].token)
    .send({
      completed: body.completed,
      text: body.text
    })
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.text).toBe(body.text);
      expect(res.body.todo.completed).toBe(false);
      expect(res.body.todo.completedAt).toBeFalsy();
    })
    .end(done);
  })
});

describe('GET /users/me', () => {
  it('should return the user if authenticated', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString())
        expect(res.body.email).toBe(users[0].email);
      })
      .end(done);
  });

  it('should return 401 if not authenticated', (done) => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({});
      })
      .end(done);
  })
})

describe('POST /users', () => {
  it('should create a user', (done) => {
    var email = 'user@exmaple.com';
    var password = 'password'

    request(app)
      .post('/users')
      .send({email, password})
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toBeTruthy();
        expect(res.body._id).toBeTruthy();
        expect(res.body.email).toBe(email);
      })
      .end((err) => {
        if(err) {
          return done(err);
        }
      User.findOne({email}).then((user) => {
        expect(user).toBeTruthy();
        expect(user.password).not.toBe(password);
      })
      done();
    });
  })

  it('should return validation errors if request is invalid', (done) => {
    request(app)
      .post('/users')
      .send({
        email: 'and',
        password: '123'
      })
      .expect(400)
      .end(done)
  })

  it('should not create user if the email is user', (done) => {
    request(app)
    .post('/users')
    .send({
      email: users[0].email,
      password: users[0].password
    })
    .expect(400)
    .end(done)
  })
});

// POST /users/login

describe('POST /users/login', () => {

  it('should login and return the auth token', (done) => {
    request(app)
      .post('/users/login')
      .send({email: users[1].email, password: users[1].password})
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toBeTruthy();
      })
      .end((err, res) => {
        if(err) {
          return done(err);
        }

        User.findById(users[1]._id).then((user) => {
          expect(user.toObject().tokens[1]).toMatchObject({
            access: 'auth',
            token: res.headers['x-auth']
          });
          done();
        }).catch((e) => {
          done(e);
        })
      });
  });

  it('it should return 400 if the login fails', (done) => {
    request(app)
      .post('/users/login')
      .send({email: users[1].email, password: users[1].password+'s'})
      .expect(400)
      .expect((res) => {
        expect(res.headers['x-auth']).toBeFalsy();
      })
      .end((err, res) => {
        if(err) {
          return done(err);
        }

        User.findById(users[1]._id).then((user) => {
          expect(user.tokens.length).toBe(1);
          done();
        }).catch((e) => {
          done(e);
        })
      });
  });

})

describe('DELETE /users/logout', () => {
  it('should delete the tokens when user logouts', (done) => {
    // DELETE /users/logout
    // set x-auth token
    // 200
    // find user and verify tokens array has length of zero
    request(app)
      .delete('/users/logout')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .end((err, res) => {
        if(err) {
          return done(err);
        }

        User.findById(users[0]._id).then((user) => {
          expect(user.tokens.length).toBe(0)
          done();          
        }).catch((e) => {
          done(e);
        })
      })
  })
})