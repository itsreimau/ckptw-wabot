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
            quote(tools.msg.generateCommandExample(ctx.used, tools.general.getID(ctx.sender.jid)))
        );

        try {
            const accountJid = `${input.replace(/[^\d]/g, "")}@s.whatsapp.net`;

            const [result] = await ctx.core.onWhatsApp(accountJid);
            if (!result.exists) return await ctx.reply(quote(`❎ Akun tidak ada di WhatsApp!`));

            await ctx.group().add([accountJid]);

            return await ctx.reply(quote(`✅ Berhasil ditambahkan!`));
        } catch (error) {
            consolefy.error(`Error: ${error}`);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};