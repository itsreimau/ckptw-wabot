const {
    quote
} = require("@mengkodingan/ckptw");
const mime = require("mime-types");

module.exports = {
    name: "text2img",
    category: "ai",
    handler: {
        banned: true,
        cooldown: true,
        coin: [10, "text", 1]
    },
    code: async (ctx) => {
        const status = await handler(ctx, module.exports.handler);
        if (status) return;

        let input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(tools.msg.generateCommandExample(ctx._used.prefix + ctx._used.command, "moon"))
        );

        let apiPath = "/ai/text2img";
        let apiService = "aemt";

        const versionRegex = /^\(v(\d+)\)\s*(.*)$/;
        const match = input.match(versionRegex);

        if (match) {
            const version = match[1];
            input = match[2];

            apiPath = version === "0" ? "/ai/text2img" : `/v${version}/text2img`;
        } else {
            apiService = "nyxs";
            apiPath = "/ai-image/image-generator2";
        }

        try {
            const apiUrl = tools.api.createUrl(apiService, apiPath, {
                ...(apiService === "aemt" && {
                    text: input
                }),
                ...(apiService === "nyxs" && {
                    prompt: input
                })
            });

            return await ctx.reply({
                image: {
                    url: apiUrl
                },
                mimetype: mime.lookup("png"),
                caption: `${quote(`Prompt: ${input}`)}\n` +
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