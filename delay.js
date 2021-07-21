const express = require('express');
const app = express();
const mongoose = require('mongoose');
const User = require('./models/user')
const Key = require('./models/key')
const dotenv = require('dotenv').config();

mongoose.connect(process.env.mongodb_url, {
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
     const keys = await Key.find({});
     
     let combined = {user,...keys};
     console.log(combined);
}

retrieve();

app.listen(3000, (req,res) => {
     console.log("Server is Listening")

})