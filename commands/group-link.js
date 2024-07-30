const {
    bold
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "link",
    aliases: ["gclink", "grouplink"],
    category: "group",
    code: async (ctx) => {
        const handlerObj = await global.handler(ctx, {
            botAdmin: true,
            banned: true,
            group: true
        });

        if (handlerObj.status) return ctx.reply(handlerObj.message);

        try {
            const link = await ctx.group().inviteCode();
            return ctx.reply(`https://chat.whatsapp.com/${link}`);
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(`${bold("[ ! ]")} Terjadi kesalahan: ${error.message}`);
        }
    }
};