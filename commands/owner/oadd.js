const {
    quote
} = require("@mengkodingan/ckptw");
const {
    S_WHATSAPP_NET
} = require("@whiskeysockets/baileys");

module.exports = {
    name: "oadd",
    category: "owner",
    handler: {
        botAdmin: true,
        group: true,
        owner: true,
        restrict: true
    },
    code: async (ctx) => {
        const {
            status,
            message
        } = await global.handler(ctx, module.exports.handler);
        if (status) return await ctx.reply(message);

        const input = ctx.args.join(" ") || null;

        if (!input && !isNaN(Number(input))) return await ctx.reply(
            `${quote(global.tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(global.tools.msg.generateCommandExample(ctx._used.prefix + ctx._used.command, ctx._client.user.id.split(/[:@]/)[0]))
        );

        try {
            const accountFormatted = input.replace(/[^\d]/g, "");
            const account = accountFormatted + S_WHATSAPP_NET;

            const [result] = await ctx._client.onWhatsApp(accountFormatted);
            if (!result.exists) return await ctx.reply(quote(`❎ Akun tidak ada di WhatsApp.`));

            await ctx.group().add([account]);

            return await ctx.reply(quote(`✅ Berhasil ditambahkan!`));
        } catch (error) {
            console.error(`[${global.config.pkg.name}] Error:`, error);
            return await ctx.reply(quote(`❎ Terjadi kesalahan: ${error.message}`));
        }
    }
};