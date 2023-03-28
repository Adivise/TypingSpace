const mongoose = require("mongoose");

const Load = new mongoose.Schema({
    id: String,
    roulette: Boolean,
    history: Array,
    space: Array,
    data: Array,
    time_remaining: Number,
    time: Number,
    time_limit: Number,
});

module.exports = mongoose.model("Roulette", Load);