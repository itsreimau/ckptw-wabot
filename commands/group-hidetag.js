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
    code: async (ctx) => {
        const [userLanguage] = await Promise.all([
            global.db.get(`user.${ctx.sender.jid.replace(/@.*|:.*/g, "")}.language`)
        ]);

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

            const input = ctx.args.join(" ") || "@everyone";
            const data = await ctx.group().members();
            const mentions = data.map(member => `${member.id.replace(/@.*|:.*/g, "")}S_WHATSAPP_NET`);

            return ctx.reply({
                text: input,
                mentions
            });
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(quote(`⚠ ${await global.tools.msg.translate("Terjadi kesalahan", userLanguage)}: ${error.message}`));
        }
    }
};