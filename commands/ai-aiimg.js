const {
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const mime = require("mime-types");

module.exports = {
    name: "aiimg",
    aliases: ["diff", "diffusion", "stablediffusion", "sxdl"],
    category: "ai",
    code: async (ctx) => {
        const {
            status,
            message
        } = await global.handler(ctx, {
            banned: true,
            charger: true,
            cooldown: true,
            energy: 10
        });
        if (status) return ctx.reply(message);

        const input = ctx.args.join(" ") || null;

        if (!input) return ctx.reply(
            `${quote(global.tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(global.tools.msg.generateCommandExample(ctx._used.prefix + ctx._used.command, "cat"))
        );

        try {
            const apiUrl = global.tools.api.createUrl("chiwa", "/api/ai/cai/generate-image", {
                prompt: input
            });
            const {
                data
            } = await axios.get(apiUrl);

            return await ctx.reply({
                image: {
                    url: data.imageUrl
                },
                mimetype: mime.contentType("png"),
                caption: `${quote(`Prompt: ${input}`)}\n` +
                    "\n" +
                    global.config.msg.footer
            });
        } catch (error) {
            console.error("[ckptw-wabot] Kesalahan:", error);
            if (error.status !== 200) return ctx.reply(global.config.msg.notFound);
            return ctx.reply(quote(`⚠ Terjadi kesalahan: ${error.message}`));
        }
    }
};