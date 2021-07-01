const mongoose = require('mongoose');

const keySchema = new mongoose.Schema({
    id: Number,
    apikey: String,
    secretkey: String
})

module.exports = mongoose.model('Key', keySchema);