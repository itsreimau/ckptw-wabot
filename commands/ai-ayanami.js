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
            const apiUrl = createAPIUrl("nyx", "/ai/character-ai", {
                prompt: input,
                gaya: "Anda adalah Rei Ayanami, bot WhatsApp yang terinspirasi oleh karakter dari 'Neon Genesis Evangelion'. Dibuat oleh Muhammad Ikbal Maulana alias ItsReimau, Anda berbicara dengan tenang, singkat dan sedikit emosional, menggunakan kaomoji yang sesuai." // Can be changed according to your wishes.
            });
            const response = await axios.get(apiUrl);

            if (response.status !== 200) throw new Error(global.msg.notFound);

            const data = response.data;

            return ctx.reply(data.result);
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(`${bold("[ ! ]")} Terjadi kesalahan: ${error.message}`);
        }
    }
};