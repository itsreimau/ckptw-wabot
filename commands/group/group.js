const {
    monospace,
    quote
} = require("@im-dims/baileys-library");

module.exports = {
    name: "group",
    category: "group",
    permissions: {
        admin: true,
        botAdmin: true,
        group: true
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(`${tools.cmd.generateInstruction(["send"], ["text"])}`)}\n` +
            `${quote(tools.cmd.generateCommandExample(ctx.used, "open"))}\n` +
            quote(tools.cmd.generateNotes([`Ketik ${monospace(`${ctx.used.prefix + ctx.used.command} list`)} untuk melihat daftar.`]))
        );

        if (input === "list") {
            const listText = await tools.list.get("group");
            return await ctx.reply(listText);
        }

        try {
            switch (input.toLowerCase()) {
                case "open":
                case "close":
                case "lock":
                case "unlock":
                    await ctx.group()[input.toLowerCase()]();
                    break;
                case "approve":
                    await ctx.group().joinApproval("on");
                    break;
                case "disapprove":
                    await ctx.group().joinApproval("off");
                    break;
                case "invite":
                    await ctx.group().membersCanAddMemberMode("on");
                    break;
                case "restrict":
                    await ctx.group().membersCanAddMemberMode("off");
                    break;
                default:
                    return await ctx.reply(quote("❎ Teks tidak valid!"));
            }

            return await ctx.reply(quote("✅ Berhasil mengubah setelan grup!"));
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, false);
        }
    }
};