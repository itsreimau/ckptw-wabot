const {
    convertMsToDuration
} = require('./simple.js')
const {
    bold
} = require('@mengkodingan/ckptw');
const fs = require('fs')
const moment = require('moment-timezone');

moment.tz.setDefault('Asia/Jakarta').locale('id');
const dt = moment(Date.now()).tz('Asia/Jakarta').locale('id').format('a')
const ucapanWaktu = 'Selamat ' + dt.charAt(0).toUpperCase() + dt.slice(1)
const packageJson = require('../package.json');
const readmore = '\u200E'.repeat(4001);

exports.getMenu = (ctx) => {
    const commandsMap = ctx._self.cmd;
    const tags = {
        'main': 'Main',
        'ai': 'AI',
        'downloader': 'Downloader',
        'converter': 'Converter',
        'fun': 'Fun',
        'game': 'Game',
        'internet': 'Internet',
        'tools': 'Tools',
        'info': 'Info',
        'owner': 'Owner',
        '': 'No Category'
    };

    if (!commandsMap || commandsMap.size === 0) {
        return `${bold('[ ! ]')} Terjadi kesalahan: Tidak ada perintah yang ditemukan.`;
    }

    const sortedCategories = Object.keys(tags);

    let text = `${ucapanWaktu} ${ctx.sender.pushName !== undefined ? ctx.sender.pushName : 'Kak'}, berikut adalah daftar perintah yang tersedia!\n` +
        `\n` +
        `• Perpustakaan: @mengkodingan/ckptw\n` +
        `• Fungsi: Asisten\n` +
        `\n` +
        `╭ • Waktu aktif: ${convertMsToDuration(Date.now() - global.system.startTime) || 'kurang dari satu detik.'}\n` +
        `│ • Tanggal: ${moment.tz('Asia/Jakarta').format('DD/MM/YY')}\n` +
        `│ • Waktu: ${moment.tz('Asia/Jakarta').format('HH:mm:ss')}\n` +
        `│ • Versi: ${packageJson.version}\n` +
        `╰ • Prefix: ${ctx._used.prefix}\n` +
        `${readmore}\n`;

    for (const category of sortedCategories) {
        const categoryCommands = Array.from(commandsMap.values())
            .filter(command => command.category === category)
            .map(command => ({
                name: command.name,
                aliases: command.aliases
            }));

        if (categoryCommands.length > 0) {
            text += `╭─「 ${bold(tags[category])} 」\n`;

            if (category === 'main') {
                text += `│ • ${categoryCommands.map(cmd => `${ctx._used.prefix || '/'}${cmd.name}${cmd.aliases ? `\n│ • ${cmd.aliases.map(alias => `${ctx._used.prefix || '/'}${alias}`).join('\n│ • ')}` : ''}`).join("\n│ • ")}\n`;
            } else {
                text += `│ • ${categoryCommands.map(cmd => `${ctx._used.prefix || '/'}${cmd.name}`).join("\n│ • ")}\n`;
            }

            text += `╰────\n\n`;
        }
    };

    text += `Dibuat oleh iblmln.rf.gd | Take care of yourself.`;

    return text;
};
