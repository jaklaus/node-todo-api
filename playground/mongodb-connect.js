// const MongoClient = require('mongodb').MongoClient;
// Same as above but uses ES6 object destructuring
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if(err){
    return console.log(`Unable to connect to MongoDB server`)
  }
  console.log('Connected to MongoDB server');

  // db.collection('Todos').insertOne({
  //   text: 'My first Todo',
  //   completed: false
  // }, (err, result) => {
  //   if(err){
  //     return console.log('Unable to add entry into to MongoDB', err)
  //   }
  //   console.log(JSON.stringify(result.ops, undefined, 2));
  // })

  // Insert new doc into Users collection (name, age, location)

  // db.collection('Users').insertOne({
  //   name: "Luis",
  //   age: 32,
  //   location: "Austin, TX"
  // }, (err, result) => {
  //   if(err){
  //     return console.log(`Unable to add entry to Users collection`, err)
  //   }
  //   console.log(JSON.stringify(result.ops[0]._id.getTimestamp(), undefined, 2))
  // })

  db.close();
});
