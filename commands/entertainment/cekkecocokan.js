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

        if (!input) return await ctx.reply(
            `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(tools.msg.generateCmdExample(ctx.used, "shinji|kaworu"))
        );

        try {
            const [nama1, nama2] = input.split("|");
            const result = tools.api.createUrl("nirkyy", "/api/v1/kecocokan", {
                nama1: nama2 ? nama1 : ctx.sender.pushName,
                nama2: nama2 || nama1
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