const {
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "oadd",
    category: "owner",
    permissions: {
        botAdmin: true,
        group: true,
        owner: true,
        restrict: true
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || null;

        if (!input || isNaN(input)) return await ctx.reply(
            `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(tools.msg.generateCommandExample(ctx.used, ctx.sender.decodedJid))
        );

        try {
            const accountFormatted = input.replace(/[^\d]/g, "");
            const account = `${accountFormatted}@s.whatsapp.net`;

            const [result] = await ctx.core.onWhatsApp(accountFormatted);
            if (!result.exists) return await ctx.reply(quote(`❎ Akun tidak ada di WhatsApp!`));

            await ctx.group().add([account]);

            return await ctx.reply(quote(`✅ Berhasil ditambahkan!`));
        } catch (error) {
            consolefy.error(`Error: ${error}`);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};