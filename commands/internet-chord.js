const {
    chord
} = require("@bochilteam/scraper");
const {
    monospace,
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "chord",
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

        const input = ctx._args.join(" ") || null;

        if (!input) return ctx.reply(
            `${quote(global.msg.argument)}\n` +
            quote(`Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} hikaru utada - one last kiss`)}`)
        );

        try {
            const result = await chord(input);

            if (!result) return ctx.reply(global.msg.notFound);

            return ctx.reply(
                `${quote(`Judul: ${result.title.replace("Chords", "").trim()} (${result.url})`)}\n` +
                `${quote(`Artis: ${result.artist.replace("‣", "").trim()} (${result.artistUrl})`)}\n` +
                "-----\n" +
                `${result.chord}\n` +
                "\n" +
                global.msg.footer
            );
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(quote(`⚠ Terjadi kesalahan: ${error.message}`));
        }
    }
};