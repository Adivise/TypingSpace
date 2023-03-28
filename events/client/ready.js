const { startGame } = require("../../handlers/Typing/loadCore.js");
const Typing = require("../../settings/models/Typing.js");

module.exports = async (client) => {
    console.log(`[INFO] ${client.user.tag} (${client.user.id}) is Ready!`);

    let guilds = client.guilds.cache.size;
    let members = client.guilds.cache.reduce((a, b) => a + b.memberCount, 0);
    let channels = client.channels.cache.size;

    client.guilds.cache.forEach(async (guild) => {
        const data = await Typing.findOne({ id: guild.id });
        if (!data) return;
        if (data.enable == false) return;
        startGame(client, guild.id)
    });

    const activities = [
        `/rebirth | ${guilds} servers`,
        `/profile | ${members} users`,
        `/auction | ${channels} channels`,
    ]

    setInterval(() => {
        client.user.setPresence({ 
            activities: [{ name: `${activities[Math.floor(Math.random() * activities.length)]}`, type: 2 }], 
            status: 'online', 
        });
    }, 15000)

};
