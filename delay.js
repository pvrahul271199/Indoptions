const express = require('express');
const app = express();
const mongoose = require('mongoose');
const User = require('./models/user')
const Key = require('./models/key')
const dotenv = require('dotenv').config();

mongoose.connect("mongodb://arun:arunnair@indoptions-shard-00-00.mgxnp.mongodb.net:27017,indoptions-shard-00-01.mgxnp.mongodb.net:27017,indoptions-shard-00-02.mgxnp.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-aykcp9-shard-0&authSource=admin&retryWrites=true&w=majority", {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then((res) => {
         console.log("Database Connection Established")
    })
    .catch((e) => {
         console.log("Error Obtained",e)
})

const retrieve = async () => {
     const user = await User.find({});
     // console.log(user);
     const keys = await Key.find({});
     // console.log(keys);
     let combined = {user,...keys};
     console.log(combined);
}

retrieve();



app.listen(3000, (req,res) => {
     console.log("Server is Listening")

})