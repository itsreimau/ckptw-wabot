const {
    monospace,
    quote
} = require("@mengkodingan/ckptw");
const {
    S_WHATSAPP_NET
} = require("@whiskeysockets/baileys");

module.exports = {
    name: "add",
    category: "group",
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

        if (!input && !isNaN(Number(input))) return ctx.reply(
            `${quote(`📌 ${await global.tools.msg.translate(global.msg.argument, userLanguage)}`)}\n` +
            quote(`${await global.tools.msg.translate("Contoh", userLanguage)}: ${monospace(`${ctx._used.prefix + ctx._used.command} ${ctx._client.user.id.split(":")[0]}`)}`)
        );

        try {
            const accountFormatted = input.replace(/[^\d]/g, "");
            const account = accountFormatted + S_WHATSAPP_NET;

            const [result] = await ctx._client.onWhatsApp(accountFormatted);
            if (!result.exists) return ctx.reply(quote(`❎ ${await global.tools.msg.translate("Akun tidak ada di WhatsApp.", userLanguage)}`));

            await ctx.group().add([account]);

            return ctx.reply(quote(`✅ ${await global.tools.msg.translate("Berhasil ditambahkan!", userLanguage)}`));
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(quote(`⚠ ${await global.tools.msg.translate("Terjadi kesalahan", userLanguage)}: ${error.message}`));
        }
    }
};