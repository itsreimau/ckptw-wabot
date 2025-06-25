const axios = require("axios");

module.exports = {
    name: "youtubetranscript",
    aliases: ["yttranscript"],
    category: "tool",
    permissions: {
        premium: true
    },
    code: async (ctx) => {
        const url = ctx.args[0] || null;

        if (!url) return await ctx.reply(
            `${formatter.quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            formatter.quote(tools.msg.generateCmdExample(ctx.used, "https://youtube.com/watch?v=v18fHSc813k"))
        );

        const isUrl = await tools.cmd.isUrl(url);
        if (!isUrl) return await ctx.reply(config.msg.urlInvalid);

        try {
            const apiUrl = tools.api.createUrl("archive", "/api/tools/youtube-transkrip", {
                url
            });
            const result = (await axios.get(apiUrl)).data.subtitle;

            return await ctx.reply(result);
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};