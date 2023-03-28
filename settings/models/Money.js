const { Schema, model } = require('mongoose');

const Load = new Schema({
    id: String,
    user: String,
    money: Number,
    bank: Number,
    rebirth: Number,
    win: Number,
    boost: Number
});

module.exports = model('Moneys', Load);