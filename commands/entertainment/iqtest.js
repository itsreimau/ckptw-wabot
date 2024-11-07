const {
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");

module.exports = {
    name: "iqtest",
    category: "entertainment",
    handler: {
        banned: true,
        cooldown: true,
        coin: 10
    },
    code: async (ctx) => {
        const status = await handler(ctx, module.exports.handler);
        if (status) return;

        const senderNumber = ctx.sender.jid.split(/[:@]/)[0];
        const winGame = await db.get(`user.${senderNumber}.winGame`);

        const iqScore = getIqScore(winGame);
        const feedback = getFeedback(iqScore, winGame);

        return await ctx.reply(quote(`IQ Anda sebesar: ${iqScore}. ${feedback}`));
    }
};

function getIqScore(winGame) {
    if (winGame < 5) {
        return Math.floor(Math.random() * 50) + 1;
    } else if (winGame < 20) {
        return Math.floor(Math.random() * 50) + 51;
    } else {
        return Math.floor(Math.random() * 50) + 101;
    }
}

function getFeedback(iqScore, winGame) {
    if (winGame < 5) {
        if (iqScore < 50) return "Hmm, mungkin Anda harus mencobanya lagi? Jangan menyerah!";
        return "Cukup bagus, terus bermain untuk meningkatkan keterampilan Anda!";
    } else if (winGame < 20) {
        if (iqScore < 100) return "Tidak buruk, tapi Anda bisa melakukannya lebih baik!";
        return "Anda semakin pintar! Pertahankan momentum!";
    } else {
        if (iqScore < 150) return "Luar biasa! Anda di atas rata-rata!";
        return "Wah, kamu jenius luar biasa! Kemenanganmu sangat mengesankan!";
    }
}