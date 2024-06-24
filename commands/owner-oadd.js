const {
    isAdmin
} = require("../tools/simple.js");
const {
    bold,
    monospace
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "oadd",
    category: "owner",
    code: async (ctx) => {
        const handlerObj = await global.handler(ctx, {
            group: true,
            owner: true
        });

        if (handlerObj.status) return ctx.reply(handlerObj.message);

        const input = ctx._args.join(" ");

        if (!input && !isNaN(Number(input))) return ctx.reply(
            `${global.msg.argument}\n` +
            `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} ${ctx._client.user.id.split(":")[0]}`)}`
        );

        try {
            const account = `${input.replace(/[^\d]/g, "")}@s.whatsapp.net`;

            const {
                exists
            } = await ctx._client.onWhatsApp(account)
            if (!exists) return ctx.reply(`${bold("[ ! ]")} Akun tidak ada di WhatsApp.`);

            if (account === senderJid) return ctx.reply(`${bold("[ ! ]")} Tidak dapat digunakan pada diri Anda sendiri.`);

            await ctx._client.groupParticipantsUpdate(ctx.id, [account], "add");

            return ctx.reply(`${bold("[ ! ]")} Berhasil ditambahkan!`);
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(`${bold("[ ! ]")} Terjadi kesalahan: ${error.message}`);
        }
    }
};