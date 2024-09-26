const {
    quote
} = require("@mengkodingan/ckptw");
const mime = require("mime-types");

module.exports = {
    name: "text2img",
    category: "ai",
    code: async (ctx) => {
        const {
            status,
            message
        } = await global.handler(ctx, {
            banned: true,
            charger: true,
            cooldown: true,
            energy: [5, "text", 1]
        });
        if (status) return ctx.reply(message);

        let input = ctx.args.join(" ") || null;

        if (!input) return ctx.reply(
            `${quote(global.tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(global.tools.msg.generateCommandExample(ctx._used.prefix + ctx._used.command, "cat"))
        );

        let apiPath = "/ai/text2img";
        const versionRegex = /^\(v(\d+)\)\s*(.*)$/;
        const match = input.match(versionRegex);

        if (match) {
            const version = match[1];
            apiPath = `/v${version}/text2img`;
            input = match[2];
        }

        try {
            const apiUrl = global.tools.api.createUrl("widipe", apiPath, {
                text: input
            });

            return await ctx.reply({
                image: {
                    url: apiUrl
                },
                mimetype: mime.contentType("png"),
                caption: `${quote(`Prompt: ${input}`)}\n` +
                    "\n" +
                    global.config.msg.footer
            });
        } catch (error) {
            console.error(`[${global.config.pkg.name}] Error:`, error);
            if (error.status !== 200) return ctx.reply(global.config.msg.notFound);
            return ctx.reply(quote(`❎ Terjadi kesalahan: ${error.message}`));
        }
    }
};