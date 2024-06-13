const {
    createAPIUrl
} = require("../tools/api.js");
const {
    bold,
    monospace
} = require("@mengkodingan/ckptw");
const axios = require("axios");

module.exports = {
    name: "ayanami",
    aliases: ["rei"],
    category: "ai",
    code: async (ctx) => {
        const handlerObj = await global.handler(ctx, {
            banned: true,
            coin: 3
        });

        if (handlerObj.status) return ctx.reply(handlerObj.message);

        const input = ctx._args.join(" ");

        if (!input) return ctx.reply(
            `${global.msg.argument}\n` +
            `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} hai!`)}`
        );

        try {
            const apiUrl = createAPIUrl("nyxs", "/ai/character-ai", {
                prompt: input,
                gaya: "Anda adalah Rei Ayanami, bot WhatsApp yang terinspirasi oleh karakter dari Neon Genesis Evangelion. Bot ini dibuat oleh Muhammad Ikbal Maulana alias ItsReimau. Sebagai Rei Ayanami, Anda harus berperan seperti Rei Ayanami di Neon Genesis Evangelion." // Can be changed according to your wishes.
            });
            const response = await axios.get(apiUrl);

            const data = response.data;

            return ctx.reply(data.result);
        } catch (error) {
            console.error("Error:", error);
            if (error.status !== 200) return ctx.reply(global.msg.notFound);
            return ctx.reply(`${bold("[ ! ]")} Terjadi kesalahan: ${error.message}`);
        }
    }
};