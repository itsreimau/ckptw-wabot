const {
    quote
} = require("@mengkodingan/ckptw");
const {
    S_WHATSAPP_NET
} = require("@whiskeysockets/baileys");

module.exports = {
    name: "oadd",
    category: "owner",
    code: async (ctx) => {
        const {
            status,
            message
        } = await global.handler(ctx, {
            group: true,
            owner: true,
            restrict: true
        });
        if (status) return ctx.reply(message);

        const input = ctx.args.join(" ") || null;

        if (!input && !isNaN(Number(input))) return ctx.reply(
            `${quote(global.tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(global.tools.msg.generateCommandExample(ctx._used.prefix + ctx._used.command, ctx._client.user.id.split(":")[0]))
        );

        try {
            const accountFormatted = input.replace(/[^\d]/g, "");
            const account = accountFormatted + S_WHATSAPP_NET;

            const [result] = await ctx._client.onWhatsApp(accountFormatted);
            if (!result.exists) return ctx.reply(quote(`❎ Akun tidak ada di WhatsApp.`));

            await ctx.group().add([account]);

            return ctx.reply(quote(`✅ Berhasil ditambahkan!`));
        } catch (error) {
            console.error(`[${global.config.pkg.name}] Error:`, error);
            return ctx.reply(quote(`❎ Terjadi kesalahan: ${error.message}`));
        }
    }
};