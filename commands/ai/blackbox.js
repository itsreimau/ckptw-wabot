const {
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");

module.exports = {
    name: "blackbox",
    aliases: ["bb"],
    category: "ai",
    handler: {
        banned: true,
        cooldown: true,
        coin: [10, "text", 1]
    },
    code: async (ctx) => {
        const {
            status,
            message
        } = await global.handler(ctx, module.exports.handler);
        if (status) return ctx.reply(message);

        const input = ctx.args.join(" ") || null;

        if (!input) return ctx.reply(
            `${quote(global.tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(global.tools.msg.generateCommandExample(ctx._used.prefix + ctx._used.command, "apa itu whatsapp"))
        );

        try {
            const apiUrl = global.tools.api.createUrl("nyxs", "/ai/blackbox", {
                prompt: input,
                gaya: `Anda adalah bot WhatsApp bernama ${global.config.bot.name} yang dimiliki oleh ${global.config.owner.name}. Jika nama Anda mirip dengan tokoh di media, sesuaikan kepribadian Anda dengan nama tersebut. Jika tidak, tetaplah ramah, informatif, dan responsif.` // Dapat diubah sesuai keinginan Anda
            });
            const {
                data
            } = await axios.get(apiUrl);

            return ctx.reply(data.result);
        } catch (error) {
            console.error(`[${global.config.pkg.name}] Error:`, error);
            if (error.status !== 200) return ctx.reply(global.config.msg.notFound);
            return ctx.reply(quote(`❎ Terjadi kesalahan: ${error.message}`));
        }
    }
};