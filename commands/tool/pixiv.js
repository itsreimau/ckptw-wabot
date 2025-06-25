const axios = require("axios");
const mime = require("mime-types");

module.exports = {
    name: "pixiv",
    category: "tool",
    permissions: {
        premium: 10
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${formatter.quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            formatter.quote(tools.msg.generateCmdExample(ctx.used, "moon"))
        );

        try {
            const apiUrl = tools.api.createUrl("nekorinn", "/search/pixiv", {
                q: input
            });
            const result = tools.cmd.getRandomElement((await axios.get(apiUrl)).data.result).imageUrl;

            return await ctx.reply({
                image: {
                    url: result
                },
                mimetype: mime.lookup("jpg"),
                caption: `${formatter.quote(`Kueri: ${input}`)}\n` +
                    "\n" +
                    config.msg.footer
            });
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};