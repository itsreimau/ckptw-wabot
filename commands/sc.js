module.exports = {
    name: 'sc',
    aliases: ['script', 'source', 'sourcecode'],
    category: 'info',
    code: async (ctx) => {
        return ctx.reply(
            `Hai ${ctx._sender.pushName}, bot WhatsApp ini menggunakan:\n` +
            `https://github.com/itsreimau/ckptw-wabot`
        );
    }
};