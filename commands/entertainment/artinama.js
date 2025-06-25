const axios = require("axios");
const mime = require("mime-types");

module.exports = {
    name: "artinama",
    category: "entertainment",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${formatter.quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            formatter.quote(tools.msg.generateCmdExample(ctx.used, "itsreimau"))
        );

        try {
            const apiUrl = tools.api.createUrl("siputzx", "/api/primbon/artinama", {
                nama: input
            });
            const result = (await axios.get(apiUrl)).data.data.arti;

            return await ctx.reply(result);
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};