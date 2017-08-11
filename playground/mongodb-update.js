// const MongoClient = require('mongodb').MongoClient;
// Same as above but uses ES6 object destructuring
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if(err)
    return console.log(`Unable to connect to MongoDB server`)

  console.log('Connected to MongoDB server');

  // db.collection('Todos').findOneAndUpdate({
  //   _id: ObjectID('598cdb22bd94454de90e1b54')
  // }, {
  //   $set: {
  //     completed: true
  //   }
  // }, {
  //   returnOriginal: false
  // }).then((result) => {
  //   console.log(result)
  // }, (err) => {
  //   console.log(err)
  // })

  // Challenge update name on one document and increment age by one
  db.collection('Users').findOneAndUpdate({
    _id: ObjectID('598c898d22d1134affadcc84')
  }, {
    $set: {
      name: "Jaina"
    },
    $inc: {
      age: 1
    }
  }, {
    returnOriginal: false
  }).then((result) => {
    console.log(result);
  }, (err) => {
    console.log(err);
  })

  // db.close();
});
