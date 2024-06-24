const {
    createAPIUrl
} = require("../tools/api.js");
const {
    bold
} = require("@mengkodingan/ckptw");
const axios = require("axios");

module.exports = {
    name: "cekkhodam",
    aliases: ["checkkhodam", "khodam"]
    category: "fun",
    code: async (ctx) => {
        const handlerObj = await global.handler(ctx, {
            banned: true,
            coin: 3
        });

        if (handlerObj.status) return ctx.reply(handlerObj.message);

        const input = ctx._args.join(" ");

        if (!input) return ctx.reply(
            `${global.msg.argument}\n` +
            `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} john doe`)}`
        );

        try {
            const apiUrl = createAPIUrl("https://raw.githubusercontent.com", `/SazumiVicky/cek-khodam/master/data/khodam/list.txt`, {});
            const response = await axios.get(apiUrl);

            const data = await response.data;
            const list = data.split('\n').filter(l => l.trim().length > 0);
            const khodam = list[Math.floor(Math.random() * list.length)];

            return ctx.reply(
                `❖ ${bold("Cek Khodam")}\n` +
                "\n" +
                `➲ Nama: ${input}\n` +
                `➲ Khodam: ${khodam}\n` +
                "\n" +
                global.msg.footer
            );
        } catch (error) {
            console.error("Error:", error);
            if (error.status !== 200) return ctx.reply(global.msg.notFound);
            return message.reply(`${bold("[ ! ]")} Terjadi kesalahan: ${error.message}`);
        }
    }
};