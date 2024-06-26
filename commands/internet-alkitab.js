const {
    createAPIUrl
} = require("../tools/api.js");
const {
    bold,
    monospace
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
    name: "alkitab",
    aliases: ["injil"],
    category: "internet",
    code: async (ctx) => {
        const handlerObj = await global.handler(ctx, {
            banned: true,
            coin: 3
        });

        if (handlerObj.status) return ctx.reply(handlerObj.message);

        const [abbr, chapter] = ctx._args;

        if (!ctx._args.length) return ctx.reply(
            `${global.msg.argument} Bingung? Ketik ${monospace(`${ctx._used.prefix + ctx._used.command} list`)} untuk melihat daftar.\n` +
            `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} kej 2:18`)}`
        );

        if (ctx._args[0] === "list") {
            const listText = fs.readFileSync(path.resolve(__dirname, "../assets/txt/list-alkitab.txt"), "utf8");

            return ctx.reply(`❖ ${bold("Daftar")}\n` + "\n" + `${listText}\n` + "\n" + global.msg.footer);
        }

        try {
            const apiUrl = await createAPIUrl("https://beeble.vercel.app", `/api/v1/passage/${abbr}/${chapter}`, {
                ver: "tb"
            });
            const response = await axios.get(apiUrl);

            const {
                data
            } = await response.data;

            const resultText = data.verses.map((v) =>
                `➲ Ayat: ${v.verse}\n` +
                `➲ ${v.content}`
            ).join("\n-----\n");
            return ctx.reply(
                `❖ ${bold("Alkitab")}\n` +
                "\n" +
                `➲ Nama: ${data.book.name}\n` +
                `➲ Bab: ${data.book.chapter}\n` +
                "-----\n" +
                `${resultText}\n` +
                "\n" +
                global.msg.footer
            );
        } catch (error) {
            console.error("Error:", error);
            if (error.status !== 200) return ctx.reply(global.msg.notFound);
            return ctx.reply(`${bold("[ ! ]")} Terjadi kesalahan: ${error.message}`);
        }
    }
};