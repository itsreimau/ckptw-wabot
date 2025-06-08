const {
    quote
} = require("@itsreimau/ckptw-mod");
const axios = require("axios");

module.exports = {
    name: "youtubesummarizer",
    aliases: ["ytsummarizer"],
    category: "ai-misc",
    permissions: {
        premium: true
    },
    code: async (ctx) => {
        const url = ctx.args[0] || null;

        if (!url) return await ctx.reply(
            `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(tools.msg.generateCommandExample(ctx.used, "https://example.com/"))
        );

        const isUrl = await tools.cmd.isUrl(url);
        if (!isUrl) return await ctx.reply(config.msg.urlInvalid);

        try {
            const apiUrl = tools.api.createUrl("paxsenix", "/ai-tools/youtube-summarizer", {
                url
            });
            const result = (await axios.get(apiUrl)).data;

            const resultText = await Promise.all(
                result.keyPoints.map(r =>
                    `${quote(`Poin: ${ctx.sender.jid.startsWith("62") ? await tools.cmd.translate(r.point, "id") : r.point}`)}\n` +
                    `${quote(ctx.sender.jid.startsWith("62") ? await tools.cmd.translate(r.summary, "id") : r.summary)}`
                )).join(
                "\n" +
                `${quote("─────")}\n`
            );
            return await ctx.reply(
                `${quote(ctx.sender.jid.startsWith("62") ? await tools.cmd.translate(result.summary, "id") : result.summary )}\n` +
                `${quote("─────")}\n` +
                `${resultText}\n` +
                "\n" +
                config.msg.footer
            );
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};