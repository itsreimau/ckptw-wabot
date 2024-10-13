const {
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "fixdb",
    aliases: ["fixdatabase"],
    category: "owner",
    handler: {
        owner: true,
    },
    code: async (ctx) => {
        const {
            status,
            message
        } = await global.handler(ctx, module.exports.handler);
        if (status) return ctx.reply(message);

        try {
            const now = new Date();
            const oneYearAgo = new Date(now.setFullYear(now.getFullYear() - 1));

            const dbJSON = global.db.toJSON();
            const users = dbJSON.user || {};
            const groups = dbJSON.group || {};

            const isValidNumber = (number) => {
                return /^[0-9]{10,15}$/.test(number);
            };

            const isOldLastUse = (lastUse) => {
                const lastUseDate = new Date(lastUse);
                return lastUseDate < oneYearAgo;
            };

            Object.keys(users).forEach((user) => {
                const userData = users[user];
                if (!isValidNumber(user)) {
                    global.db.delete(`user.${user}`);
                } else if (isOldLastUse(userData.lastUse)) {
                    global.db.delete(`user.${user}`);
                }
            });

            Object.keys(groups).forEach((group) => {
                if (!isValidNumber(group)) {
                    global.db.delete(`group.${group}`);
                }
            });

            return ctx.reply(quote(`✅ Basis data berhasil diperbaiki!`));
        } catch (error) {
            console.error(`[${global.config.pkg.name}] Error:`, error);
            return ctx.reply(quote(`❎ Terjadi kesalahan: ${error.message}`));
        }
    },
};