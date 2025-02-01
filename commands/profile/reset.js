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
        try {
            await ctx.reply(quote("🤖 Apakah Anda yakin ingin mereset data Anda? Langkah ini akan menghapus seluruh data yang tersimpan dan tidak dapat dikembalikan. Ketik 'y' untuk melanjutkan atau 'n' untuk membatalkan."));

            const collector = ctx.MessageCollector({
                time: 60000
            });

            collector.on("collect", async (m) => {
                const userAnswer = m.content.trim().toUpperCase();
                const senderId = tools.general.getID(ctx.sender.jid);

                if (userAnswer === "Y") {
                    db.delete(`user.${senderId}`);
                    await ctx.reply(quote("✅ Data Anda berhasil direset. Semua data telah dihapus!"));
                    collector.stop();
                } else if (userAnswer === "N") {
                    await ctx.reply(quote("❌ Proses reset data telah dibatalkan."));
                    collector.stop();
                }
            });

            collector.on("end", async () => {});
        } catch (error) {
            consolefy.error(`Error: ${error}`);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};