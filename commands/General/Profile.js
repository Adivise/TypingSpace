const { EmbedBuilder } = require("discord.js");
const Money = require("../../settings/models/Money.js");
const { formatNumber } = require("../../structures/FormatMoney.js");

module.exports = { 
    name: ["profile"],
    description: "View your profile information.",
    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: false });

        const your = await Money.findOne({ id: interaction.guild.id, user: interaction.user.id });

        let boost = 0;
        for (let i = 0; i < your.rebirth; i++) {
            boost += 15
        }

        const embed = new EmbedBuilder()
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL() })
            .setThumbnail(interaction.user.avatarURL())
            .addFields({ name: "👑 Win:", value: `${your.win}`, inline: true })
            .addFields({ name: "🔃 Rebirth:", value: `${formatNumber(your.rebirth.toString())}`, inline: true })
            .addFields({ name: "💸 Money:", value: `${formatNumber(your.money.toString())}`, inline: true })
            .addFields({ name: "💰 Money Boost:", value: `${boost}%`, inline: true })
            .addFields({ name: "🏧 Bank:", value: `${formatNumber(your.bank.toString())}`, inline: true })
            .setColor(client.color)

        interaction.editReply({ embeds: [embed] });
    }
}