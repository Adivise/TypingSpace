const Member = require('../../settings/models/Money.js');
const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const { formatNumber } = require("../../structures/FormatMoney.js");

module.exports = { 
    name: ["pay"],
    description: "Pay someone.",
    options: [
        {
            name: "amount",
            description: "The amount you want to pay.",
            type: ApplicationCommandOptionType.String,
            required: true,
        },
        {
            name: "user",
            description: "The user you want to pay.",
            type: ApplicationCommandOptionType.User,
            required: true,
        }
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

        if (args != parseInt(args) && args != "all") return interaction.editReply("Please provide a valid amount or all");

        const member = interaction.options.getUser("user");
        if (member.id === interaction.user.id) return interaction.editReply("You can't pay yourself.");
        if (member.bot) return interaction.editReply("You can't pay bots.");

        await client.createMoney(interaction.guild.id, member.id);

        const user = await Member.findOne({ id: interaction.guild.id, user: interaction.user.id });
        const target = await Member.findOne({ id: interaction.guild.id, user: member.id });

        if (args > user.money) {
            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) })
                .setDescription(`You don't have enough money to pay this amount.`)
                .setTimestamp();

            return interaction.editReply({ embeds: [embed] });
        }

        if (user.money < -1) {
            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) })
                .setDescription(`You have are negative money!`)
                .setTimestamp();

            return interaction.editReply({ embeds: [embed] });
        }

        if (args.toLowerCase() == 'all') { /// PAY ALL
            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) })
                .setDescription(`You pay \`$${formatNumber(user.money.toString())}\` to ${member}.`)
                .setTimestamp();

            interaction.editReply({ embeds: [embed] });
			
			target.money += user.money;
            user.money = 0;

            await target.save();
            await user.save();
        } else { /// PAY AMOUNT
            target.money += parseInt(args);
            user.money -= parseInt(args);

            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true }) })
                .setDescription(`You pay \`$${formatNumber(parseInt(args).toString())}\` to ${member}.`)
                .setTimestamp();

			interaction.editReply({ embeds: [embed] });

            await target.save();
            await user.save();
        }
    }
}