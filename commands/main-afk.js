const {
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "afk",
    category: "main",
    code: async (ctx) => {
        const [userLanguage] = await Promise.all([
            global.db.get(`user.${ctx.sender.jid.replace(/@.*|:.*/g, "")}.language`)
        ]);

        const input = ctx.args.join(" ") || null;

        try {
            const reason = input || "tanpa alasan";
            global.db.set(`user.${ctx.sender.jid.replace(/@.*|:.*/g, "")}.afk`, {
                reason: reason,
                timeStamp: Date.now()
            });

            return ctx.reply(quote(`📴 ${await global.tools.msg.translate(`Anda sekarang akan AFK dengan alasan`, userLanguage)} ${reason}.`));
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(quote(`⚠ ${await global.tools.msg.translate("Terjadi kesalahan", userLanguage)}: ${error.message}`));
        }
    }
};