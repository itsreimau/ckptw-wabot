const {
    Events
} = require("@itsreimau/gktw");
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
            `${formatter.quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            `${formatter.quote(tools.msg.generateCmdExample(ctx.used, "join"))}\n` +
            formatter.quote(tools.msg.generateNotes([`Selain ${formatter.monospace("join")}, gunakan ${formatter.monospace("leave")} untuk mensimulasikan keluar dari grup.`]))
        );

        try {
            const m = {
                id: ctx.id,
                participants: [ctx.sender.jid]
            };

            switch (input.toLowerCase()) {
                case "j":
                case "join":
                    return await handleWelcome(ctx, m, Events.UserJoin, true);
                    break;
                case "l":
                case "leave":
                    return await handleWelcome(ctx, m, Events.UserLeave, true);
                    break;
                default:
                    return await ctx.reply(formatter.quote(`❎ Simulasi '${input}' tidak valid!`));
            }
        } catch (error) {
            return await tools.cmd.handleError(ctx, error);
        }
    }
};