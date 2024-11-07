const {
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "join",
    category: "owner",
    handler: {
        owner: true
    },
    code: async (ctx) => {
        const status = await handler(ctx, module.exports.handler);
        if (status) return;

        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(tools.msg.generateCommandExample(ctx._used.prefix + ctx._used.command, "https://example.com/"))
        );

        const urlRegex = /chat\.whatsapp\.com\/([0-9A-Za-z]{20,24})/i;
        const match = input.match(urlRegex);
        if (!match) return await ctx.reply(config.msg.urlInvalid);

        try {
            const urlCode = match[1];
            const res = await ctx.groups.acceptInvite(urlCode);
            const members = await ctx.group().members();
            const participantsIds = members.map(user => user.id);

            await ctx.sendMessage(res, {
                text: quote(`👋 Halo! Saya adalah Bot WhatsApp bernama ${config.bot.name}, dimiliki oleh ${config.owner.name}. Saya bisa melakukan banyak perintah, seperti membuat stiker, menggunakan AI untuk pekerjaan tertentu, dan beberapa perintah berguna lainnya. Saya di sini untuk menghibur dan menyenangkan Anda!`)
            }, {
                mentions: participantsIds
            });

            return await ctx.reply(quote(`✅ Berhasil bergabung dengan grup!`));
        } catch (error) {
            console.error(`[${config.pkg.name}] Error:`, error);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};