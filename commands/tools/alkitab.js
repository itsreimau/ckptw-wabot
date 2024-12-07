const {
    monospace,
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");

module.exports = {
    name: "alkitab",
    aliases: ["injil"],
    category: "tools",
    handler: {
        coin: [10, "text", 1]
    },
    code: async (ctx) => {
        if (await handler(ctx, module.exports.handler)) return;

        const [abbr, chapter] = ctx.args;

        if (!abbr && !chapter) return await ctx.reply(
            `${quote(`${tools.msg.generateInstruction(["send"], ["text"])}`)}\n` +
            `${quote(tools.msg.generateCommandExample(ctx._used.prefix + ctx._used.command, "kej 2:18"))}\n` +
            quote(tools.msg.generateNotes([`Ketik ${monospace(`${ctx._used.prefix + ctx._used.command} list`)} untuk melihat daftar.`]))
        );

        if (ctx.args[0] === "list") {
            const listText = await tools.list.get("alkitab");
            return await ctx.reply(listText);
        }

        try {
            const apiUrl = await tools.api.createUrl("https://beeble.vercel.app", `/api/v1/passage/${abbr}/${chapter}`);
            const {
                data
            } = (await axios.get(apiUrl)).data;

            const resultText = data.verses.map((d) =>
                `${quote(`Ayat: ${d.verse}`)}\n` +
                `${quote(`${d.content}`)}`
            ).join(
                "\n" +
                `${quote("─────")}\n`
            );
            return await ctx.reply(
                `${quote(`Nama: ${data.book.name}`)}\n` +
                `${quote(`Bab: ${data.book.chapter}`)}\n` +
                `${quote("─────")}\n` +
                `${resultText}\n` +
                "\n" +
                config.msg.footer
            );
        } catch (error) {
            console.error(`[${config.pkg.name}] Error:`, error);
            if (error.status !== 200) return await ctx.reply(config.msg.notFound);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};