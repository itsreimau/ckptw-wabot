const {
    quote
} = require("@mengkodingan/ckptw");
const {
    S_WHATSAPP_NET
} = require("@whiskeysockets/baileys");

module.exports = {
    name: "otagall",
    category: "owner",
    code: async (ctx) => {
        const [userLanguage] = await Promise.all([
            global.db.get(`user.${ctx.sender.jid.replace(/@.*|:.*/g, "")}.language`)
        ]);

        const {
            status,
            message
        } = await global.handler(ctx, {
            group: true,
            owner: true
        });
        if (status) return ctx.reply(message);

        const input = ctx.args.join(" ") || null;

        try {
            const data = await ctx.group().members();
            const len = data.length;
            const mentions = [];
            for (let i = 0; i < len; i++) {
                const serialized = data[i].id.replace(/@.*|:.*/g, "");
                mentions.push({
                    tag: `@${serialized}`,
                    mention: serialized + S_WHATSAPP_NET
                });
            }
            const mentionText = mentions.map((mention) => mention.tag).join(" ");

            return ctx.reply({
                text: `${input || "Halo Dunia!"}\n` +
                    `─────\n` +
                    `${mentionText}`,
                mentions: mentions.map((mention) => mention.mention)
            });
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(quote(`⚠ ${await global.tools.msg.translate("Terjadi kesalahan", userLanguage)}: ${error.message}`));
        }
    }
};