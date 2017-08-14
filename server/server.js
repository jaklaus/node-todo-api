const express = require('express');
const bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user')

const app = express();

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('TODO / ROUTE ');
});

app.post('/todos', (req, res) => {
  var todo = new Todo({
    text: req.body.text
  });

  todo.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.send(e);
  })
});

app.listen(3000, () => {
  console.log('Todo App server listening on port 3000');
});
