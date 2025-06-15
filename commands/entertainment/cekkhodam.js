const {
    quote
} = require("@itsreimau/ckptw-mod");
const mime = require("mime-types");

module.exports = {
    name: "cekkhodam",
    aliases: ["checkkhodam", "khodam"],
    category: "entertainment",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(tools.msg.generateCmdExample(ctx.used, "itsreimau"))
        );

        try {
            const result = tools.api.createUrl("nirkyy", "/api/v1/khodam", {
                nama: input
            });

            return await ctx.reply({
                image: {
                    url: result
                },
                mimetype: mime.lookup("jpg")
            });
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};