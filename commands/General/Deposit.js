const Member = require('../../settings/models/Money.js');
const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const { formatNumber } = require("../../structures/FormatMoney.js");

module.exports = { 
    name: ["deposit"],
    description: "Deposit money into your bank.",
    options: [
        {
            name: "amount",
            description: "The amount you want to deposit.",
            type: ApplicationCommandOptionType.String, /// 3 = String
            required: true,
        },
    ],
    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: false });
        const args = interaction.options.getString("amount");

        const filters = [
            "+",
            "-"
        ];

        for (const message in filters) {
            if (args.includes(filters[message])) return interaction.editReply("You can't do that!");
        }
        
        if(args != parseInt(args) && args != "all") return interaction.editReply("Please provide a valid amount or all");
        /// NEED AMOUNT AND ALL

        const user = await Member.findOne({ id: interaction.guild.id, user: interaction.user.id });

        if (args > user.money) {
            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) })
                .setDescription(`You don't have enough money to deposit this amount.`)
                .setTimestamp();

            return interaction.editReply({ embeds: [embed] });
        }

        if (args.toLowerCase() == 'all') { /// DEPOSIT ALL
            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) })
                .setDescription(`You have deposited \`$${formatNumber(user.money.toString())}\` into your bank.`)
                .setTimestamp();

            interaction.editReply({ embeds: [embed] });

            user.bank += user.money;
            user.money = 0;

            await user.save();
        } else { /// DEPOSIT AMOUNT
            user.bank += parseInt(args);
            user.money -= parseInt(args);

            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) })
                .setDescription(`You have deposited \`$${formatNumber(parseInt(args).toString())}\` into your bank.`)
                .setTimestamp();

            interaction.editReply({ embeds: [embed] });

            await user.save();
        }
    }
}