const {
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "otagall",
    category: "owner",
    handler: {
        group: true,
        owner: true
    },
    code: async (ctx) => {
        const status = await handler(ctx, module.exports.handler);
        if (status) return;

        const input = ctx.args.join(" ") || "Hai!";

        try {
            const members = await ctx.group().members();
            const mentions = members.map(member => {
                const serialized = member.id.split(/[:@]/)[0];
                return {
                    tag: `@${serialized}`,
                    mention: `${serialized}@s.whatsapp.net`
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
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};