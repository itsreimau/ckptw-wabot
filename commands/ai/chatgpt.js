const {
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");

module.exports = {
    name: "chatgpt",
    aliases: ["ai", "chatai", "gpt", "gpt4"],
    category: "ai",
    handler: {
        banned: true,
        cooldown: true
    },
    code: async (ctx) => {
        const status = await handler(ctx, module.exports.handler);
        if (status) return;

        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(tools.msg.generateCommandExample(ctx._used.prefix + ctx._used.command, "apa itu bot whatsapp?"))
        );

        try {
            const apiUrl = tools.api.createUrl("aemt", "/prompt/gpt", {
                prompt: `Anda adalah bot WhatsApp bernama ${config.bot.name} yang dimiliki oleh ${config.owner.name}. Jika nama Anda mirip dengan tokoh di media, sesuaikan kepribadian Anda dengan nama tersebut. Jika tidak, tetaplah ramah, informatif, dan responsif.`, // Dapat diubah sesuai keinginan Anda
                text: input
            });
            const {
                data
            } = await axios.get(apiUrl);

            return await ctx.reply(data.result);
        } catch (error) {
            console.error(`[${config.pkg.name}] Error:`, error);
            if (error.status !== 200) return await ctx.reply(config.msg.notFound);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};