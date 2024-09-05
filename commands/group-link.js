const {
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "link",
    aliases: ["gclink", "grouplink"],
    category: "group",
    code: async (ctx) => {
        const [userLanguage] = await Promise.all([
            global.db.get(`user.${ctx.sender.jid.replace(/@.*|:.*/g, "")}.language`)
        ]);

        const {
            status,
            message
        } = await global.handler(ctx, {
            banned: true,
            botAdmin: true,
            group: true
        });
        if (status) return ctx.reply(message);

        try {
            const link = await ctx.group().inviteCode();
            return ctx.reply(`https://chat.whatsapp.com/${link}`);
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(quote(`⚠ ${await global.tools.msg.translate("Terjadi kesalahan", userLanguage)}: ${error.message}`));
        }
    }
};