const {
    bold,
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");

module.exports = {
    name: "youtubesearch",
    aliases: ["youtube", "youtubes", "yt", "yts", "ytsearch"],
    category: "search",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(tools.cmd.generateInstruction(["send"], ["text"]))}\n` +
            quote(tools.cmd.generateCommandExample(ctx.used, "evangelion"))
        );

        try {
            const apiUrl = tools.api.createUrl("agatz", "/api/ytsearch", {
                message: input
            });
            const result = (await axios.get(apiUrl)).data.data;

            const resultText = result.map((r) => {
                switch (r.type) {
                    case "video":
                        return `${quote(`Judul: ${r.title}`)}\n` +
                            `${quote(`Durasi: ${r.timestamp}`)}\n` +
                            `${quote(`Diunggah: ${r.ago}`)}\n` +
                            `${quote(`Ditonton: ${r.views}`)}\n` +
                            `${quote(`URL: ${r.url}`)}`;
                    case "channel":
                        return `${quote(`Saluran: ${r.title}`)}\n` +
                            `${quote(`Subscriber: ${r.subCountLabel} (${r.subCount})`)}\n` +
                            `${quote(`Jumlah video: ${r.videoCount}`)}\n` +
                            `${quote(`URL: ${r.url}`)}`;
                }
            }).filter((r) => r).join(
                "\n" +
                `${quote("─────")}\n`
            );
            return await ctx.reply(
                `${resultText}\n` +
                "\n" +
                config.msg.footer
            );
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};