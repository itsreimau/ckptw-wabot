const {
    monospace,
    quote
} = require("@itsreimau/ckptw-mod");

module.exports = {
    name: "setmaxwarnings",
    category: "group",
    permissions: {
        admin: true,
        botAdmin: true,
        group: true
    },
    code: async (ctx) => {
        const input = parseInt(ctx.args[0], 10) || null;

        if (!input) return await ctx.reply(
            `${quote(`${tools.msg.generateInstruction(["send"], ["text"])}`)}\n` +
            quote(tools.msg.generateCommandExample(ctx.used, "8"))
        );

        try {
            const groupId = tools.cmd.getID(ctx.id);
            await db.set(`group.${groupId}.maxwarnings`, input);

            return await ctx.reply(quote(`✅ Berhasil mengubah max warnings!`));
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, false);
        }
    }
};