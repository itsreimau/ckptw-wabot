const {
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "ohidetag",
    aliases: ["oht"],
    category: "owner",
    permissions: {
        group: true,
        owner: true
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || quote("👋 Halo, Dunia!");

        try {
            const members = await ctx.group().members();
            const mentions = members.map(m => m.id);

            return await ctx.reply({
                text: input,
                mentions
            });
        } catch (error) {
            tools.cmd.handleError(ctx, error, false)
        }
    }
};