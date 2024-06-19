const {
    isAdmin
} = require("../tools/simple.js");
const {
    bold,
    monospace
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "add",
    category: "group",
    code: async (ctx) => {
        const handlerObj = await global.handler(ctx, {
            admin: true,
            banned: true,
            botAdmin: true,
            group: true
        });

        if (handlerObj.status) return ctx.reply(handlerObj.message);

        const input = ctx._args.join(" ");


        if (!input) return ctx.reply(
            `${global.msg.argument}\n` +
            `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} ${ctx._client.user.id.split(":")[0]}`)}`
        );

        try {
            const member = `${input.replace(/[^\d]/g, "")}@s.whatsapp.net`;

            if (member === senderJid) return ctx.reply(`${bold("[ ! ]")} Tidak dapat digunakan pada diri Anda sendiri.`);

            if ((await isAdmin(ctx, member)) === 1) return ctx.reply(`${bold("[ ! ]")} Anggota ini adalah admin grup.`);

            await ctx._client.groupParticipantsUpdate(ctx.id, [member], "add");

            return ctx.reply(`${bold("[ ! ]")} Berhasil dikeluarkan!`);
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(`${bold("[ ! ]")} Terjadi kesalahan: ${error.message}`);
        }
    }
};