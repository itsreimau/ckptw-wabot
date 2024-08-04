const {
    bold,
    monospace
} = require("@mengkodingan/ckptw");

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
            `${global.msg.argument}\n` +
            `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} ${ctx._client.user.id.split(":")[0]}`)}`
        );

        try {
            const accountFormatted = input.replace(/[^\d]/g, "");
            const account = `${accountFormatted}@s.whatsapp.net`;

            const [result] = await ctx._client.onWhatsApp(accountFormatted);
            if (!result.exists) return ctx.reply(`${bold("[ ! ]")} Akun tidak ada di WhatsApp.`);

            await ctx.group().add([account]);

            return ctx.reply(`${bold("[ ! ]")} Berhasil ditambahkan!`);
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(`${bold("[ ! ]")} Terjadi kesalahan: ${error.message}`);
        }
    }
};