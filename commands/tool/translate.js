const {
    monospace,
    quote
} = require("@itsreimau/ckptw-mod");

module.exports = {
    name: "translate",
    aliases: ["tr"],
    category: "tool",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        let input = ctx.args.slice(ctx.args[0]?.length === 2 ? 1 : 0).join(" ") || ctx.quoted?.conversation || Object.values(ctx.quoted).map(q => q?.text || q?.caption).find(Boolean) || null;
        let langCode = ctx.args[0]?.length === 2 ? ctx.args[0] : "id";

        if (!input) return await ctx.reply(
            `${quote(tools.cmd.generateInstruction(["send"], ["text"]))}\n` +
            `${quote(tools.msg.generateCommandExample(ctx.used, "en halo, dunia!"))}\n` +
            quote(tools.msg.generateNotes([`Ketik ${monospace(`${ctx.used.prefix + ctx.used.command} list`)} untuk melihat daftar.`, "Balas atau quote pesan untuk menjadikan teks sebagai input target, jika teks memerlukan baris baru."]))
        );

        if (["l", "list"].includes(input.toLowerCase())) {
            const listText = await tools.list.get("translate");
            return await ctx.reply(listText);
        }

        try {
            const result = await tools.cmd.translate(input, langCode);

            return await ctx.reply(result);
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};