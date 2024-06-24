const {
    trustpositif
} = require("../tools/scraper.js");
const {
    bold,
    monospace
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "webcheck",
    aliases: ["cekweb", "checkweb", "trustpositif", "webcek"],
    category: "tools",
    code: async (ctx) => {
        const handlerObj = await global.handler(ctx, {
            banned: true,
            coin: 3
        });

        if (handlerObj.status) return ctx.reply(handlerObj.message);

        const input = ctx._args.join(" ");

        if (!input) return ctx.reply(
            `${global.msg.argument}\n` +
            `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} bitcoin`)}`
        );

        try {
            const result = await trustpositif(input);

            if (!result) return ctx.reply(global.msg.notFound);

            const resultText = result.map((r) =>
                `➲ Domain: ${r.Domain}\n` +
                `➲ Status: ${r.Status}`
            ).join("\n-----\n");
            return ctx.reply(
                `❖ ${bold("Web Check")}\n` +
                "\n" +
                `${resultText}\n` +
                "\n" +
                global.msg.footer
            );
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(`${bold("[ ! ]")} Terjadi kesalahan: ${error.message}`);
        }
    }
};