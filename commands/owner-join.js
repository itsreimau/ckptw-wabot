const {
    bold,
    monospace
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "join",
    category: "owner",
    code: async (ctx) => {
        const handlerObj = await global.handler(ctx, {
            owner: true
        });

        if (handlerObj.status) return ctx.reply(handlerObj.message);

        const input = ctx._args.join(" ");

        if (!input) return ctx.reply(
            `${global.msg.argument}\n` +
            `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} ${global.bot.groupChat}`)}`
        );

        const urlRegex = /chat\.whatsapp\.com\/([0-9A-Za-z]{20,24})/i;
        const match = input.match(urlRegex);
        if (!match) return ctx.reply(global.msg.urlInvalid);

        try {
            const urlCode = match[1];
            const res = await ctx._client.groupAcceptInvite(urlCode);
            const groupInfo = await ctx._client.groupMetadata(res);
            const participantsIds = groupInfo.participants.map(user => user.id);

            await ctx.sendMessage(res, {
                text: `Halo! Saya cat, bot WhatsApp yang terinspirasi oleh karakter anime 'Neon Genesis Evangelion'. Saya bisa melakukan banyak perintah, seperti membuat stiker, menggunakan AI untuk pekerjaan tertentu, dan beberapa perintah berguna lainnya. Saya di sini untuk menghibur dan menyenangkan Anda!\n` +
                    `${global.msg.readmore}\n` +
                    `${monospace('Penafian: cat (bot WhatsApp) adalah proyek kreatif oleh Muhamad Ikbal Maulana dan bukan merupakan bagian resmi dari seri "Neon Genesis Evangelion" atau perusahaan terkait lainnya.')}`
            }, {
                mentions: participantsIds
            });

            return await ctx.reply(`${bold("[ ! ]")} Berhasil bergabung dengan grup!`);
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(`${bold("[ ! ]")} Terjadi kesalahan: ${error.message}`);
        }
    }
};