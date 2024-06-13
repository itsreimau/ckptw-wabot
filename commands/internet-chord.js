const {
    chord
} = require("@bochilteam/scraper");
const {
    bold,
    monospace
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "chord",
    category: "internet",
    code: async (ctx) => {
        const handlerObj = await global.handler(ctx, {
            banned: true,
            coin: 3
        });

        if (handlerObj.status) return ctx.reply(handlerObj.message);

        const input = ctx._args.join(" ");

        if (!input) return ctx.reply(
            `${global.msg.argument}\n` +
            `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} hikaru utada - one last kiss`)}`
        );

        try {
            const result = await chord(input);

            if (!result) return ctx.reply(global.msg.notFound);

            return ctx.reply(
                `❖ ${bold("Chord")}\n` +
                "\n" +
                `➲ Judul: ${result.title.replace("Chords", "").trim()} (${result.url})\n` +
                `➲ Artis: ${result.artist.replace("‣", "").trim()} (${result.artistUrl})\n` +
                "-----\n" +
                `${result.chord}\n` +
                "\n" +
                global.msg.footer
            );
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(`${bold("[ ! ]")} Terjadi kesalahan: ${error.message}`);
        }
    }
};