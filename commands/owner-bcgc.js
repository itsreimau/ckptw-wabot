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
    category: 'owner',
    code: async (ctx) => {
        const input = ctx._args.join(' ');

        if (!input) return ctx.reply(
            `${global.msg.argument}\n` +
            `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} halo!`)}`
        );

        if (!isOwner(ctx)) return ctx.reply(global.msg.owner);

        try {
            const delay = time => new Promise(res => setTimeout(res, time));
            const getGroups = await ctx._client.groupFetchAllParticipating();
            const groups = Object.entries(getGroups).slice(0).map(entry => entry[1]);
            const anu = groups.map(v => v.id);

            ctx.reply(`Mengirim siaran ke ${anu.length} obrolan grup, perkiraan waktu penyelesaian adalah ${anu.length * 0,5} detik.`);

            for (let i of anu) {
                await delay(500);
                const fakeQuoted = {
                    key: {
                        fromMe: false,
                        'participant': '0@s.whatsapp.net',
                        'remoteJid': 'status@broadcast'
                    },
                    'message': {
                        orderMessage: {
                            itemCount: 99999,
                            status: 200,
                            surface: 200,
                            message: global.msg.footer,
                            orderTitle: ctx._sender.jid,
                            sellerJid: '0@s.whatsapp.net'
                        }
                    },
                    contextInfo: {
                        'forwardingScore': 999,
                        'isForwarded': true
                    },
                    sendEphemeral: true
                }

                ctx.sendMessage(i, {
                    text: input,
                    contextInfo: {
                        externalAdReply: {
                            title: '📣 Broadcast',
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

            ctx.reply(`Berhasil mengirimkan siaran ke ${anu.length} obrolan grup.`);
        } catch (error) {
            console.error('Error:', error);
            return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    }
};