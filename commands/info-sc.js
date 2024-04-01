module.exports = {
    name: 'sc',
    aliases: ['script', 'source', 'sourcecode'],
    category: 'info',
    code: async (ctx) => {
        await ctx.reply(
            `❖ ${bold('SC')}\n` +
            `\n` +
            `• https://github.com/itsreimau/ckptw-wabot\n`
            `\n` +
            global.msg.footer
        ); // Jika Anda tidak menghapus ini, terima kasih!
    }
};