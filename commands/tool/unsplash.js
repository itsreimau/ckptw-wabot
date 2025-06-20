const {
    quote
} = require("@itsreimau/ckptw-mod");
const axios = require("axios");
const mime = require("mime-types");

module.exports = {
    name: "unsplash",
    category: "tool",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(tools.msg.generateCmdExample(ctx.used, "moon"))
        );

        try {
            const apiUrl = tools.api.createUrl("bk9", "/search/unsplash", {
                q: input
            });
            const result = tools.cmd.getRandomElement((await axios.get(apiUrl)).data.BK9);

            return await ctx.reply({
                image: {
                    url: result
                },
                mimetype: mime.lookup("jpeg"),
                caption: `${quote(`Kueri: ${input}`)}\n` +
                    "\n" +
                    config.msg.footer
            });
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};