const {
    getRandomElement
} = require("../tools/simple.js");
const {
    bold,
    monospace
} = require("@mengkodingan/ckptw");
const fg = require("api-dylux");

module.exports = {
    name: "bcgc",
    aliases: ["broadcastgc"],
    category: "owner",
    code: async (ctx) => {
        const handlerObj = await global.handler(ctx, {
            owner: true
        });

        if (handlerObj.status) return ctx.reply(handlerObj.message);

        const input = ctx._args.join(" ");

        if (!input) return ctx.reply(
            `${global.msg.argument}\n` +
            `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} halo!`)}`
        );

        try {
            const delay = (time) => new Promise((res) => setTimeout(res, time));
            const getGroups = await ctx._client.groupFetchAllParticipating();
            const groups = Object.entries(getGroups)
                .slice(0)
                .map((entry) => entry[1]);
            const anu = groups.map((a) => a.id);

            ctx.reply(`Mengirim siaran ke ${anu.length} obrolan grup, perkiraan waktu penyelesaian adalah ${(anu.length * 0, 5)} detik.`);

            for (let i of anu) {
                await delay(500);
                const thumbnail = await fg.googleImage("rei ayanami wallpaper");

                await ctx.sendMessage(i, {
                    text: input,
                    contextInfo: {
                        forwardingScore: 1000,
                        isForwarded: true,
                        externalAdReply: {
                            title: "B R O A D C A S T",
                            body: null,
                            thumbnailUrl: getRandomElement(thumbnail) || global.bot.thumbnail,
                            sourceUrl: global.bot.groupChat,
                            mediaType: 1,
                            renderLargerThumbnail: true,
                        },
                    }
                });
            }

            return ctx.reply(`Berhasil mengirimkan siaran ke ${anu.length} obrolan grup.`);
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(`${bold("[ ! ]")} Terjadi kesalahan: ${error.message}`);
        }
    }
};