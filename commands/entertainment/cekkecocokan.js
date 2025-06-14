const mime = require("mime-types");

module.exports = {
    name: "cekkecocokan",
    aliases: ["checkkecocokan", "kecocokan"],
    category: "entertainment",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || null;
        const [nama1, nama2] = input?.split("|");

        if (!input || !nama1 || !nama1) return await ctx.reply(
            `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(tools.msg.generateCmdExample(ctx.used, "gendo|fuyutsuki"))
        );

        try {
            const result = tools.api.createUrl("nirkyy", "/api/v1/kecocokan", {
                nama1,
                nama2
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