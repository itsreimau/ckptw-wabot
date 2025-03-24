const {
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "hidetag",
    aliases: ["ht"],
    category: "group",
    permissions: {
        admin: true,
        group: true
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
            consolefy.error(`Error: ${error}`);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};