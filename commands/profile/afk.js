const {
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "afk",
    category: "profile",
    permissions: {},
    code: async (ctx) => {
        const input = ctx.args.join(" ") || null;

        try {
            await db.set(`user.${tools.general.getID(ctx.sender.jid)}.afk`, {
                reason: input,
                timestamp: Date.now()
            });

            return await ctx.reply(quote(`📴 Anda akan AFK, ${input ? `dengan alasan "${input}"` : "tanpa alasan apapun"}.`));
        } catch (error) {
            consolefy.error(`Error: ${error}`);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};