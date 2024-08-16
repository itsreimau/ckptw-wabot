const {
    bold,
    quote
} = require("@mengkodingan/ckptw");
const {
    S_WHATSAPP_NET
} = require("@whiskeysockets/baileys");

module.exports = {
    name: "hidetag",
    aliases: ["ht"],
    category: "group",
    code: async (ctx) => {
        try {
            const {
                status,
                message
            } = await global.handler(ctx, {
                admin: true,
                banned: true,
                group: true
            });

            if (status) return ctx.reply(message);

            const input = ctx._args.join(" ") || "@everyone";
            const data = await ctx.group().members();
            const mentions = data.map(member => `${member.id.split("@")[0]}S_WHATSAPP_NET`);

            return ctx.reply({
                text: input,
                mentions
            });
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(quote(`${bold("[ ! ]")} Terjadi kesalahan: ${error.message}`));
        }
    }
};