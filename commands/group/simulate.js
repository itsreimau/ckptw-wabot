const {
    monospace,
    quote
} = require("@mengkodingan/ckptw");
const {
    handleUserEvent
} = require("../../events/handler.js");

module.exports = {
    name: "simulate",
    category: "group",
    permissions: {
        botAdmin: true,
        group: true
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(tools.cmd.generateInstruction(["send"], ["text"]))}\n` +
            `${quote(tools.cmd.generateCommandExample(ctx.used, "join"))}\n` +
            quote(tools.cmd.generateNotes([`Selain ${monospace("join")}, gunakan ${monospace("leave")} untuk mensimulasikan keluar dari grup.`]))
        );

        try {
            const senderJid = ctx.sender.jid;
            const groupJid = ctx.isGroup() ? ctx.id : null;
            const m = {
                id: groupJid,
                participants: [senderJid]
            };

            switch (input.toLowerCase()) {
                case "j":
                case "join":
                    return await handleUserEvent(ctx, m, "userJoin")
                case "l":
                case "leave":
                    return await handleUserEvent(ctx, m, "userLeave");
                    break;
                default:
                    return await ctx.reply(quote(`❎ Key '${key}' tidak valid!`));
            }
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, false);
        }
    }
};