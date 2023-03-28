const mongoose = require("mongoose");

const Load = new mongoose.Schema({
    id: String,
    uuid: String,
    name: String,
    price: Number,
    seller: String,
    post: String,
    message: String
});

module.exports = mongoose.model("Auctions", Load);