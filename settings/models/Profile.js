const { Schema, model } = require('mongoose');

const Load = new Schema({
    id: String,
    user: String,
    word: String,
    date: Number
});

module.exports = model('Profiles', Load);