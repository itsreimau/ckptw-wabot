const {
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "add",
    category: "group",
    permissions: {
        admin: true,
        botAdmin: true,
        group: true,
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

            const [isOnWhatsApp] = await ctx.core.onWhatsApp(accountJid);
            if (!isOnWhatsApp.exists) return await ctx.reply(quote(`❎ Akun tidak ada di WhatsApp!`));

            const [addResult] = await ctx.group().add([accountJid]);
            if (addResult.status == 408) return await ctx.reply(quote("❎ Akun ini sepertinya baru saja keluar dari grup ini."));
            if (addResult.status == 401) return await ctx.reply(quote("❎ Akun ini sepertinya telah memblokir bot ini!"));
            if (addResult.status == 409) return await ctx.reply(quote("❎ Akun ini sudah ada di grup."));
            if (addResult.status == 500) return await ctx.reply(quote("❎ Grup ini penuh."));
            if (addResult.status === 403) return await ctx.sendMessage(addResult.jid, {
                text: quote(`👋 Hai, saya diminta untuk menambahkan Anda ke grup tetapi terjadi kesalahan. Bisakah kamu bergabung sendiri? https://chat.whatsapp.com/${addResult.content[0].attrs.code}`)
            });

            return await ctx.reply(quote(`✅ Berhasil ditambahkan!`));
        } catch (error) {
            console.error(`Error: ${error}`);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};