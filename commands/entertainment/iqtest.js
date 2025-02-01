const {
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");

module.exports = {
    name: "iqtest",
    category: "entertainment",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const senderId = tools.general.getID(ctx.sender.jid);
        const winGame = await db.get(`user.${senderId}.winGame`) || 0;

        let iqScore;
        let feedback;

        if (winGame < 5) {
            iqScore = Math.floor(Math.random() * 50) + 1;
            feedback = iqScore < 50 ?
                "Hmm, mungkin Anda harus mencobanya lagi? Jangan menyerah!" :
                "Cukup bagus, terus bermain untuk meningkatkan keterampilan Anda!";
        } else if (winGame < 20) {
            iqScore = Math.floor(Math.random() * 50) + 51;
            feedback = iqScore < 100 ?
                "Tidak buruk, tapi Anda bisa melakukannya lebih baik!" :
                "Anda semakin pintar! Pertahankan momentum!";
        } else {
            iqScore = Math.floor(Math.random() * 50) + 101;
            feedback = iqScore < 150 ?
                "Luar biasa! Anda di atas rata-rata!" :
                "Wah, kamu jenius luar biasa! Kemenanganmu sangat mengesankan!";
        }

        return await ctx.reply(quote(`🧠 IQ Anda sebesar: ${iqScore}. ${feedback}`));
    }
};