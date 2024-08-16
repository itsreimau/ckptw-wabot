const {
    bold,
    monospace,
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "join",
    category: "owner",
    code: async (ctx) => {
        const {
            status,
            message
        } = await global.handler(ctx, {
            owner: true
        });
        if (status) return ctx.reply(message);

        const input = ctx._args.join(" ") || null;

        if (!input) return ctx.reply(
            `${quote(global.msg.argument)}\n` +
            quote(`Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} ${global.bot.groupChat}`)}`)
        );

        const urlRegex = /chat\.whatsapp\.com\/([0-9A-Za-z]{20,24})/i;
        if (!input.match(urlRegex)) return ctx.reply(global.msg.urlInvalid);

        try {
            const urlCode = match[1];
            const res = await ctx.groups.acceptInvite(urlCode);
            const members = await ctx.group().members();
            const participantsIds = members.map(user => user.id);

            await ctx.sendMessage(res, {
                text: quote(`⚠ Halo! Saya adalah Bot WhatsApp bernama ${global.bot.name}, dimiliki oleh ${global.owner.name}. Saya bisa melakukan banyak perintah, seperti membuat stiker, menggunakan AI untuk pekerjaan tertentu, dan beberapa perintah berguna lainnya. Saya di sini untuk menghibur dan menyenangkan Anda!`)
            }, {
                mentions: participantsIds
            });

            return await ctx.reply(quote(`⚠ Berhasil bergabung dengan grup!`));
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(quote(`⚠ Terjadi kesalahan: ${error.message}`));
        }
    }
};