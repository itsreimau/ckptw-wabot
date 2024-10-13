const {
    bold,
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const mime = require("mime-types");

module.exports = {
    name: "spotifysearch",
    aliases: ["stsearch"],
    category: "tools",
    handler: {
        banned: true,
        cooldown: true,
        coin: [10, "text", 1]
    },
    code: async (ctx) => {
        const {
            status,
            message
        } = await global.handler(ctx, module.exports.handler);
        if (status) return ctx.reply(message);

        const input = ctx.args.join(" ") || null;

        if (!input) return ctx.reply(
            `${quote(global.tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(global.tools.msg.generateCommandExample(ctx._used.prefix + ctx._used.command, "neon genesis evangelion"))
        );

        try {
            const apiUrl = global.tools.api.createUrl("https://spotifyapi.caliphdev.com", "/api/search/tracks", {
                q: input
            });
            const {
                data
            } = await axios.get(apiUrl);

            const resultText = data.map((d) => {
                return `${quote(bold(`${d.title} (${d.url})`))}\n` +
                    `${quote(`Artis: ${d.artist}`)}\n` +
                    `${quote(`Album: ${d.album}`)}\n` +
                    `${quote(`Durasi: ${d.duration}`)}`;
            }).join(
                "\n" +
                `${quote("─────")}\n`
            );
            return ctx.reply(
                `${resultText}\n` +
                "\n" +
                global.config.msg.footer
            );
        } catch (error) {
            console.error(`[${global.config.pkg.name}] Error:`, error);
            if (error.status !== 200) return ctx.reply(global.config.msg.notFound);
            return ctx.reply(quote(`❎ Terjadi kesalahan: ${error.message}`));
        }
    }
};