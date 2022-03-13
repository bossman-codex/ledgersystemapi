const mongoose = require("mongoose")

const AccountSchema = mongoose.Schema({
    AccountNumber: {
        type: String
    },
     EmailAddress: {
        type: String
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
           default:"Active"
    },
       TimeCreated: {
           type: Date,
           default:Date.now
    }
      
})

module.exports = mongoose.model("Wallet" , AccountSchema)