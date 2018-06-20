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

  // deleteMany
    // collection.deleteMany({text: 'Eat lunch'}).then((result) => {
    //   console.log(result);
    // });
  // deleteOne

  // collection.deleteOne({text: 'Eat lunch'}).then((result) => {
  //   console.log(result);
  // });

  // findOneAndDelete
  
  // collection.findOneAndDelete({completed: false}).then((result) => {
  //   console.log(result);
  // });

  // db.close();

});