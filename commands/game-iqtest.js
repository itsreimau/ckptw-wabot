const {
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");

module.exports = {
    name: "iqtest",
    category: "game",
    code: async (ctx) => {
        const [userLanguage] = await Promise.all([
            global.db.get(`user.${ctx.sender.jid.replace(/@.*|:.*/g, "")}.language`)
        ]);

        try {
            const {
                status,
                message
            } = await global.handler(ctx, {
                banned: true,
                coin: 3
            });
            if (status) return ctx.reply(message);

            return ctx.reply(await global.tools.msg.translate(global.tools.general.getRandomElement(iq), userLanguage));
        } catch (error) {
            console.error(error);
            return ctx.reply(quote(`⚠ ${await global.tools.msg.translate("Terjadi kesalahan", userLanguage)}: ${error.message}`));
        }
    }
};

const iq = [
    "IQ Anda sebesar: 1",
    "IQ Anda sebesar: 14",
    "IQ Anda sebesar: 23",
    "IQ Anda sebesar: 35",
    "IQ Anda sebesar: 41",
    "IQ Anda sebesar: 50",
    "IQ Anda sebesar: 67",
    "IQ Anda sebesar: 72",
    "IQ Anda sebesar: 86",
    "IQ Anda sebesar: 99",
    "IQ Anda sebesar: 150",
    "IQ Anda sebesar: 340",
    "IQ Anda sebesar: 423",
    "IQ Anda sebesar: 500",
    "IQ Anda sebesar: 676",
    "IQ Anda sebesar: 780",
    "IQ Anda sebesar: 812",
    "IQ Anda sebesar: 945",
    "IQ Anda sebesar: 1000",
    "IQ Anda sebesar: 5000",
    "IQ Anda sebesar: 7500",
    "IQ Anda sebesar: 10000",
    "IQ Anda sebesar: Tak terbatas!"
];