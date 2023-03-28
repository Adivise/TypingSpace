const Auction = require("../../settings/models/Auctions.js");
const Money = require("../../settings/models/Money.js");
const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const config = require("../../settings/default.js");
const { formatNumber } = require("../../structures/FormatMoney.js");

module.exports = { 
    name: ["auction", "sell"],
    description: "Sell role in auction house.",
    options: [
        {
            name: "role",
            description: "The role you want to sell.",
            type: ApplicationCommandOptionType.Role,
            required: true
        },
        {
            name: "price",
            description: "The price you want to sell the item for.",
            type: ApplicationCommandOptionType.Integer,
            required: true
        }
    ],
    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: false });

        const role = interaction.options.getRole("role");

        const roleList = config.role;
        if (!roleList.includes(role.id)) return interaction.editReply(`You can't sell this role. (Role For Sell: ${roleList.map(x => `<@&${x}>`)})`);

        const price = interaction.options.getInteger("price");
        if(price < config.auction_start) return interaction.editReply(`You can't sell less than \`$${numberWithCommas(config.auction_start)}\` coins.`);

        const your = await Money.findOne({ id: interaction.guild.id, user: interaction.user.id });
        const auction = await Auction.findOne({ id: interaction.guild.id, user: interaction.user.id }).countDocuments();
        if(auction >= config.auction_max) return interaction.editReply(`You can't have more than \`${config.auction_max}\` auctions.`);

        const Tax = price * config.auction_tax;
        if(your.money < Tax) return interaction.editReply(`You can't have less than \`$${formatNumber(Tax.toString())}\` to pay the tax.`);

        const FullTax = price - Tax;

        const roles = client.guilds.cache.get(interaction.guild.id).roles.cache.find(r => r.id === role.id);
        const alreadyHave = interaction.member.roles.cache.find(r => r.id === roles.id);
        if(!alreadyHave) return interaction.editReply("You don't have this role.");

        const id = Math.floor(Math.random() * 1000000);

        const embed = new EmbedBuilder()
            .setAuthor({ name: `${interaction.user.tag}`, iconURL: interaction.user.avatarURL({ dynamic: true }) })
            .setThumbnail(interaction.user.avatarURL({ dynamic: true }))
            .addFields([
                { name: "Role:", value: `${role.name}`, inline: true },
                { name: "Price:", value: `${formatNumber(price.toString())}`, inline: true },
                { name: "Seller:", value: `${interaction.user}`, inline: true },
                { name: "Buyer:", value: `No Body`, inline: true }
            ])
            .setColor("Green")
            .setFooter({ text: `ID: ${id}`})
            .setTimestamp();

        const channel = client.channels.cache.get(config.forum_id);
        const thread = await channel.threads.create({
            name: `[SELLING] Role: ${role.name} Price: ${formatNumber(FullTax.toString())} ID: ${id}`,
            message: {
                content: `**No one has bought the product yet.** | ${role}`, 
                embeds: [embed]
            },
            appliedTags: [config.sell_tag_id]
        });
  
        const item = new Auction({
            id: interaction.guild.id,
            uuid: id,
            name: role.name,
            price: price,
            seller: interaction.user.id,
            post: thread.id,
            message: thread.lastMessageId
        });

        await item.save();
        your.money -= Tax;
        await your.save();

        await interaction.editReply(`You have successfully sold the \`${role.name}\` role for \`$${formatNumber(FullTax.toString())}\` (Tax: \`-$${formatNumber(Tax.toString())}\`)`);
        await interaction.member.roles.remove(roles);
    }
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}