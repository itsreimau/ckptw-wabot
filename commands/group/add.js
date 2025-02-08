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

            const [result] = await ctx.core.onWhatsApp(accountJid);
            if (!result.exists) return await ctx.reply(quote(`❎ Akun tidak ada di WhatsApp!`));

            ctx.group().add([accountJid]).then(async (result) => {
                const res = result[0];
                if (res.status === "403") {
                    const code = await ctx.group().inviteCode();
                    await ctx.sendMessage(res.jid, {
                        text: quote(`👋 Hai, saya diminta untuk menambahkan Anda ke grup tetapi terjadi kesalahan. Bisakah kamu bergabung sendiri? https://chat.whatsapp.com/${code}`)
                    });
                }
            });

            return await ctx.reply(quote(`✅ Berhasil ditambahkan!`));
        } catch (error) {
            consolefy.error(`Error: ${error}`);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }

    }
};