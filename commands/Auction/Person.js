const Auction = require("../../settings/models/Auctions.js");
const Money = require("../../settings/models/Money.js");
const { AuctionPerson } = require("../../structures/Pagination.js");
const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const config = require("../../settings/default.js");

module.exports = { 
    name: ["auction", "person"],
    description: "View user auction house.",
    options: [
        {
            name: "user",
            description: "The user you want to view the auction.",
            type: ApplicationCommandOptionType.User, /// 6 = User
            required: true,
        },
        {
            name: "page",
            description: "The page you want to get information about.",
            type: ApplicationCommandOptionType.Integer, /// 4 = Integer
            required: false
        }
    ],
    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: false });

        const args = interaction.options.getInteger("page");
        const member = interaction.options.getUser("user");
        const mention = member ? member.id : interaction.user.id;

        const avatarURL = member ? member.displayAvatarURL({ format: "png", size: 512 }) : interaction.user.displayAvatarURL({ format: "png", size: 512 });
        const userTag = member ? member.tag : interaction.user.tag;

        const auction = await Auction.find({ id: interaction.guild.id, seller: mention });

        let pagesNum = Math.ceil(auction.length / 10);
        if(pagesNum === 0) pagesNum = 1;
        
        /// Sort by Prices

        auction.sort((a, b) => {
            return b.price - a.price;
        });

        const auctionStrings = [];
        for (let i = 0; i < auction.length; i++) {
            const e = auction[i];
            auctionStrings.push(
                `**ID:** ${e.uuid} • \`${e.name}\` • \`Price $${numberWithCommas(e.price)}\`
                `);
        }

        const pages = [];
        for (let i = 0; i < pagesNum; i++) {
            const str = auctionStrings.slice(i * 10, i * 10 + 10).join('');

            const embed = new EmbedBuilder()
                .setAuthor({ name: userTag, iconURL: avatarURL })
                .setThumbnail(interaction.guild.iconURL({ dynamic: true }))
                .setColor(client.color)
                .setDescription(`${str == '' ? '  No Roles' : '\n' + str}`)
                .setFooter({ text: `Page • ${i + 1}/${pagesNum} | ${auction.length} • Total Roles`});

            pages.push(embed);
        }

        if (!args) {
            if (pages.length == pagesNum && auction.length > 10) AuctionPerson(client, interaction, pages, 120000, auction.length);
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