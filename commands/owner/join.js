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
        global.handler(ctx, module.exports.handler).then(({
            status,
            message
        }) => {
            if (status) return ctx.reply(message);
        });

        const input = ctx.args.join(" ") || null;

        if (!input) return ctx.reply(
            `${quote(global.tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(global.tools.msg.generateCommandExample(ctx._used.prefix + ctx._used.command, global.config.bot.groupChat))
        );

        const urlRegex = /chat\.whatsapp\.com\/([0-9A-Za-z]{20,24})/i;
        const match = input.match(urlRegex);
        if (!match) return ctx.reply(global.config.msg.urlInvalid);

        try {
            const urlCode = match[1];
            const res = await ctx.groups.acceptInvite(urlCode);
            const members = await ctx.group().members();
            const participantsIds = members.map(user => user.id);

            await ctx.sendMessage(res, {
                text: quote(`👋 Halo! Saya adalah Bot WhatsApp bernama ${global.config.bot.name}, dimiliki oleh ${global.config.owner.name}. Saya bisa melakukan banyak perintah, seperti membuat stiker, menggunakan AI untuk pekerjaan tertentu, dan beberapa perintah berguna lainnya. Saya di sini untuk menghibur dan menyenangkan Anda!`)
            }, {
                mentions: participantsIds
            });

            return await ctx.reply(quote(`✅ Berhasil bergabung dengan grup!`));
        } catch (error) {
            console.error(`[${global.config.pkg.name}] Error:`, error);
            return ctx.reply(quote(`❎ Terjadi kesalahan: ${error.message}`));
        }
    }
};