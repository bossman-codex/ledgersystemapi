const express = require("express")
const mongoose = require("mongoose")
const BodyParser = require("body-parser")
const Account = require("./Routes/Account")
const Transaction = require("./Routes/Transaction")

require("dotenv/config")

const app = express()
app.use(BodyParser.json())


mongoose.connect(process.env.DB, {
    useNewUrlParser: true,
    useUnifiedTopology:true
})

mongoose.connection.on('connected', () => {
    console.log("mongoose connected")
})

// If the connection throws an error
mongoose.connection.on('error',function (err) {  
  console.log('Mongoose default connection error: ' + err);
}); 

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {  
  console.log('Mongoose default connection disconnected'); 
});


app.get("/", (req, res) => {
    res.send("Welcome to Wallet")
})

app.use("/Account", Account)

app.use("/Transaction" , Transaction)



app.listen(4000 , ()=>console.log("listening on port 4000"))