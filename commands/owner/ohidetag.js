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
        if (await handler(ctx, module.exports.handler)) return;

        const input = ctx.args.join(" ") || "Saya tidak tahu harus mengetik apa...";

        try {
            const members = await ctx.group().members();
            const mentions = members.map(m => m.id);

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