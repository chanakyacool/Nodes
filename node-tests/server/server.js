const express = require('express');

const app = express();

app.get('/', (req, res) => {
 res.status(404).send({
   error: 'page not found',
   name: 'TodoApp v1.0'
 })
});

app.listen(3000, () => {
  console.log('Server started at 3000');
});

module.exports.app = app;
