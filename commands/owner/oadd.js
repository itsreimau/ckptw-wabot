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

            await ctx.group().add([accountJid]).then(async (results) => {
                const result = results[0];
                if (result.status == 408) return ctx.reply(quote("❎ Akun ini sepertinya baru saja keluar dari grup ini."));
                if (result.status == 401) return ctx.reply(quote("❎ Akun ini sepertinya telah memblokir bot ini!"));
                if (result.status == "409") return ctx.reply(quote("❎ Akun ini sudah ada di grup."));
                if (result.status == "500") return ctx.reply(quote("❎ Grupnya penuh."));
                if (result.status === "403") return await ctx.sendMessage(result.jid, {
                    text: quote(`👋 Hai, saya diminta untuk menambahkan Anda ke grup tetapi terjadi kesalahan. Bisakah kamu bergabung sendiri? https://chat.whatsapp.com/${result.content[0].attrs.code}`)
                });
            });;

            return await ctx.reply(quote(`✅ Berhasil ditambahkan!`));
        } catch (error) {
            consolefy.error(`Error: ${error}`);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};