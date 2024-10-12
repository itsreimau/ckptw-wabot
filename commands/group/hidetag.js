const {
    quote
} = require("@mengkodingan/ckptw");
const {
    S_WHATSAPP_NET
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
        global.handler(ctx, module.exports.handler).then(({
            status,
            message
        }) => status && ctx.reply(message));

        try {
            const input = ctx.args.join(" ") || "@everyone";
            const data = await ctx.group().members();
            const mentions = data.map(member => `${member.id.split("@")[0]}S_WHATSAPP_NET`);

            return ctx.reply({
                text: input,
                mentions
            });
        } catch (error) {
            console.error(`[${global.config.pkg.name}] Error:`, error);
            return ctx.reply(quote(`❎ Terjadi kesalahan: ${error.message}`));
        }
    }
};