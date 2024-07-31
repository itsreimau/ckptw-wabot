const {
    bold
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "hidetag",
    aliases: ["ht"],
    category: "group",
    code: async (ctx) => {
        try {
            const {
                status,
                message
            } = await global.handler(ctx, {
                admin: true,
                banned: true,
                group: true
            });

            if (status) return ctx.reply(message);

            const input = ctx._args.join(" ") || "@everyone";
            const data = await ctx.group().members();
            const mentions = data.map(member => `${member.id.split("@")[0]}@s.whatsapp.net`);

            return ctx.reply({
                text: input,
                mentions
            });
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(`${bold("[ ! ]")} Terjadi kesalahan: ${error.message}`);
        }
    }
};