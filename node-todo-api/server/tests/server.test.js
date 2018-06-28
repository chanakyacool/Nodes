const expect = require('expect');
const request = require('supertest');

const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos = [{
  _id: new ObjectID(),
  text: 'First test todo'
},{
  _id: new ObjectID(),
  text: 'Second test todo',
  completed: true,
  completedAt: 333
}]

beforeEach((done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() =>{
    done();
  })
});

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    var text = "From the test cases";

    request(app)
      .post('/todos')
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
   request(app).get('/todos').expect(200)
    .expect((res) => {
      expect(res.body.todos.length).toBe(2);
    })
    .end(done);
 });
});

describe('GET /todos/:id', () => {
  it('should return todo doc', (done) => {
    request(app)
     .get(`/todos/${todos[0]._id.toHexString()}`)
     .expect(200)
     .expect((res) => {
       expect(res.body.todo.text).toBe(todos[0].text);
     })
     .end(done);
  });

  it('should return 404 if todo is not found', (done) =>{
    var hexId = new ObjectID().toHexString();
    request(app)
    .get(`/todos/${hexId}`)
    .expect(404)
     done();
  });

  it('should return 404for non-object ids', (done) =>{
    request(app)
    .get('/todos/123abc')
    .expect(404)
    done();
  });
});

describe('DELETE /todos/:id', () => {
  it('should remove a todo', (done) => {
    var hexId = todos[1]._id.toHexString();

    request(app)
      .delete(`/todos/${hexId}`)
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
          expect(todo).toNotExist();
          done();
        }).catch((e) => done(e));
      })
  });

  it('should return 404, if todo not found',(done) => {
    var hexId = new ObjectID().toHexString();
    request(app)
    .delete(`/todos/${hexId}`)
    .expect(404)
     done();
  });


 it('should return 404 for non-object ids', (done) =>{
    request(app)
    .delete('/todos/123abc')
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
    .send({
      completed: body.completed,
      text: body.text
    })
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.text).toBe(body.text);
      expect(res.body.todo.completed).toBe(true);
      expect(res.body.todo.completedAt).toBeA('number');
    })
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
    .send({
      completed: body.completed,
      text: body.text
    })
    .expect(200)
    .expect((res) => {
      expect(res.body.todo.text).toBe(body.text);
      expect(res.body.todo.completed).toBe(false);
      expect(res.body.todo.completedAt).toNotExist();
    })
    .end(done);
  })
})