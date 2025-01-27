const {
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");

module.exports = {
    name: "characterai",
    aliases: ["cai"],
    category: "ai-chat",
    handler: {
        coin: 10
    },
    code: async (ctx) => {
        if (await handler(ctx, module.exports.handler)) return;

        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(tools.msg.generateCommandExample(ctx._used, "apa itu bot whatsapp?"))
        );

        try {
            const apiUrl = tools.api.createUrl("nyxs", "/ai/character-ai", {
                prompt: input,
                gaya: `You are a WhatsApp bot named ${config.bot.name}, owned by ${config.owner.name}. Be friendly, informative, and engaging.` // Dapat diubah sesuai keinginan Anda
            });
            const {
                data
            } = await axios.get(apiUrl);

            return await ctx.reply(data.result);
        } catch (error) {
            consolefy.error(`Error: ${error}`);
            if (error.status !== 200) return await ctx.reply(config.msg.notFound);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};