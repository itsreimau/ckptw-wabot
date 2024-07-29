const {
    api
} = require("../tools/exports.js");
const {
    bold,
    monospace
} = require("@mengkodingan/ckptw");
const axios = require("axios");

module.exports = {
    name: "kisahnabi",
    category: "islamic",
    code: async (ctx) => {
        const handlerObj = await global.handler(ctx, {
            banned: true,
            coin: 3
        });

        if (handlerObj.status) return ctx.reply(handlerObj.message);

        const input = ctx._args.join(" ") || null;

        if (!input) return ctx.reply(
            `${global.msg.argument}\n` +
            `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} muhammad`)}`
        );

        try {
            const apiUrl = api.createUrl("https://raw.githubusercontent.com", `/ZeroChanBot/Api-Freee/master/data/kisahNabi/${input.toLowerCase()}.json`, {});
            const response = await axios.get(apiUrl);

            const data = await response.data;

            return ctx.reply(
                `❖ ${bold("Kisah Nabi")}\n` +
                "\n" +
                `➲ Nama: ${data.name}\n` +
                `➲ Tahun kelahiran: ${data.thn_kelahiran}\n` +
                `➲ Tempat kelahiran: ${data.tmp}\n` +
                `➲ Usia: ${data.usia}\n` +
                "-----\n" +
                `${data.description.trim()}\n` +
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