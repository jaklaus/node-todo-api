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
    var text = 'Test TODO text';

    request(app)
      .post('/todos')
      .set({'x-auth': users[0].tokens[0].token})
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if(err){
          return done(err);
        }

        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e) => done(e));
      })
  });

  it('should not create Todo', (done) => {
    request(app)
      .post('/todos')
      .set({'x-auth': users[0].tokens[0].token})
      .send({})
      .expect((res) => {
        expect(res.status).toBe(400)
      })
      .end((err, res) => {
        if(err){
          return done(err);
        }

        Todo.find().then((todos) => {
          expect(todos.length).toBe(2);
          done();
        }).catch((e) => done());
      })
  });
});

describe('GET /todos', () => {
  it('should get all todos', (done) => {
    request(app)
      .get('/todos')
      .set({'x-auth': users[0].tokens[0].token})
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(1);
      })
      .end(done)
  })
});

describe('GET /todos/:id', () => {
  it('should return todo doc', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .set({'x-auth': users[0].tokens[0].token})
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });

  it('should return 404 if todo not found', (done) => {
    request(app)
      .get(`/todos/${new ObjectID().toHexString()}`)
      .set({'x-auth': users[0].tokens[0].token})
      .expect(404)
      .end(done);
  });

  it('should return 404 for non-object ids', (done) => {
    request(app)
      .get(`/todos/123`)
      .set({'x-auth': users[0].tokens[0].token})
      .expect(404)
      .end(done);
  });

  it('should not allow searching unauthorized todos', (done) => {
    request(app)
      .get(`/todos/${todos[1]._id.toHexString()}`)
      .set({'x-auth': users[0].tokens[0].token})
      .expect(404)
      .end(done);
  });

});

describe('DELETE /todos/:id', () => {
  it('should delete a todo by id', (done) => {
    var hexId = todos[0]._id.toHexString();
    request(app)
      .delete(`/todos/${hexId}`)
      .set({'x-auth': users[0].tokens[0].token})
      .expect(200)
      .expect((res) => {
        expect(res.body.todo._id).toBe(hexId)
      })
      .end((err, res) => {
        if(err){
          return done(err);
        }
        Todo.findById(hexId).then((todo) => {
          expect(todo).toNotExist();
          done();
        }).catch((e) => done(e))
      })
  });

  it('should not allow a user to delete a todo they dont own', (done) => {
    var hexId = todos[0]._id.toHexString();
    request(app)
      .delete(`/todos/${hexId}`)
      .set({'x-auth': users[1].tokens[0].token})
      .expect(404)
      .end((err, res) => {
        if(err){
          return done(err);
        }
        Todo.findById(hexId).then((todo) => {
          expect(todo).toExist();
          done();
        }).catch((e) => done(e))
      })
  });

  it('should return 404 if id not found', (done) => {
    request(app)
      .delete(`/todos/${new ObjectID().toHexString()}`)
      .set({'x-auth': users[0].tokens[0].token})
      .expect(404)
      .end(done)
  });

  it('should return 404 if invalid Id', (done) => {
    request(app)
      .delete(`/todos/123`)
      .set({'x-auth': users[0].tokens[0].token})
      .expect(404)
      .end(done)
  });
})

describe('PATCH /todos/:id', () => {
  it('should update todo', (done) => {
    var hexId = todos[0]._id.toHexString();
    var patchObj = {text: 'PATCHED Text', completed: true}
    request(app)
      .patch(`/todos/${hexId}`)
      .set({'x-auth': users[0].tokens[0].token})
      .send(patchObj)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(patchObj.text);
        expect(res.body.todo.completed).toExist();
        expect(res.body.todo.completedAt).toBeA('number');
      })
      .end((err, res) => {
        if(err){
          return done(err);
        }
        Todo.findById(hexId).then((todo) => {
          expect(todo.completed).toExist();
          done()
        }).catch((e) => done(e))
      });
  });

  it('should not allow user to update todo if not owned', (done) => {
    var hexId = todos[0]._id.toHexString();
    var patchObj = {text: 'PATCHED Text', completed: true}
    request(app)
      .patch(`/todos/${hexId}`)
      .set({'x-auth': users[1].tokens[0].token})
      .send(patchObj)
      .expect(404)
      .end((err, res) => {
        if(err){
          return done(err);
        }
        Todo.findById(hexId).then((todo) => {
          expect(todo.completed).toNotExist();
          done()
        }).catch((e) => done(e))
      });
  });

  it('should clear completedAt when todo is not completed', (done) => {
    var hexId = todos[0]._id.toHexString();
    request(app)
      .patch(`/todos/${hexId}`)
      .set({'x-auth': users[0].tokens[0].token})
      .send({completed: false})
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.completed).toNotExist();
      })
      .end((err, res) => {
        if(err){
          return done(err);
        }
        Todo.findById(hexId).then((todo) => {
          expect(todo.completedAt).toNotExist();
          done()
        }).catch((e) => done(e))
      })
  })
});

describe('GET /users/me', () => {
  it('should return user if authenticated', (done) => {
    request(app)
      .get(`/users/me`)
      // Sets header
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      }).end(done)
  });

  it('should return 401 if not authenticated', (done) => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({})
      })
      .end(done)
  })
});

describe('POST /users', () => {
  it('should create a user', (done) => {
    var testUser = {email: 'my@test.com', password: 'mytest'};

    request(app)
      .post('/users')
      .send(testUser)
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toExist();
        expect(res.body._id).toExist();
        expect(res.body.email).toBe(testUser.email);
      })
      .end((err, res) => {
        if(err){
          return done(err);
        }
        User.findOne({email: testUser.email}).then((user) => {
          expect(user.email).toBe(testUser.email);
          done();
        }).catch((e) => done(e));
      })
  });

  it('should return validation errors', (done) => {
    var email = 'joel'
    var password = 'test'
    request(app)
      .post('/users')
      .send({email, password})
      .expect(400)
      .end(done)
  });

  it('should not create user if email in use', (done) => {
    var testUserError = {email: 'second@seed.com', password: 'mytest'};

    request(app)
      .post('/users')
      .send(testUserError)
      .expect(400)
      .end(done)
  });
});

describe('POST /users/login', () => {
  it('should login the user', (done) => {
    var testUser = {email: users[1].email, password: users[1].password };

    request(app)
      .post('/users/login')
      .send(testUser)
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toExist();
      })
      .end((err, res) => {
        if(err){
          return done(err);
        }

        User.findById(users[1]._id).then((user) => {
          expect(user.tokens[1]).toInclude({
            access: 'auth',
            token: res.headers['x-auth']
          });
          done();
        }).catch((e) => done(e))
      })
  });

  it('should reject invalid username or password', (done) => {
    var invalidUser = {email: users[1].email, password: 'error' };

    request(app)
      .post('/users/login')
      .send(invalidUser)
      .expect(400)
      .expect((res) => {
        expect(res.headers['x-auth']).toNotExist();
      })
      .end((err, res) => {
        if(err){
          return done(err);
        }

        User.findById(users[1]._id).then((user) => {
          expect(user.tokens.length).toEqual(1);
          done()
        }).catch((e) => done(e))
      })
  })
});

describe('/DELETE /users/me/token', () => {
  var userToken = users[0].tokens[0].token;

  it('should remove auth token', (done) => {
    request(app)
      .delete('/users/me/token')
      .set({'x-auth': userToken})
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toNotExist()
      })
      .end((err, res) => {
        if(err){
          return done(err)
        }

        User.findById(users[0]._id).then((user) => {
          expect(user.tokens.length).toEqual(0);
          done()
        }).catch((e) => done(e));
      });
  })
});
