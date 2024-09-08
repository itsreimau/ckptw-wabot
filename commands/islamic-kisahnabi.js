const {
    monospace,
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");

module.exports = {
    name: "kisahnabi",
    category: "islamic",
    code: async (ctx) => {
        const [userLanguage] = await Promise.all([
            global.db.get(`user.${ctx.sender.jid.replace(/@.*|:.*/g, "")}.language`)
        ]);

        const {
            status,
            message
        } = await global.handler(ctx, {
            banned: true,
            coin: 3
        });
        if (status) return ctx.reply(message);

        const input = ctx.args.join(" ") || null;

        if (!input) return ctx.reply(
            `${quote(`📌 ${await global.tools.msg.translate(global.msg.argument, userLanguage)}`)}\n` +
            quote(`${await global.tools.msg.translate("Contoh", userLanguage)}: ${monospace(`${ctx._used.prefix + ctx._used.command} muhammad`)}`)
        );

        try {
            const apiUrl = global.tools.api.createUrl("https://raw.githubusercontent.com", `/ZeroChanBot/Api-Freee/master/data/kisahNabi/${input.toLowerCase()}.json`, {});
            const {
                data
            } = await axios.get(apiUrl);

            return ctx.reply(
                `${quote(`${await global.tools.msg.translate("Nama", userLanguage)}: ${data.name}`)}\n` +
                `${quote(`${await global.tools.msg.translate("Tahun kelahiran", userLanguage)}: ${data.thn_kelahiran} SM`)}\n` +
                `${quote(`${await global.tools.msg.translate("Tempat kelahiran", userLanguage)}: ${data.tmp}`)}\n` +
                `${quote(`${await global.tools.msg.translate("Usia kesalahan", userLanguage)}: ${data.usia}`)}\n` +
                `${quote("─────")}\n` +
                `${data.description.trim()}\n` +
                "\n" +
                global.msg.footer
            );
        } catch (error) {
            console.error("Error:", error);
            if (error.status !== 200) return ctx.reply(`⛔ ${await global.tools.msg.translate(global.msg.notFound, userLanguage)}`);
            return ctx.reply(quote(`⚠ ${await global.tools.msg.translate("Terjadi kesalahan", userLanguage)}: ${error.message}`));
        }
    }
};