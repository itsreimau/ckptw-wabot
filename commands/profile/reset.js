const {
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "reset",
    category: "profile",
    permissions: {
        private: true
    },
    code: async (ctx) => {
        await ctx.reply(quote("🤖 Apakah Anda yakin ingin mereset data Anda? Langkah ini akan menghapus seluruh data yang tersimpan dan tidak dapat dikembalikan. Ketik 'y' untuk melanjutkan atau 'n' untuk membatalkan."));

        try {
            const collector = ctx.MessageCollector({
                time: 60000
            });

            collector.on("collect", async (m) => {
                const message = m.content.trim().toLowerCase();
                const senderId = tools.general.getID(ctx.sender.jid);

                if (message === "y") {
                    await db.delete(`user.${senderId}`);
                    await ctx.reply(quote("✅ Data Anda berhasil direset. Semua data telah dihapus!"));
                    collector.stop();
                } else if (message === "n") {
                    await ctx.reply(quote("❌ Proses reset data telah dibatalkan."));
                    collector.stop();
                }
            });

            collector.on("end", async () => {});
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, false);
        }
    }
};