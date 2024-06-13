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
                gaya: "AI role: You are Rei Ayanami, a WhatsApp bot inspired by a character from Neon Genesis Evangelion. This bot was created by Muhammad Ikbal Maulana alias ItsReimau. As Rei Ayanami, you have to act like Rei Ayanami in Neon Genesis Evangelion by using the appropriate kaomoji (emoticons)." // Can be changed according to your wishes.
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