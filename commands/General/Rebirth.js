const Money = require("../../settings/models/Money.js");
const { formatNumber } = require("../../structures/FormatMoney.js");

module.exports = { 
    name: ["rebirth"],
    description: "Rebirth to boost your win money. (Rebirth will reset your money.)",
    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: false });

        const your = await Money.findOne({ id: interaction.guild.id, user: interaction.user.id });

        const cost = Math.floor(10000000 * (1 + your.rebirth));
        if (your.money < cost) return interaction.editReply(`You need \`${formatNumber(cost.toString())}\` coins to rebirth again.`);
        const money = await Money.findOneAndUpdate(
            { id: interaction.guild.id, user: interaction.user.id },
            { $set: { money: 0, bank: 0 }, $inc: { rebirth: 1, boost: 0.15 } },
            { new: true }
        );

        let boost = 0;
        for (let i = 0; i < your.rebirth + 1; i++) {
            boost += 15
        }

        interaction.editReply(`*Congratulations, you have rebirthed and received a* \`${boost}% (+15%)\` *money boost!*\n*You now have* \`${money.rebirth} rebirths.\``);
    }
}