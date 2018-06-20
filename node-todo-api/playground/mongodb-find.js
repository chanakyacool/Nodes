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

  // collection.find({
  //   _id: new ObjectID('5b28b8b01399913b36634157')
  // }).toArray().then((docs) =>  {
  //   console.log('Todos');
  //   console.log(JSON.stringify(docs, undefined, 2));
  // }, (err) => {
  //   console.log('unable to fetch todos', err)
  // });

  collection.find().count().then((count) =>  {
    console.log('Todos count', count);
  }, (err) => {
    console.log('unable to fetch todos', err)
  });


  db.close();
});