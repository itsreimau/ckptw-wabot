module.exports = {
    name: "reset",
    category: "profile",
    permissions: {
        private: true
    },
    code: async (ctx) => {
        await ctx.reply(formatter.quote(`🤖 Apakah kamu yakin ingin mereset datamu? Langkah ini akan menghapus seluruh data yang tersimpan dan tidak dapat dikembalikan. Ketik ${formatter.monospace("y")} untuk melanjutkan atau ${formatter.monospace("n")} untuk membatalkan.`));

        try {
            const collector = ctx.MessageCollector({
                time: 60000
            });

            collector.on("collect", async (m) => {
                const content = m.content.trim().toLowerCase();
                const senderId = ctx.getId(ctx.sender.jid);

                if (content === "y") {
                    await ctx.reply(formatter.quote("✅ Data-mu berhasil direset, semua data telah dihapus!"));
                    return collector.stop();
                } else if (content === "n") {
                    await ctx.reply(formatter.quote("❌ Proses reset data telah dibatalkan."));
                    return collector.stop();
                }
            });
        } catch (error) {
            return await tools.cmd.handleError(ctx, error);
        }
    }
};