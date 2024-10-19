const {
    bold,
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const mime = require("mime-types");

module.exports = {
    name: "youtubesearch",
    aliases: ["ytsearch", "yts"],
    category: "search",
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
        if (status) return await ctx.reply(message);

        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(global.tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(global.tools.msg.generateCommandExample(ctx._used.prefix + ctx._used.command, "evangelion"))
        );

        try {
            const apiUrl = global.tools.api.createUrl("itzpire", "/search/youtube", {
                message: input
            });
            const {
                data
            } = (await axios.get(apiUrl)).data;

            const resultText = data.map((d) => {
                switch (d.type) {
                    case "video":
                        return `${quote(bold(`${d.title} (${d.url})`))}\n` +
                            `${quote(`Durasi: ${d.timestamp}`)}\n` +
                            `${quote(`Diunggah: ${d.ago}`)}\n` +
                            `${quote(`Dilihat: ${d.views}`)}`;
                    case "channel":
                        return `${quote(bold(`${d.name} (${d.url})`))}\n` +
                            `${quote(`Subscriber: ${d.subCountLabel} (${d.subCount})`)}\n` +
                            `${quote(`Jumlah video: ${d.videoCount}`)}`;
                }
            }).filter((d) => d).join(
                "\n" +
                `${quote("─────")}\n`
            );
            return await ctx.reply(
                `${resultText}\n` +
                "\n" +
                global.config.msg.footer
            );
        } catch (error) {
            console.error(`[${global.config.pkg.name}] Error:`, error);
            if (error.status !== 200) return await ctx.reply(global.config.msg.notFound);
            return await ctx.reply(quote(`❎ Terjadi kesalahan: ${error.message}`));
        }
    }
};