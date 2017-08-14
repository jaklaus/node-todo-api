const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// var id = '5992209abc972e6e097cc4bc1';
//
// if(!ObjectID.isValid(id)){
//   console.log('ID not valid')
// }

// Todo.find({
//   _id: id
// }).then((todos) => {
//   console.log('Todos: ', todos);
//   // returns an array
// })
//
// Todo.findOne({
//   _id:id
// }).then((todo) => {
//   console.log('One Todo:', todo)
//   // returns an object
// })

// Todo.findById(id).then((todo) => {
//   if(!todo){
//     return console.log('Id not found');
//   }
//   console.log('Todo by Id', todo)
// }).catch((e) => console.log(e))

var userId = "5991d66d552c5a6447594695";

User.findById(userId).then((user) => {
    if(!user){
      return console.log('Could not find User')
    }
    console.log(user)
  }).catch((e) => console.log('Unable to log User'))
