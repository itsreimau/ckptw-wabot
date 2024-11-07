const {
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "ohidetag",
    aliases: ["oht"],
    category: "owner",
    handler: {
        group: true,
        owner: true
    },
    code: async (ctx) => {
        const status = await handler(ctx, module.exports.handler);
        if (status) return;

        const input = ctx.args.join(" ") || "@everyone";

        try {
            const members = await ctx.group().members();
            const mentions = members.map(member => `${member.id.split(/[:@]/)[0]}@s.whatsapp.net`);

            return await ctx.reply({
                text: input,
                mentions
            });
        } catch (error) {
            console.error(`[${config.pkg.name}] Error:`, error);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};