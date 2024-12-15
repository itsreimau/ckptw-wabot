const {
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "afk",
    category: "profile",
    handler: {},
    code: async (ctx) => {
        if (await handler(ctx, module.exports.handler)) return;

        const input = ctx.args.join(" ") || null;

        try {
            db.set(`user.${ctx.sender.jid.split(/[:@]/)[0]}.afk`, {
                reason: input,
                timeStamp: Date.now()
            });

            return await ctx.reply(quote(`📴 Anda akan AFK, ${input ? `dengan alasan ${input}` : "tanpa alasan apapun"}.`));
        } catch (error) {
            console.error(`[${config.pkg.name}] Error:`, error);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};