const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

Todo.findOneAndRemove({}).then((todo) => {
  console.log(todo);
})

Todo.findByIdAndRemove('599726b41e04153513bf28ef').then((todo) => {
  console.log(todo);
})
