const {
    bold,
    monospace,
    quote
} = require("@mengkodingan/ckptw");
const {
    _ai
} = require("lowline.ai");

module.exports = {
    name: "lowline",
    aliases: ["ll"],
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
            `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} apa itu whatsapp?`)}`
        );

        try {
            const res = await _ai.generatePlaintext({
                prompt: input
            });

            return await ctx.reply(res.result);
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(quote(`${bold("[ ! ]")} Terjadi kesalahan: ${error.message}`));
        }
    }
};