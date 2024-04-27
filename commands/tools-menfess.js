const {
    bold,
    monospace,
    quote
} = require('@mengkodingan/ckptw');

module.exports = {
    name: 'menfess',
    aliases: ['confess'],
    category: 'tools',
    code: async (ctx) => {
        const input = ctx._args.join(' ');

        if (!input) return ctx.reply(
            `${global.msg.argument}\n` +
            `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} ${ctx._client.user.id.split(':')[0]}|Halo dunia!`)}`
        );

        try {
            const [number, text] = input.split('|');
            const numberFormatted = number.replace(/[^\d]/g, '');

            if (numberFormatted === ctx._sender.jid.split('@')[0]) throw new Error('Tidak dapat digunakan pada diri Anda sendiri.');

            await ctx.sendMessage(`${numberFormatted}@s.whatsapp.net`, {
                text: `💌 Hai, saya ${global.bot.name}, seseorang mengirimi Anda pesan melalui menfess ini!\n` +
                    '-----\n' +
                    `${text}\n` +
                    '-----\n' +
                    'Pesan pertama yang Anda kirim akan dikirim ke pengirim pesan ini.\n' +
                    `${global.msg.readmore}\n` +
                    quote(`Mau kirim pesan ke gebetan, mantan, sahabat, pacar, atau siapa pun, tapi nggak mau tahu siapa pengirimnya? Anda dapat menggunakan saya, ketik ${monospace(`${ctx._used.prefix}menfess`)} dan ikuti penggunaannya.`)
            });

            global.db.set(`menfess.${numberFormatted}`, {
                from: ctx._sender.jid.split('@')[0],
                timeStamp: Date.now()
            });

            return ctx.reply('Pesan berhasil terkirim!');
        } catch (error) {
            console.error('Error:', error);
            return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    }
};