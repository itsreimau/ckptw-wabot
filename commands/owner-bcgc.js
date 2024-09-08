const {

    monospace,
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "bcgc",
    aliases: ["broadcastgc"],
    category: "owner",
    code: async (ctx) => {
        const [userLanguage] = await Promise.all([
            global.db.get(`user.${ctx.sender.jid.replace(/@.*|:.*/g, "")}.language`)
        ]);

        const {
            status,
            message
        } = await global.handler(ctx, {
            owner: true
        });
        if (status) return ctx.reply(message);

        const input = ctx.args.join(" ") || null;

        if (!input) return ctx.reply(
            `${quote(`📌 ${await global.tools.msg.translate(global.msg.argument, userLanguage)}`)}\n` +
            quote(`${await global.tools.msg.translate("Contoh", userLanguage)}: ${monospace(`${ctx._used.prefix + ctx._used.command} halo!`)}`)
        );

        try {
            const delay = (time) => new Promise((res) => setTimeout(res, time));
            const getGroups = await ctx._client.groupFetchAllParticipating();
            const groups = Object.entries(getGroups).slice(0).map((entry) => entry[1]);
            const anu = groups.map((a) => a.id);

            ctx.reply(quote(`⚠ ${await global.tools.msg.translate(`Mengirim siaran ke ${anu.length} obrolan grup, perkiraan waktu penyelesaian adalah ${(anu.length * 0, 5)} detik.`, userLanguage)}`));

            for (let i of anu) {
                await delay(500);

                await ctx.sendMessage(i, {
                    text: input,
                    contextInfo: {
                        externalAdReply: {
                            mediaType: 1,
                            previewType: 0,
                            mediaUrl: global.bot.groupChat,
                            title: "B R O A D C A S T",
                            body: null,
                            renderLargerThumbnail: true,
                            thumbnailUrl: global.bot.thumbnail,
                            sourceUrl: global.bot.groupChat
                        },
                        forwardingScore: 9999,
                        isForwarded: true
                    }
                });
            }

            return ctx.reply(quote(`✅ ${await global.tools.msg.translate(`Berhasil mengirimkan siaran ke ${anu.length} obrolan grup.`, userLanguage)}`));
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(quote(`⚠ ${await global.tools.msg.translate("Terjadi kesalahan", userLanguage)}: ${error.message}`));
        }
    }
};