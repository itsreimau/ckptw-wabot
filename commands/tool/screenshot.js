const {
    quote
} = require("@mengkodingan/ckptw");
const mime = require("mime-types");

module.exports = {
    name: "screenshot",
    aliases: ["ss", "sshp", "sspc", "sstab", "ssweb"],
    category: "tool",
    handler: {
        coin: [10, "text", 1]
    },
    code: async (ctx) => {
        if (await handler(ctx, module.exports.handler)) return;

        const url = ctx.args[0] || null;

        if (!url) return await ctx.reply(
            `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(tools.msg.generateCommandExample(ctx._used.prefix + ctx._used.command, "https://example.com/"))
        );

        const isUrl = await tools.general.isUrl(url);
        if (!isUrl) return await ctx.reply(config.msg.urlInvalid);

        try {
            let type = "desktop";
            if (ctx._used.command === "sshp") {
                type = "phone";
            } else if (ctx._used.command === "sstab") {
                type = "tablet";
            }

            const apiUrl = tools.api.createUrl("vreden", "/api/ssweb", {
                url,
                type
            });

            return await ctx.reply({
                image: {
                    url: apiUrl
                },
                mimetype: mime.lookup("png"),
                caption: `${quote(`URL: ${url}`)}\n` +
                    "\n" +
                    config.msg.footer
            });
        } catch (error) {
            console.error(`[${config.pkg.name}] Error:`, error);
            if (error.status !== 200) return await ctx.reply(config.msg.notFound);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};