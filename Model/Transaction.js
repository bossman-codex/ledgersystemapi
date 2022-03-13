const mongoose = require("mongoose")

const TransactionSchema = mongoose.Schema({

    TransactionId: {
        type: String,
        required:true
    },
    AccountNumberSender: {
        type: String
    },
    AccountNumberReceiver: {
        type: String
    },
      Amount: {
        type: Number
    },
      AccountBalance: {
        type: Number
    },
       Description: {
           type: String
    },
        TransactionType: {
        type: String
    },
       TimeCreated: {
           type: Date,
           default:Date.now
    }
      
})

module.exports = mongoose.model("Transaction" , TransactionSchema)