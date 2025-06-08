const {
    quote
} = require("@itsreimau/ckptw-mod");

module.exports = {
    name: "afk",
    category: "profile",
    permissions: {},
    code: async (ctx) => {
        const input = ctx.args.join(" ") || null;

        try {
            await db.set(`user.${tools.cmd.getID(ctx.sender.jid)}.afk`, {
                reason: input,
                timestamp: Date.now()
            });

            return await ctx.reply(quote(`📴 Anda akan AFK, ${input ? `dengan alasan "${input}"` : "tanpa alasan apapun"}.`));
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, false);
        }
    }
};