const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/PracticeMongo', (err, db) => {
  if(err)
    return console.log(`Unable to connect to PracticeMongo Database`)

    console.log('Connected to PracticeMongo DB');

    db.collection('MyPracticeCollection').insertOne({
      username: 'jaklaus',
      email: 'joel@example.com'
    }, (err, result) => {
      if(err)
        return console.log('unable to create entry in MyPracticeCollection', err)

      console.log(JSON.stringify(result.ops, undefined, 2))
    })

  db.close();
})
