const mongoose = require('mongoose');

const keySchema = new mongoose.Schema({
    id: String,
    broker: String,
    apikey: String,
    secretkey: String,
    req_token: String
},
    {timestamps: true}
)

module.exports = mongoose.model('Key', keySchema);