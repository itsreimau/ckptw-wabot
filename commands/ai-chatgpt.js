const {
    createAPIUrl,
    listAPIUrl
} = require("../tools/api.js");
const {
    bold,
    monospace,
    quote
} = require("@mengkodingan/ckptw");
const fetch = require("node-fetch");

module.exports = {
    name: "chatgpt",
    aliases: ["ai", "chatai", "gpt", "gpt4"],
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
            quote(`Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} apa itu whatsapp?`)}`)
        );

        try {
            const apiUrl = createAPIUrl("chiwa", "/api/ai", {
                text: input
            });
            const response = await fetch(apiUrl);
            const data = await response.json();

            return ctx.reply(data.result);
        } catch (error) {
            console.error("Error:", error);
            if (error.status !== 200) return ctx.reply(global.msg.notFound);
            return ctx.reply(quote(`⚠ Terjadi kesalahan: ${error.message}`));
        }
    }
};