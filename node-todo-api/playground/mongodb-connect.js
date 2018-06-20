// const MongoClient = require('mongodb').MongoClient;

const {MongoClient, ObjectID} = require('mongodb'); // Destructing

const url = 'mongodb://localhost:27017/';

MongoClient.connect(url, (err, db) => {
  if(err) {
    return console.log('Unable to connect to MongoDB Server');
  };
  console.log('Connected to MongoDB server');
  const myDB = db.db('TodoApp');
  const collection = myDB.collection('Todos');
  collection.insertOne({
    text: 'Something todo',
    completed: false
  },(err, result) => {
    if (err) {
      return console.log('Unable to insert todo', err);
    }

    console.log(JSON.stringify(result.ops, undefined, 2));
  });

  // const collection = myDB.collection('Users');

  // collection.insertOne({
  //   name: 'Chanakya',
  //   age: 28,
  //   location: 'Pune'
  // }, (err, result) => {
  //   if(err) {
  //    return console.log(err);
  //   }
  //   console.log(result.ops[0]._id.getTimestamp());
  // });
  // db.close();
});