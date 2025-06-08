const {
    monospace,
    quote
} = require("@itsreimau/ckptw-mod");

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
            `${quote(`${tools.msg.generateInstruction(["send"], ["text"])}`)}\n` +
            `${quote(tools.msg.generateCommandExample(ctx.used, "self"))}\n` +
            quote(tools.msg.generateNotes([`Ketik ${monospace(`${ctx.used.prefix + ctx.used.command} list`)} untuk melihat daftar.`]))
        );

        if (["l", "list"].includes(input)) {
            const listText = await tools.list.get("mode");
            return await ctx.reply(listText);
        }

        try {
            switch (input.toLowerCase()) {
                case "group":
                case "private":
                case "public":
                case "self":
                    await db.set("bot.mode", input.toLowerCase());
                    break;
                default:
                    return await ctx.reply(quote("❎ Mode tidak valid."));
            }

            return await ctx.reply(quote(`✅ Berhasil mengubah mode ke ${input}!`));
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, false);
        }
    }
};