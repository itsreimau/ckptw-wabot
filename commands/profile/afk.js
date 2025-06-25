module.exports = {
    name: "afk",
    category: "profile",
    code: async (ctx) => {
        const input = ctx.args.join(" ") || null;

        try {
            await db.set(`user.${ctx.getId(ctx.sender.jid)}.afk`, {
                reason: input,
                timestamp: Date.now()
            });

            return await ctx.reply(formatter.quote(`📴 Kamu akan AFK, ${input ? `dengan alasan "${input}"` : "tanpa alasan apapun"}.`));
        } catch (error) {
            return await tools.cmd.handleError(ctx, error);
        }
    }
};