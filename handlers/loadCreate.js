const Money = require("../settings/models/Money.js");
const Typing = require("../settings/models/Typing");
const Profile = require("../settings/models/Profile.js");
const Roulette = require("../settings/models/Roulette.js");

module.exports = async (client) => {
    client.createMoney = async function (guildId, userId) {
        const load = await Money.findOne({ id: guildId, user: userId });
        if (!load) {
            const create = new Money({
                id: guildId,
                user: userId,
                money: 1000000,
                rebirth: 0,
                win: 0,
                bank: 0,
                boost: 0
            });
            await create.save();
        }
    }

    client.createChannel = async function (guildId) {
        const load = await Typing.findOne({ id: guildId });
        if (!load) {
            const create = new Typing({
                id: guildId,
                enable: false,
                channel: "",
                message: "",
                word: "",
                members: []
            });
            await create.save();
        }
    }

    client.createProfile = async function (guildId, userId) {
        const load = await Profile.findOne({ id: guildId, user: userId });
        if (!load) {
            const create = new Profile({
                id: guildId,
                user: userId,
                point: 0,
                word: "",
                date: 0
            });
            await create.save();
        }
    }

    client.createRoulette = async function (guildId) {
        const roulette = await Roulette.findOne({ id: guildId });
        if (!roulette) {
            const newRoulette = new Roulette({
                id: guildId,
                roulette: false,
                history: [],
                space: [],
                data: [],
                time_remaining: 30,
                time: 0,
                time_limit: 0,
            });
            await newRoulette.save();
        }
    }

    require("./Typing/loadMain.js")(client);
}