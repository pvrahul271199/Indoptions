const mongoose = require('mongoose');
const Key = require('./key');

const userSchema = new mongoose.Schema({
    id: String,
    script: [{
        type: String
    }],
    strikeprice: [{
        type: String
    }],

    option: [{
        type: String
    }],
    order: [{
        type: String
    }],
    ordertype: [{
        type: String
    }],
    stoploss: [{
        type: Number
    }],
    sltype: [{
        type: String
    }],
    entrytime: {
        type: String
    },
    exittime: {
        type: String
    },
    sltocost: {
        type: String
    },
    keys: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Key'

    }]
});

module.exports = mongoose.model('User', userSchema)