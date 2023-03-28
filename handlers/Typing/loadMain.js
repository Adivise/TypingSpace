const Typing = require("../../settings/models/Typing.js");
const Profile = require("../../settings/models/Profile.js");

module.exports = async (client) => {
client.on("messageCreate", async (message) => {
        if (!message.guild || !message.guild.available) return;
        if (message.author.bot) return;

        let database = await Typing.findOne({ id: message.guild.id });
        if (!database) return;
        if (database.enable === false) return;

        let channel = message.guild.channels.cache.get(database.channel);
        if (!channel) return;
        if (database.channel != message.channel.id) return;

        client.createProfile(message.guild.id, message.author.id);
        client.createChannel(message.guild.id, message.author.id);
        client.createMoney(message.guild.id, message.author.id);
        client.createRoulette(message.guild.id);

        let content = message.cleanContent.toLowerCase();
        await message.delete();
        await Profile.findOneAndUpdate({ id: message.guild.id, user: message.author.id }, {
            word: content,
            date: Date.now()
        });

        if (database.members.includes(message.author.id)) return;
        database.members.push(message.author.id);
        database.save();

    });
};