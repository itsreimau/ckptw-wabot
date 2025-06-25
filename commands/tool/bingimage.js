const axios = require("axios");
const mime = require("mime-types");

module.exports = {
    name: "bingimage",
    aliases: ["bimg"],
    category: "tool",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${formatter.quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            formatter.quote(tools.msg.generateCmdExample(ctx.used, "moon"))
        );

        try {
            const apiUrl = tools.api.createUrl("siputzx", "/api/s/bimg", {
                query: input
            });
            const result = tools.cmd.getRandomElement((await axios.get(apiUrl)).data.data);

            return await ctx.reply({
                image: {
                    url: result
                },
                mimetype: mime.lookup("jpeg"),
                caption: `${formatter.quote(`Kueri: ${input}`)}\n` +
                    "\n" +
                    config.msg.footer
            });
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};