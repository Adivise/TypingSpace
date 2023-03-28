const Auction = require("../../settings/models/Auctions.js");
const Money = require("../../settings/models/Money.js");
const { AuctionGlobal } = require("../../structures/Pagination.js");
const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");

module.exports = { 
    name: ["auction", "global"],
    description: "View global auction house.",
    options: [
        {
            name: "page",
            description: "The page you want to get information about.",
            type: ApplicationCommandOptionType.Integer, /// 4 = Integer
            required: false,
        }
    ],
    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: false });

        const args = interaction.options.getInteger("page");
        const auction = await Auction.find({ id: interaction.guild.id });

        let pagesNum = Math.ceil(auction.length / 10);
        if(pagesNum === 0) pagesNum = 1;

        auction.sort((a, b) => {
            return b.price - a.price;
        });

        const auctionStrings = [];
        for (let i = 0; i < auction.length; i++) {
            const e = auction[i];
            auctionStrings.push(
                `**ID:** ${e.uuid} • \`${e.name}\` • \`Price $${numberWithCommas(e.price)}\` • ${client.users.cache.get(e.seller)}
                `);
        }

        const pages = [];
        for (let i = 0; i < pagesNum; i++) {
            const str = auctionStrings.slice(i * 10, i * 10 + 10).join('');

            const embed = new EmbedBuilder()
                .setAuthor({ name: `Auction Global`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
                .setColor(client.color)
                .setDescription(`${str == '' ? '  No Auctions' : '\n' + str}`)
                .setFooter({ text: `Page • ${i + 1}/${pagesNum} | ${auction.length} • Total Auctions`});

            pages.push(embed);
        }

        if (!args) {
            if (pages.length == pagesNum && auction.length > 10) AuctionGlobal(client, interaction, pages, 120000, auction.length);
            else return interaction.editReply({ embeds: [pages[0]] });
        }
        else {
            if (isNaN(args)) return interaction.editReply('Page must be a number.');
            if (args > pagesNum) return interaction.editReply(`There are only ${pagesNum} pages available.`);
            const pageNum = args == 0 ? 1 : args - 1;
            return interaction.editReply({ embeds: [pages[pageNum]] });
        }
    }
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}