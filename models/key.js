const mongoose = require('mongoose');

const keySchema = new mongoose.Schema({
    id: String,
    apikey: String,
    secretkey: String
})

module.exports = mongoose.model('Key', keySchema);