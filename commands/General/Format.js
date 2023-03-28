const { EmbedBuilder } = require("discord.js");

module.exports = { 
    name: ["format-money"],
    description: "See money format infomation.",
    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: false });

        const format = ["K", "M", "B", "T", "Qd", "Qn", "Sx", "Sp", "O", "N", "De", "Ud", "DD", "tdD", "qdD", "QnD", "sxD", "SpD", "OcD", "NvD", "Vgn"];

        const embed = new EmbedBuilder()
            .setDescription(`\`${format.join(", ")}\``)
            .setColor(client.color)

        interaction.editReply({ embeds: [embed] });
    }
}