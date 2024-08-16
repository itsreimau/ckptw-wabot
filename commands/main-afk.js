const {
    bold,
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "afk",
    category: "main",
    code: async (ctx) => {
        const input = ctx._args.join(" ") || null;

        try {
            const reason = input || "tanpa alasan";
            global.db.set(`user.${ctx._sender.jid.split("@")[0]}.afk`, {
                reason: reason,
                timeStamp: Date.now()
            });

            return ctx.reply(quote(`⚠ Anda sekarang akan AFK dengan alasan ${reason}.`));
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(quote(`⚠ Terjadi kesalahan: ${error.message}`));
        }
    }
};