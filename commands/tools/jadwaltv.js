const {
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");

module.exports = {
    name: "jadwaltv",
    category: "tools",
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
        if (status) return await ctx.reply(message);

        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(global.tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            `${quote(global.tools.msg.generateCommandExample(ctx._used.prefix + ctx._used.command, "tvri"))}\n` +
            quote(global.tools.msg.generateNotes([`Ketik ${monospace(`${ctx._used.prefix + ctx._used.command} list`)} untuk melihat daftar.`]))
        );

        if (ctx.args[0] === "list") {
            const listText = await global.tools.list.get("jadwaltv");
            return await ctx.reply(listText);
        }

        try {
            const apiUrl = await global.tools.api.createUrl("widipe", "/jadwaltv", {
                tv: input
            });
            const {
                data
            } = await axios.get(apiUrl);

            const resultText = data.result.result.map((d) =>
                `${quote(`${d.date} - ${d.event}`)}`
            ).join("\n");
            return await ctx.reply(
                `${quote(`Kanal: ${data.result.channel}`)}\n` +
                `${resultText}\n` +
                "\n" +
                global.config.msg.footer
            );
        } catch (error) {
            console.error(`[${global.config.pkg.name}] Error:`, error);
            if (error.status !== 200) return await ctx.reply(global.config.msg.notFound);
            return await ctx.reply(quote(`❎ Terjadi kesalahan: ${error.message}`));
        }
    }
};