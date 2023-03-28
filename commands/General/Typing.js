const { ChannelType, EmbedBuilder } = require("discord.js");
const Typing = require("../../settings/models/Typing.js");
const { startGame } = require("../../handlers/Typing/loadCore.js");

module.exports = { 
    name: ["setup"],
    description: "Setup typing simulator room.",
    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: false });

        if(!client.owner == interaction.user.id) return interaction.editReply({ content: "Your not my owner." });
        
        interaction.guild.channels.create({
            name: "typing-simulator",
            type: ChannelType.GuildText,
            parent: interaction.channel.parentId,
        }).then(async (channel) => {
            const embed = new EmbedBuilder()
                .setAuthor({ name: "Loading....", iconURL: client.user.displayAvatarURL() })
                .setDescription(`Type: **N/A**`)
                .setFooter({ text: "Bot will get last word from you sended." })
                .setColor(client.color);

            await channel.send({ embeds: [embed] }).then(async (message) => {
                await Typing.findOneAndUpdate({ guild: interaction.guild.id }, {
                    id: interaction.guild.id,
                    enable: true,
                    channel: channel.id,
                    message: message.id,
                });

                const embed = new EmbedBuilder()
                    .setDescription(`*Successfully Setup Typing Rooms in ${channel}*`)
                    .setColor(client.color)

                startGame(client, interaction.guild.id);

                return interaction.followUp({ embeds: [embed] });
            });
        })
    }
}