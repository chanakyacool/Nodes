const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const{Todo} = require('./../server/models/todo');


// Todo.remove({})

// Todo.remove({}).then((result) => {
//   console.log(result);

//   // returns the result of number of docs that has been removed
// });

// Todo.findOneAndRemove

// Todo.findOneAndRemove({_id: '5b34a6cbe8242e19525d885e'}).then((todo) => {

// });

// Todo.findByIdAndRemove('5b34a6cbe8242e19525d885e').then((todo) => {
//   console.log(todo);
// returns the doc that has been removed
// });