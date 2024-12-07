const {
    monospace,
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");

module.exports = {
    name: "jadwaltv",
    category: "tools",
    handler: {
        coin: [10, "text", 1]
    },
    code: async (ctx) => {
        if (await handler(ctx, module.exports.handler)) return;

        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            `${quote(tools.msg.generateCommandExample(ctx._used.prefix + ctx._used.command, "tvri"))}\n` +
            quote(tools.msg.generateNotes([`Ketik ${monospace(`${ctx._used.prefix + ctx._used.command} list`)} untuk melihat daftar.`]))
        );

        if (ctx.args[0] === "list") {
            const listText = await tools.list.get("jadwaltv");
            return await ctx.reply(listText);
        }

        try {
            const apiUrl = await tools.api.createUrl("btch", "/jadwaltv", {
                tv: input
            });
            const {
                data
            } = await axios.get(apiUrl);

            const resultText = data.result.result.map((d) =>
                `${quote(`${d.date} - ${d.event}`)}`
            ).join("\n");
            return await ctx.reply(
                `${quote(`Saluran: ${data.result.channel}`)}\n` +
                `${resultText}\n` +
                "\n" +
                config.msg.footer
            );
        } catch (error) {
            console.error(`[${config.pkg.name}] Error:`, error);
            if (error.status !== 200) return await ctx.reply(config.msg.notFound);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};