const {
    bold,
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

        const input = ctx._args.join(" ") || null;

        if (!input && !isNaN(Number(input))) return ctx.reply(
            `${quote(global.msg.argument)}\n` +
            quote(`Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} ${ctx._client.user.id.split(":")[0]}`)}`)
        );

        try {
            const accountFormatted = input.replace(/[^\d]/g, "");
            const account = accountFormatted + S_WHATSAPP_NET;

            const [result] = await ctx._client.onWhatsApp(accountFormatted);
            if (!result.exists) return ctx.reply(quote(`⚠ Akun tidak ada di WhatsApp.`));

            await ctx.group().add([account]);

            return ctx.reply(quote(`⚠ Berhasil ditambahkan!`));
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(quote(`⚠ Terjadi kesalahan: ${error.message}`));
        }
    }
};