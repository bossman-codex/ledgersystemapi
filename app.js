const express = require('express');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const account = require('./Routes/Account');
const transaction = require('./Routes/Transaction');

require('dotenv/config');

const app = express();
app.use(bodyparser.json());

app.get('/', (req, res) => {
  res.send('Welcome to Wallet');
});

app.use('/account', account);

app.use('/transaction', transaction);

app.on('ready', function () {
  app.listen(process.env.PORT || 4000, function () {
    console.log('localhost running at 4000');
  });
});

mongoose.connect(process.env.DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  retryWrites: false
});

mongoose.connection.once('open', function () {
  app.emit('ready');
});

module.exports = app;
