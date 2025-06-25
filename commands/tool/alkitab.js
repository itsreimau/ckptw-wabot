const axios = require("axios");

module.exports = {
    name: "alkitab",
    aliases: ["bible"],
    category: "tool",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const [passage, num] = ctx.args;

        if (!passage && !num) return await ctx.reply(
            `${formatter.quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            `${formatter.quote(tools.msg.generateCmdExample(ctx.used, "kej 2:18"))}\n` +
            formatter.quote(tools.msg.generateNotes([`Ketik ${formatter.monospace(`${ctx.used.prefix + ctx.used.command} list`)} untuk melihat daftar.`]))
        );

        if (["l", "list"].includes(passage.toLowerCase())) {
            const listText = await tools.list.get("alkitab");
            return await ctx.reply(listText);
        }

        try {
            const apiUrl = tools.api.createUrl("https://api-alkitab.vercel.app", `/api/passage`, {
                passage,
                num
            });
            const result = (await axios.get(apiUrl)).data.bible.book;

            const resultText = result.chapter.verses.map(r =>
                `${formatter.quote(`Ayat: ${r.number}`)}\n` +
                `${formatter.quote(`${r.text}`)}`
            ).join(
                "\n" +
                `${formatter.quote("─────")}\n`
            );
            return await ctx.reply(
                `${formatter.quote(`Nama: ${result.name}`)}\n` +
                `${formatter.quote(`Bab: ${result.chapter.chap}`)}\n` +
                `${formatter.quote("─────")}\n` +
                `${resultText}\n` +
                "\n" +
                config.msg.footer
            );
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};