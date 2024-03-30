const {
    createAPIUrl
} = require('../lib/api.js');
const {
    isOwner
} = require('../lib/simple.js');
const {
    bold,
    monospace
} = require('@mengkodingan/ckptw');

module.exports = {
    name: 'bcgc',
    aliases: ['broadcastgc'],
    category: 'fun',
    code: async (ctx) => {
        const input = ctx._args.join(' ');

        if (!input) return ctx.reply(
            `${global.msg.argument}\n` +
            `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} halo!`)}`
        );

        if (!isOwner(ctx)) return ctx.reply(global.msg.owner);

        try {
            const getGroups = await conn.groupFetchAllParticipating()
            const groups = Object.entries(getGroups).slice(0).map(entry => entry[1])
            const anu = groups.map(v => v.id)

            ctx.reply(`Mengirim siaran ke ${anu.length} obrolan grup, perkiraan waktu penyelesaian adalah ${anu.length * 0,5} detik.`)

            for (let i of anu) {
                await delay(500)
                ctx.sendMessage(i, {
                    text: input,
                    contextInfo: {
                        externalAdReply: {
                            title: 'B R O A D C A S T',
                            body: null,
                            thumbnailUrl: global.bot.thumbnail,
                            sourceUrl: global.bot.groupChat,
                            mediaType: 1,
                            renderLargerThumbnail: true
                        }
                    }
                }, {
                    quoted: ctx._msg
                });
            }

            ctx.reply(`Berhasil mengirimkan siaran ke ${anu.length} obrolan grup.`)
        } catch (error) {
            console.error('Error:', error);
            return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    }
};