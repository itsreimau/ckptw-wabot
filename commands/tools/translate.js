const {
    monospace,
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");

module.exports = {
    name: "translate",
    aliases: ["tr"],
    category: "tools",
    handler: {
        coin: [10, "text", 1]
    },
    code: async (ctx) => {
        if (await handler(ctx, module.exports.handler)) return;

        let input = ctx.quoted?.conversation || ctx.quoted?.extendedTextMessage?.text || Object.values(ctx.quoted || {}).find(msg => msg?.caption || msg?.text)?.caption || ctx.args.slice(ctx.args[0]?.length === 2 ? 1 : 0).join(" ") || null;
        let langCode = ctx.args[0]?.length === 2 ? ctx.args[0] : "id";

        if (!input) return await ctx.reply(
            `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            `${quote(tools.msg.generateCommandExample(ctx._used.prefix + ctx._used.command, "en halo dunia!"))}\n` +
            quote(tools.msg.generateNotes([`Ketik ${monospace(`${ctx._used.prefix + ctx._used.command} list`)} untuk melihat daftar.`]))
        );

        if (ctx.args[0] === "list") {
            const listText = await tools.list.get("translate");
            return await ctx.reply(listText);
        }

        try {
            const translation = await tools.general.translate(input, langCode);

            return await ctx.reply(translation);
        } catch (error) {
            console.error(`[${config.pkg.name}] Error:`, error);
            if (error.status !== 200) return await ctx.reply(config.msg.notFound);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};