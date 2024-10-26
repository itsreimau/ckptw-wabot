const {
    quote
} = require("@mengkodingan/ckptw");
const {
    S_WHATSAPP_NET
} = require("@whiskeysockets/baileys");

module.exports = {
    name: "tagall",
    category: "group",
    handler: {
        admin: true,
        banned: true,
        cooldown: true,
        group: true
    },
    code: async (ctx) => {
        const {
            status,
            message
        } = await handler(ctx, module.exports.handler);
        if (status) return await ctx.reply(message);

        const input = ctx.args.join(" ") || "Hai!";

        try {
            const members = await ctx.group().members();
            const mentions = members.map(member => {
                const serialized = member.id.split(/[:@]/)[0];
                return {
                    tag: `@${serialized}`,
                    mention: serialized + S_WHATSAPP_NET
                };
            });

            const mentionText = mentions.map(m => m.tag).join(" ");
            return await ctx.reply({
                text: `${input}\n` +
                    `${config.msg.readmore}─────\n` +
                    `${mentionText}`,
                mentions: mentions.map(m => m.mention)
            });
        } catch (error) {
            console.error(`[${config.pkg.name}] Error:`, error);
            return await ctx.reply(quote(`❎ Terjadi kesalahan: ${error.message}`));
        }
    }
};