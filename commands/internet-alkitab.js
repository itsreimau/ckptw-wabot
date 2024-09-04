const {
    getList
} = require("../tools/list");
const {
    createAPIUrl
} = require("../tools/api.js");
const {
    monospace,
    quote
} = require("@mengkodingan/ckptw");
const fetch = require("node-fetch");

module.exports = {
    name: "alkitab",
    aliases: ["injil"],
    category: "internet",
    code: async (ctx) => {
        const {
            status,
            message
        } = await global.handler(ctx, {
            banned: true,
            coin: 3
        });
        if (status) return ctx.reply(message);

        const [abbr, chapter] = ctx.args;

        if (!ctx.args.length) return ctx.reply(
            `${quote(`${global.msg.argument} Bingung? Ketik ${monospace(`${ctx._used.prefix + ctx._used.command} list`)} untuk melihat daftar.`)}\n` +
            quote(`Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} kej 2:18`)}`)
        );

        if (ctx.args[0] === "list") {
            const listText = await getList("alkitab");
            return ctx.reply(listText);
        }

        try {
            const apiUrl = await createAPIUrl("https://beeble.vercel.app", `/api/v1/passage/${abbr}/${chapter}`, {});
            const response = await fetch(apiUrl);
            const {
                data
            } = await response.json();

            const resultText = data.verses.map((d) =>
                `${quote(`Ayat: ${d.verse}`)}\n` +
                `${quote(`${d.content}`)}`
            ).join(
                "\n" +
                `${quote("─────")}\n`
            );
            return ctx.reply(
                `${quote(`Nama: ${data.book.name}`)}\n` +
                `${quote(`Bab: ${data.book.chapter}`)}\n` +
                `${quote("─────")}\n` +
                `${resultText}\n` +
                "\n" +
                global.msg.footer
            );
        } catch (error) {
            console.error("Error:", error);
            if (error.status !== 200) return ctx.reply(global.msg.notFound);
            return ctx.reply(quote(`⚠ Terjadi kesalahan: ${error.message}`));
        }
    }
};