const mongoose = require('mongoose');

const accountSchema = mongoose.Schema({
  AccountNumber: {
    type: String,
    unique: true
  },
  EmailAddress: {
    type: String,
    unique: true,
    required: true
  },
  Name: {
    type: String
  },
  PhoneNumber: {
    type: Number
  },
  AccountBalance: {
    type: Number
  },
  AccountStatus: {
    type: String,
    default: 'Active'
  },
  TimeCreated: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Wallet', accountSchema);
