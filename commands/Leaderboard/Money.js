const Member = require('../../settings/models/Money.js');
const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const { LeadPage } = require("../../structures/Pagination.js");
const { formatNumber } = require("../../structures/FormatMoney.js");

module.exports = { 
    name: ["leaderboard", "money"],
    description: "View the top money with leaderboard.",
    options: [
        {
            name: "page",
            description: "The page you want to get information about.",
            type: ApplicationCommandOptionType.Integer, /// 4 = Integer
            required: false
        },
    ],
    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: false });

        const args = interaction.options.getInteger("page");
        const user = await Member.find({ id: interaction.guild.id });
    
        let pagesNum = Math.ceil(user.length / 10);
        if(pagesNum === 0) pagesNum = 1;

        /// Sort by Money
        user.sort((a, b) => {
            return b.money + b.bank - (a.money + a.bank);
        });

        const userStrings = [];
        for (let i = 0; i < user.length; i++) {
            const e = user[i];
            const fetch = await client.users.fetch(e.user);
            userStrings.push(
                `**${i + 1}.** ${client.users.cache.get(fetch.id)} \`$${formatNumber(e.money + e.bank.toString())} 💰 Coins\`
                `);
        }

        const pages = [];
        for (let i = 0; i < pagesNum; i++) {
            const str = userStrings.slice(i * 10, i * 10 + 10).join('');

            const embed = new EmbedBuilder()
                .setAuthor({ name: `Top Money`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
                .setColor(client.color)
                .setDescription(`${str == '' ? '  No Users' : '\n' + str}`)
                .setFooter({ text: `Page • ${i + 1}/${pagesNum} | ${user.length} • Total Members`});

            pages.push(embed);
        }

        if (!args) {
            if (pages.length == pagesNum && user.length > 10) LeadPage(client, interaction, pages, 120000, user.length);
            else return interaction.editReply({ embeds: [pages[0]] });
        } else {
            if (isNaN(args)) return interaction.editReply('Page must be a number.');
            if (args > pagesNum) return interaction.editReply(`There are only ${pagesNum} pages available.`);
            const pageNum = args == 0 ? 1 : args - 1;
            return interaction.editReply({ embeds: [pages[pageNum]] });
        }
    }
}