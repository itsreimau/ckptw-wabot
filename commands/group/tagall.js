const {
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "tagall",
    category: "group",
    handler: {
        admin: true,
        group: true
    },
    code: async (ctx) => {
        if (await handler(ctx, module.exports.handler)) return;

        const input = ctx.args.join(" ") || "Saya tidak tahu harus mengetik apa...";

        try {
            const members = await ctx.group().members();
            const mentions = members.map(m => {
                const serialized = m.id.split("@")[0];
                return {
                    tag: `@${serialized}`,
                    mention: m.id
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