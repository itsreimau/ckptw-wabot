const {
    quote
} = require("@mengkodingan/ckptw");
const fetch = require("node-fetch");

module.exports = {
    name: "checkapis",
    aliases: ["cekapi", "checkapi"],
    category: "owner",
    code: async (ctx) => {
        const {
            status,
            message
        } = await global.handler(ctx, {
            owner: true
        });
        if (status) return ctx.reply(message);

        try {
            await ctx.reply(global.msg.wait);

            const APIs = global.tools.api.listAPIUrl();
            let result = "";

            for (const [name, api] of Object.entries(APIs)) {
                try {
                    const response = await fetch(api.baseURL);
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
            return ctx.reply(quote(`⚠ Terjadi kesalahan: ${error.message}`));
        }
    }
};