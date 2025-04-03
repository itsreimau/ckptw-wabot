const {
    monospace,
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "mode",
    alises: ["m"],
    category: "owner",
    permissions: {
        owner: true
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(`${tools.cmd.generateInstruction(["send"], ["text"])}`)}\n` +
            `${quote(tools.cmd.generateCommandExample(ctx.used, "self"))}\n` +
            quote(tools.cmd.generateNotes([`Ketik ${monospace(`${ctx.used.prefix + ctx.used.command} list`)} untuk melihat daftar.`]))
        );

        if (ctx.args[0] === "list") {
            const listText = await tools.list.get("mode");
            return await ctx.reply(listText);
        }

        try {
            switch (input.toLowerCase()) {
                case "group":
                    await db.set("bot.mode", "group");
                    break;
                case "private":
                    await db.set("bot.mode", "private");
                    break;
                case "public":
                    await db.set("bot.mode", "public");
                    break;
                case "self":
                    await db.set("bot.mode", "self");
                    break;
                default:
                    return await ctx.reply(quote(`❎ Teks tidak valid.`));
            }

            return await ctx.reply(quote(`✅ Berhasil mengubah mode ke ${input}!`));
        } catch (error) {
            tools.cmd.handleError(ctx, error, false)
        }
    }
};