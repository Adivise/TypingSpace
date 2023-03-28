const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

const LeadPage = async (client, message, pages, timeout, memberCount) => {
    if (!message && !message.channel) throw new Error('Channel is inaccessible.');
    if (!pages) throw new Error('Pages are not given.');

    const row1 = new ButtonBuilder()
        .setCustomId('back')
        .setLabel('⬅')
        .setStyle(ButtonStyle.Primary)
    const row2 = new ButtonBuilder()
        .setCustomId('next')
        .setLabel('➡')
        .setStyle(ButtonStyle.Primary)
    const row = new ActionRowBuilder()
        .addComponents(row1, row2)

    let page = 0;
    const curPage = await message.editReply({ embeds: [pages[page].setFooter({ text: `Page • ${page + 1}/${pages.length} | ${clanLength} • Total Members`})], components: [row], allowedMentions: { repliedUser: false } });
    if(pages.length == 0) return;

    const filter = (m) => m.user.id === message.user.id;
    const collector = await curPage.createMessageComponentCollector({ filter, time: timeout });

    collector.on('collect', async (interaction) => {
            if(!interaction.deferred) await interaction.deferUpdate();
            if (interaction.customId === 'back') {
                page = page > 0 ? --page : pages.length - 1;
            } else if (interaction.customId === 'next') {
                page = page + 1 < pages.length ? ++page : 0;
            }
            curPage.edit({ embeds: [pages[page].setFooter({ text: `Page • ${page + 1}/${pages.length} | ${memberCount} • Total Members` })], components: [row] })
        });
    collector.on('end', () => {
        const disabled = new ActionRowBuilder()
            .addComponents(row1.setDisabled(true), row2.setDisabled(true))
        curPage.edit({ embeds: [pages[page].setFooter({ text: `Page • ${page + 1}/${pages.length} | ${memberCount} • Total Members` })], components: [disabled] })
    });
    return curPage;
};

const AuctionGlobal = async (client, message, pages, timeout, auctionCount) => {
    if (!message && !message.channel) throw new Error('Channel is inaccessible.');
    if (!pages) throw new Error('Pages are not given.');

    const row1 = new ButtonBuilder()
        .setCustomId('back')
        .setLabel('⬅')
        .setStyle(ButtonStyle.Primary)
    const row2 = new ButtonBuilder()
        .setCustomId('next')
        .setLabel('➡')
        .setStyle(ButtonStyle.Primary)
    const row = new ActionRowBuilder()
        .addComponents(row1, row2)

    let page = 0;
    const curPage = await message.editReply({ embeds: [pages[page].setFooter({ text: `Page • ${page + 1}/${pages.length} | ${auctionCount} • Total Auctions`})], components: [row], allowedMentions: { repliedUser: false } });
    if(pages.length == 0) return;

    const filter = (m) => m.user.id === message.user.id;
    const collector = await curPage.createMessageComponentCollector({ filter, time: timeout });

    collector.on('collect', async (interaction) => {
            if(!interaction.deferred) await interaction.deferUpdate();
            if (interaction.customId === 'back') {
                page = page > 0 ? --page : pages.length - 1;
            } else if (interaction.customId === 'next') {
                page = page + 1 < pages.length ? ++page : 0;
            }
            curPage.edit({ embeds: [pages[page].setFooter({ text: `Page • ${page + 1}/${pages.length} | ${auctionCount} • Total Auctions` })], components: [row] })
        });
    collector.on('end', () => {
        const disabled = new ActionRowBuilder()
            .addComponents(row1.setDisabled(true), row2.setDisabled(true))
        curPage.edit({ embeds: [pages[page].setFooter({ text: `Page • ${page + 1}/${pages.length} | ${auctionCount} • Total Auctions` })], components: [disabled] })
    });
    return curPage;
};

const AuctionPerson = async (client, message, pages, timeout, auctionCount) => {
    if (!message && !message.channel) throw new Error('Channel is inaccessible.');
    if (!pages) throw new Error('Pages are not given.');

    const row1 = new ButtonBuilder()
        .setCustomId('back')
        .setLabel('⬅')
        .setStyle(ButtonStyle.Primary)
    const row2 = new ButtonBuilder()
        .setCustomId('next')
        .setLabel('➡')
        .setStyle(ButtonStyle.Primary)
    const row = new ActionRowBuilder()
        .addComponents(row1, row2)

    let page = 0;
    const curPage = await message.editReply({ embeds: [pages[page].setFooter({ text: `Page • ${page + 1}/${pages.length} | ${auctionCount} • Total Items`})], components: [row], allowedMentions: { repliedUser: false } });
    if(pages.length == 0) return;

    const filter = (m) => m.user.id === message.user.id;
    const collector = await curPage.createMessageComponentCollector({ filter, time: timeout });

    collector.on('collect', async (interaction) => {
            if(!interaction.deferred) await interaction.deferUpdate();
            if (interaction.customId === 'back') {
                page = page > 0 ? --page : pages.length - 1;
            } else if (interaction.customId === 'next') {
                page = page + 1 < pages.length ? ++page : 0;
            }
            curPage.edit({ embeds: [pages[page].setFooter({ text: `Page • ${page + 1}/${pages.length} | ${auctionCount} • Total Items` })], components: [row] })
        });
    collector.on('end', () => {
        const disabled = new ActionRowBuilder()
            .addComponents(row1.setDisabled(true), row2.setDisabled(true))
        curPage.edit({ embeds: [pages[page].setFooter({ text: `Page • ${page + 1}/${pages.length} | ${auctionCount} • Total Items` })], components: [disabled] })
    });
    return curPage;
};

module.exports = { LeadPage, AuctionGlobal, AuctionPerson };