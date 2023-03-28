const mongoose = require("mongoose");

const Load = new mongoose.Schema({
    id: String,
    enable: Boolean,
    channel: String,
    message: String,
    word: String,
    members: Array
});

module.exports = mongoose.model("Typings", Load);