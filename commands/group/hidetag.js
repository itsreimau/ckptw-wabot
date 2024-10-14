const {
    quote
} = require("@mengkodingan/ckptw");
const {
    jidDecode,
    jidEncode
} = require("@whiskeysockets/baileys");

module.exports = {
    name: "hidetag",
    aliases: ["ht"],
    category: "group",
    handler: {
        admin: true,
        banned: true,
        group: true
    },
    code: async (ctx) => {
        const {
            status,
            message
        } = await global.handler(ctx, module.exports.handler);
        if (status) return ctx.reply(message);

        try {
            const data = await ctx.group().members();
            const len = data.length;
            const mentions = [];
            for (let i = 0; i < len; i++) {
                const idDecode = await jidDecode(data[i].id);
                const mention = jidEncode(idDecode.user + idDecode.server);
                mentions.push({
                    mention
                });
            }

            return ctx.reply({
                text: input || "@everyone",
                mentions: mentions.map((mention) => mention.mention)
            });
        } catch (error) {
            console.error(`[${global.config.pkg.name}] Error:`, error);
            return ctx.reply(quote(`❎ Terjadi kesalahan: ${error.message}`));
        }
    }
};