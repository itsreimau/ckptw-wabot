const {
    monospace,
    quote
} = require("@itsreimau/ckptw-mod");
const {
    handleWelcome
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
            `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            `${quote(tools.msg.generateCommandExample(ctx.used, "join"))}\n` +
            quote(tools.msg.generateNotes([`Selain ${monospace("join")}, gunakan ${monospace("leave")} untuk mensimulasikan keluar dari grup.`]))
        );

        try {
            const m = {
                id: ctx.id,
                participants: [ctx.sender.jid]
            };

            switch (input.toLowerCase()) {
                case "j":
                case "join":
                    return await handleWelcome(ctx, m, "UserJoin");
                    break;
                case "l":
                case "leave":
                    return await handleWelcome(ctx, m, "UserLeave");
                    break;
                default:
                    return await ctx.reply(quote(`❎ Simulasi '${input}' tidak valid!`));
            }
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, false);
        }
    }
};