const {
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "afk",
    category: "profile",
    code: async (ctx) => {
        const {
            status,
            message
        } = await global.handler(ctx, {
            banned: true,
            cooldown: true
        });
        if (status) return ctx.reply(message);

        const input = ctx.args.join(" ") || null;

        try {
            const reason = input || "tanpa alasan";
            global.db.set(`user.${ctx.sender.jid.replace(/@.*|:.*/g, "")[0]}.afk`, {
                reason: reason,
                timeStamp: Date.now()
            });

            return ctx.reply(quote(`📴 Anda sekarang akan AFK dengan alasan ${reason}.`));
        } catch (error) {
            console.error(`[${global.config.pkg.name}] Error:`, error);
            return ctx.reply(quote(`❎ Terjadi kesalahan: ${error.message}`));
        }
    }
};