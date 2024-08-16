const {
    createAPIUrl
} = require("../tools/api.js");
const {
    bold,
    monospace,
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");

module.exports = {
    name: "characterai",
    aliases: ["rei", "ayanami"],
    category: "ai",
    code: async (ctx) => {
        const {
            status,
            message
        } = await global.handler(ctx, {
            banned: true,
            coin: 3
        });
        if (status) return ctx.reply(message);

        const input = ctx._args.join(" ") || null;

        if (!input) return ctx.reply(
            `${quote(global.msg.argument)}\n` +
            quote(`Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} hai!`)}`)
        );

        try {
            const apiUrl = createAPIUrl("nyxs", "/ai/character-ai", {
                prompt: input,
                gaya: `Bot WhatsApp bernama ${global.bot.name}, dimiliki oleh ${global.owner.name}.` // Can be changed according to your wishes.
            });
            const {
                data
            } = await axios.get(apiUrl);

            return ctx.reply(data.result);
        } catch (error) {
            console.error("Error:", error);
            if (error.status !== 200) return ctx.reply(global.msg.notFound);
            return ctx.reply(quote(`⚠ Terjadi kesalahan: ${error.message}`));
        }
    }
};