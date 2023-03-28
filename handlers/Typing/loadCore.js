const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
const Money = require("../../settings/models/Money.js")
const Typing = require("../../settings/models/Typing.js");
const Profile = require("../../settings/models/Profile.js");
const { formatNumber } = require("../../structures/FormatMoney.js");
const randomWords = require('random-words');
const canvas = require("@napi-rs/canvas");

const startGame = async (client, guildID) => {
    const database = await Typing.findOne({ id: guildID });
    if (!database) return;

    const channel = await client.channels.cache.get(database.channel);
    if (!channel) return;

    const gameWords = randomWords();
    database.word = gameWords;
    await database.save();

    const antiCheatCanvas = canvas.createCanvas(500, 100);
    const ctx = antiCheatCanvas.getContext("2d");
    
    ctx.font = "bold 50px Arial";
    ctx.fillStyle = "#FFFFFF";
    ctx.textAlign = "center";
    ctx.fillText(gameWords, antiCheatCanvas.width / 2, antiCheatCanvas.height / 2);
    
    const attachment = new AttachmentBuilder(await antiCheatCanvas.encode("png"), { name: "anti-cheat.png" });

    const msg = await channel.messages.fetch(database.message, { cache: false, force: true });

    const embed = new EmbedBuilder()
        .setAuthor({ name: "Starting....", iconURL: client.user.displayAvatarURL() })
        .setImage("attachment://anti-cheat.png")
        .setFooter({ text: "Bot will get last word from you sended." })
        .setColor(client.color);

    await msg.edit({ content: "**🚫 Please Type in: 10 seconds**", embeds: [embed], files: [attachment] });

    let timeLeft = 10;
    const interval = setInterval(async () => {
    timeLeft--;
    if (timeLeft <= 0) {
        clearInterval(interval);

        const results = [];

        const datac = await Typing.findOne({ id: guildID });
        for (let i = 0; i < datac.members.length; i++) {
            const members = datac.members[i]
            const data = await Profile.findOne({ id: guildID, user: members });
            if (!data) continue;

            const lastTyped = data.date;
            const wordsTyped = data.word;
            if (wordsTyped == gameWords) {
                const fetch = channel.guild.members.cache.get(members);
                const timeElapsed = (Date.now() - lastTyped) / 1000; // convert to seconds          
                    results.push({
                        user: fetch.user,
                        wpm: timeElapsed
                    });
                }

            await Profile.findOneAndUpdate({ id: guildID, user: members }, {
                word: "",
                date: 0
            });
        }
        results.sort((a, b) => b.wpm - a.wpm);

        let description = "";
        const ellipsis = " ...";
        const prizeMoney = [30000, 15000, 10000, 5000, 5000, 5000, 5000, 5000, 5000, 5000];
        
        for (const [index, result] of results.slice(0, 10).entries()) {
            const profile = await Money.findOne({ id: guildID, user: result.user.id });
            const money = prizeMoney[index];
            const totalMoney = Math.floor(money * (1 + profile.boost));
            
            const userString = `**(${index + 1}.) ${result.user}** - \`${result.wpm}\` ⌨ | (+$${formatNumber(totalMoney.toString())} 💸)\n`;
            
            if (description.length + userString.length > 2000) {
                const remaining = 2000 - description.length - ellipsis.length;
                description += userString.slice(0, remaining) + ellipsis;
                break;
            } else {
                description += userString;
            }
        }

        let wins = ""
        const winner = results[0] || "No Data";
        if (results[0]) {
            wins = `${winner.user || "*Nobody*"} - \`${winner.wpm || "N/A"}\` ⌨ | (+1 👑)`;
        } else {
            wins = "*Nobody*"
        }
        const str = `**Results 📃**\n${description || "*Nobody*\n"}\n**Winner 👑**\n${wins}\n\n\`🚫 Retry in: 15 seconds\``

        await msg.edit({ content: str, embeds: [], files: [] });

        if(results[0]) {
            await Money.findOneAndUpdate({ id: guildID, user: results[0].user.id }, {
                $inc: { win: 1 }
            });
        }
        
        for (let i = 0; i < results.length; i++) {
            const profile = await Money.findOne({ id: guildID, user: results[i].user.id });
            const money = prizeMoney[i];
            const totalMoney = Math.floor(money * (1 + profile.boost));

            await Money.findOneAndUpdate({ id: guildID, user: results[i].user.id }, {
                $inc: { money: totalMoney }
            });
        } 

        datac.word = "";
        datac.members = [];
        await datac.save();
        
        await delay(15000);

        return startGame(client, guildID);
    } else {   
        //    await msg.edit({ content: `**TimeLeft in: ${timeLeft} seconds**` });
        }
    }, 1000);
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = { startGame };