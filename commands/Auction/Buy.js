const Auction = require("../../settings/models/Auctions.js");
const Money = require("../../settings/models/Money.js");
const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const config = require("../../settings/default.js");
const { formatNumber } = require("../../structures/FormatMoney.js");

module.exports = { 
    name: ["auction", "buy"],
    description: "Buy role in auction house.",
    options: [
        {
            name: "user",
            description: "The user you want to buy the item for.",
            type: ApplicationCommandOptionType.User,
            required: true
        },
        {
            name: "id",
            description: "The item you want to buy.",
            type: ApplicationCommandOptionType.Integer,
            required: true
        }
    ],
    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: false });

        const id = interaction.options.getInteger("id");
        const member = interaction.options.getUser("user");

        if(member.bot) return interaction.editReply("You can't buy item from a bot.");

        const auction = await Auction.findOne({ id: interaction.guild.id, uuid: id, seller: member.id });
        const your = await Money.findOne({ id: interaction.guild.id, user: interaction.user.id });

        if (!auction) return interaction.editReply("This item doesn't exist.");
        if (auction.seller === interaction.user.id) return interaction.editReply("You can't buy your own item.");
        if (auction.price > your.money) return interaction.editReply(`You need ${formatNumber(auction.price.toString())} to buy this role.`);

        const roles = client.guilds.cache.get(interaction.guild.id).roles.cache.find(r => r.name === auction.name);
        const alreadyHave = interaction.member.roles.cache.find(r => r.id === roles.id);
        if(alreadyHave) return interaction.editReply("You already have this role.");

        const target = await Money.findOne({ id: interaction.guild.id, user: member.id });

        const Tax = auction.price * config.auction_tax;
        const FullTax = auction.price - Tax;

        const embed = new EmbedBuilder()
            .setAuthor({ name: `${interaction.user.tag}`, iconURL: interaction.user.avatarURL({ dynamic: true }) })
            .setThumbnail(interaction.user.avatarURL({ dynamic: true }))
            .addFields([
                { name: "Role:", value: `${auction.name}`, inline: true },
                { name: "Price:", value: `${formatNumber(auction.price.toString())}`, inline: true },
                { name: "Seller:", value: `<@${auction.seller}>`, inline: true },
                { name: "Buyer:", value: `${interaction.user}`, inline: true }
            ])
            .setColor("Red")
            .setFooter({ text: `ID: ${id}`})
            .setTimestamp();

        const channel = client.channels.cache.get(config.forum_id);
        const thread = channel.threads.cache.find(x => x.id === auction.post);
        await thread.edit({
            name: `[BUYED] Role: ${auction.name} Price: ${formatNumber(FullTax.toString())} ID: ${id}`,
            appliedTags: [config.buy_tag_id]
        });
        const message = await thread.messages.fetch(auction.message, { cache: false, force: true });
        await message.edit({ content: `**Order is bought By ${interaction.user}** | ${roles}`, embeds: [embed] })

        await interaction.editReply(`You have successfully bought the \`${auction.name}\` role for \`$${formatNumber(FullTax.toString())}\` coins. (Tax: \`-$${formatNumber(Tax.toString())}\`)`);
        await interaction.member.roles.add(roles);

        your.money -= auction.price;
        target.money += FullTax;

        await your.save();
        await target.save();
        await auction.deleteOne();
    }
}