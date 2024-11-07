const {
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "afk",
    category: "profile",
    handler: {
        banned: true,
        cooldown: true
    },
    code: async (ctx) => {
        const status = await handler(ctx, module.exports.handler);
        if (status) return;

        const input = ctx.args.join(" ") || null;

        try {
            const reason = input || "tanpa alasan";
            db.set(`user.${ctx.sender.jid.split(/[:@]/)[0]}.afk`, {
                reason: reason,
                timeStamp: Date.now()
            });

            return await ctx.reply(quote(`📴 Anda sekarang akan AFK dengan alasan ${reason}.`));
        } catch (error) {
            console.error(`[${config.pkg.name}] Error:`, error);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};