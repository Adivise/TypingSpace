const mongoose = require('mongoose');

module.exports = async (client) => {
    try {
        mongoose.connect(client.config.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    } catch (error) {
        console.log(error);
    }
    mongoose.set('strictQuery', true);
} 