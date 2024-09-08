const {
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");

module.exports = {
    name: "checkapis",
    aliases: ["cekapi", "checkapi"],
    category: "owner",
    code: async (ctx) => {
        const [userLanguage] = await Promise.all([
            global.db.get(`user.${ctx.sender.jid.replace(/@.*|:.*/g, "")}.language`)
        ]);

        const {
            status,
            message
        } = await global.handler(ctx, {
            owner: true
        });
        if (status) return ctx.reply(message);

        try {
            await ctx.reply(global.msg.wait);

            const APIs = global.tools.api.listUrl();
            let result = "";

            for (const [name, api] of Object.entries(APIs)) {
                try {
                    const response = await axios.get(api.baseURL);
                    result += quote(`${api.baseURL} 🟢\n`);
                } catch (error) {
                    result += quote(`${api.baseURL} 🔴\n`);
                }
            }

            return ctx.reply(
                `${result.trim()}\n` +
                "\n" +
                global.msg.footer
            );
        } catch (error) {
            console.error("Error:", error);
            if (error.status !== 200) return ctx.reply(`⛔ ${await global.tools.msg.translate(global.msg.notFound, userLanguage)}`);
            return ctx.reply(quote(`⚠ ${await global.tools.msg.translate("Terjadi kesalahan", userLanguage)}: ${error.message}`));
        }
    }
};