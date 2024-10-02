const {
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");

module.exports = {
    name: "kisahnabi",
    category: "islamic",
    code: async (ctx) => {
        const {
            status,
            message
        } = await global.handler(ctx, {
            banned: true,
            cooldown: true
        });
        if (status) return ctx.reply(message);

        const input = ctx.args.join(" ") || null;

        if (!input) return ctx.reply(
            `${quote(global.tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(global.tools.msg.generateCommandExample(ctx._used.prefix + ctx._used.command, "muhammad"))
        );

        try {
            const apiUrl = global.tools.api.createUrl("https://raw.githubusercontent.com", `/ZeroChanBot/Api-Freee/master/data/kisahNabi/${input.toLowerCase()}.json`, {});
            const {
                data
            } = await axios.get(apiUrl);

            return ctx.reply(
                `${quote(`Nama: ${data.name}`)}\n` +
                `${quote(`Tahun kelahiran: ${data.thn_kelahiran} SM`)}\n` +
                `${quote(`Tempat kelahiran: ${data.tmp}`)}\n` +
                `${quote(`Usia: ${data.usia}`)}\n` +
                `${quote("─────")}\n` +
                `${data.description.trim()}\n` +
                "\n" +
                global.config.msg.footer
            );
        } catch (error) {
            console.error(`[${global.config.pkg.name}] Error:`, error);
            if (error.status !== 200) return ctx.reply(global.config.msg.notFound);
            return ctx.reply(quote(`❎ Terjadi kesalahan: ${error.message}`));
        }
    }
};