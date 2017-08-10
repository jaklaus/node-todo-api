// const MongoClient = require('mongodb').MongoClient;
// Same as above but uses ES6 object destructuring
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if(err)
    return console.log(`Unable to connect to MongoDB server`)

  console.log('Connected to MongoDB server');

  // deleteMany
  // db.collection('Todos').deleteMany({text: 'My first Todo'}).then((result) => {
  //   console.log(result)
  // }, (err) => {
  //   console.log(err)
  // })
  // deleteOne
  // db.collection('Todos').deleteOne({text: 'Get Groceries'}).then((result) => {
  //   console.log(result);
  // }, (err) => {
  //   console.log(err);
  // })

  // findOneAndDelete
// db.collection('Todos').findOneAndDelete({text: 'Get Groceries'}).then((result) => {
//   console.log(result)
// }, (err) => {
//   console.log(err);
// })

// Challenge - delete from Users collection using _id
db.collection('Users').findOneAndDelete({_id: ObjectID('598c8972b0a5ef4afe591861')}).then((result) => {
  console.log(result);
}, (err) => {
  console.log(err);
})

  // db.close();
});
