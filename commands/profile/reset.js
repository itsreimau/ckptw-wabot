const {
    monospace,
    quote
} = require("@itsreimau/ckptw-mod");

module.exports = {
    name: "reset",
    category: "profile",
    permissions: {
        private: true
    },
    code: async (ctx) => {
        await ctx.reply(quote(`🤖 Apakah Anda yakin ingin mereset data Anda? Langkah ini akan menghapus seluruh data yang tersimpan dan tidak dapat dikembalikan. Ketik ${monospace("y")} untuk melanjutkan atau ${monospace("n")} untuk membatalkan.`));

        try {
            const collector = ctx.MessageCollector({
                time: 60000
            });

            collector.on("collect", async (m) => {
                const message = m.content.trim().toLowerCase();
                const senderId = tools.cmd.getID(ctx.sender.jid);

                if (message === "y") {
                    const isPremium = await db.get(`user.${senderId}.premium`);
                    await db.delete(`user.${senderId}`);
                    if (isPremium) await db.set(`user.${senderId}.premium`, true);
                    await ctx.reply(quote("✅ Data Anda berhasil direset. Semua data telah dihapus!"));
                    collector.stop();
                } else if (message === "n") {
                    await ctx.reply(quote("❌ Proses reset data telah dibatalkan."));
                    collector.stop();
                }
            });
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, false);
        }
    }
};