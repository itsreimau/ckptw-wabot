const {
    monospace,
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "enable",
    aliases: ["on"],
    category: "owner",
    code: async (ctx) => {
        const [userLanguage] = await Promise.all([
            global.db.get(`user.${ctx.sender.jid.replace(/@.*|:.*/g, "")}.language`)
        ]);

        const {
            status,
            message
        } = await global.handler(ctx, {
            admin: true,
            banned: true,
            botAdmin: true,
            group: true
        });
        if (status) return ctx.reply(message);

        const input = ctx.args.join(" ") || null;

        if (!input) return ctx.reply(
            `${quote(`⚠ ${await global.tools.msg.translate(`${await global.tools.msg.argument} Bingung? Ketik ${monospace(`${ctx._used.prefix + ctx._used.command} list`)} untuk melihat daftar.`, userLanguage)}`)}\n` +
            quote(`${await global.tools.msg.translate("Contoh", userLanguage)}: ${monospace(`${ctx._used.prefix + ctx._used.command} welcome`)}`)
        );

        if (ctx.args[0] === "list") {
            const listText = await global.tools.list.get("disable_enable");
            return ctx.reply(listText);
        }

        try {
            const groupNumber = ctx.isGroup() ? ctx.msg.key.remoteJid.replace(/@.*|:.*/g, "") : null;

            switch (input) {
                case "antilink":
                    await global.db.set(`group.${groupNumber}.antilink`, true);
                    return ctx.reply(quote(`⚠ ${await global.tools.msg.translate("Fitur 'antilink' berhasil diaktifkan!", userLanguage)}`));
                case "welcome":
                    await global.db.set(`group.${groupNumber}.welcome`, true);
                    return ctx.reply(quote(`⚠ ${await global.tools.msg.translate("Fitur 'welcome' berhasil diaktifkan!", userLanguage)}`));
                default:
                    return ctx.reply(quote(`⚠ ${await global.tools.msg.translate(`Perintah tidak valid. Ketik ${monospace(`${ctx._used.prefix + ctx._used.command} list`)} untuk melihat daftar.`, userLanguage)}`));
            }
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(quote(`⚠ ${await global.tools.msg.translate("Terjadi kesalahan", userLanguage)}: ${error.message}`));
        }
    }
};