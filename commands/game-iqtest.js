const {
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");

module.exports = {
    name: "iqtest",
    category: "game",
    code: async (ctx) => {
        const {
            status,
            message
        } = await global.handler(ctx, {
            banned: true,
            charger: true,
            cooldown: true,
            energy: 5
        });
        if (status) return ctx.reply(message);

        const iqScore = Math.floor(Math.random() * 10000) + 1;
        const feedback = getFeedback(iqScore);

        return ctx.reply(quote(`IQ Anda sebesar: ${iqScore} ${feedback}`));
    }
};

function getFeedback(iqScore) {
    if (iqScore < 50) return "Hmm, mungkin Anda harus mencobanya lagi?";
    else if (iqScore < 100) return "Tidak buruk, tapi Anda bisa melakukannya lebih baik!";
    else return "Wah, kamu jenius!";
}