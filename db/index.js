const mongoose = require("mongoose")
require("dotenv/config")

const connected = async () => {
    try {
       mongoose.connection.on('connected', () => {
    console.log("mongoose connected")
})
        await mongoose.connect(process.env.DB, {
            useNewUrlParser: true,
            useUnifiedTopology:true
        })
// If the connection is connected


// If the connection throws an error
mongoose.connection.on('error',function (err) {  
  console.log('Mongoose default connection error: ' + err);
}); 

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {  
  console.log('Mongoose default connection disconnected'); 
});
    }
    
    catch(err) {
        console.log(err.message);
        process.exit(1);
    }
    
}

const closeconnection = () => {
    return mongoose.disconnect();
}

module.exports = { connected, closeconnection };