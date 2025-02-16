const {
    monospace,
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");

module.exports = {
    name: "alkitab",
    aliases: ["bible", "injil"],
    category: "tool",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const [abbr, chapter] = ctx.args;

        if (!abbr && !chapter) return await ctx.reply(
            `${quote(`${tools.msg.generateInstruction(["send"], ["text"])}`)}\n` +
            `${quote(tools.msg.generateCommandExample(ctx.used, "kej 2:18"))}\n` +
            quote(tools.msg.generateNotes([`Ketik ${monospace(`${ctx.used.prefix + ctx.used.command} list`)} untuk melihat daftar.`]))
        );

        if (ctx.args[0] === "list") {
            const listText = await tools.list.get("alkitab");
            return await ctx.reply(listText);
        }

        try {
            const apiUrl = tools.api.createUrl("https://beeble.vercel.app", `/api/v1/passage/${abbr}/${chapter}`);
            const result = (await axios.get(apiUrl)).data.data;

            const resultText = result.verses.map((r) =>
                `${quote(`Ayat: ${r.verse}`)}\n` +
                `${quote(`${r.content}`)}`
            ).join(
                "\n" +
                `${quote("─────")}\n`
            );
            return await ctx.reply(
                `${quote(`Nama: ${result.book.name}`)}\n` +
                `${quote(`Bab: ${result.book.chapter}`)}\n` +
                `${quote("─────")}\n` +
                `${resultText}\n` +
                "\n" +
                config.msg.footer
            );
        } catch (error) {
            consolefy.error(`Error: ${error}`);
            if (error.status !== 200) return await ctx.reply(config.msg.notFound);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};