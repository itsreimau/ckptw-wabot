const {
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "add",
    category: "group",
    handler: {
        admin: true,
        botAdmin: true,
        group: true,
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

            ctx.group().add([account]).then(async (result) => {
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
            console.error(`[${config.pkg.name}] Error:`, error);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }

    }
};