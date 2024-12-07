const {
    quote
} = require("@mengkodingan/ckptw");

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
        if (await handler(ctx, module.exports.handler)) return;

        const input = ctx.args.join(" ") || null;

        if (!input && isNaN(input)) return await ctx.reply(
            `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(tools.msg.generateCommandExample(ctx._used.prefix + ctx._used.command, ctx._client.user.id.split("@")[0]))
        );

        try {
            const accountFormatted = input.replace(/[^\d]/g, "");
            const account = `${accountFormatted}@s.whatsapp.net`;

            const [result] = await ctx._client.onWhatsApp(accountFormatted);
            if (!result.exists) return await ctx.reply(quote(`❎ Akun tidak ada di WhatsApp!`));

            await ctx.group().add([account]);

            return await ctx.reply(quote(`✅ Berhasil ditambahkan!`));
        } catch (error) {
            console.error(`[${config.pkg.name}] Error:`, error);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};