const {
    getRandomElement
} = require("../tools/general.js");
const {
    bold,
    monospace,
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "bcgc",
    aliases: ["broadcastgc"],
    category: "owner",
    code: async (ctx) => {
        const {
            status,
            message
        } = await global.handler(ctx, {
            owner: true
        });
        if (status) return ctx.reply(message);

        const input = ctx._args.join(" ") || null;

        if (!input) return ctx.reply(
            `${quote(global.msg.argument)}\n` +
            quote(`Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} halo!`)}`)
        );

        try {
            const delay = (time) => new Promise((res) => setTimeout(res, time));
            const getGroups = await ctx._client.groupFetchAllParticipating();
            const groups = Object.entries(getGroups).slice(0).map((entry) => entry[1]);
            const anu = groups.map((a) => a.id);

            ctx.reply(quote(`${bold("[ ! ]")} Mengirim siaran ke ${anu.length} obrolan grup, perkiraan waktu penyelesaian adalah ${(anu.length * 0, 5)} detik.`));

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

            return ctx.reply(quote(`${bold("[ ! ]")} Berhasil mengirimkan siaran ke ${anu.length} obrolan grup.`));
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(quote(`${bold("[ ! ]")} Terjadi kesalahan: ${error.message}`));
        }
    }
};