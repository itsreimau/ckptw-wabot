const {
    quote
} = require("@itsreimau/ckptw-mod");
const mime = require("mime-types");

module.exports = {
    name: "screenshot",
    aliases: ["ss", "sspc", "ssweb"],
    category: "tool",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const url = ctx.args[0] || null;

        if (!url) return await ctx.reply(
            `${quote(tools.cmd.generateInstruction(["send"], ["text"]))}\n` +
            quote(tools.cmd.generateCommandExample(ctx.used, "https://example.com/"))
        );

        const isUrl = await tools.general.isUrl(url);
        if (!isUrl) return await ctx.reply(config.msg.urlInvalid);

        try {
            const result = tools.api.createUrl("diibot", "/api/tools/sspc", {
                url
            });

            return await ctx.reply({
                image: {
                    url: result
                },
                mimetype: mime.lookup("jpg"),
                caption: `${quote(`URL: ${url}`)}\n` +
                    "\n" +
                    config.msg.footer
            });
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};