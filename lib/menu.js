const {
    convertMsToDuration
} = require('./simple.js')
const {
    bold
} = require("@mengkodingan/ckptw");
const fs = require('fs')
const moment = require('moment-timezone');
const currentTime = moment().tz('Asia/Jakarta');

function generateGreetingsTime() {
    const hours = currentTime.format('HH:mm:ss');
    let greetingsTime;

    if (currentTime.isBefore(moment('03:00:00', 'HH:mm:ss'))) {
        greetingsTime = 'Selamat tengah malam';
    } else if (currentTime.isBefore(moment('05:00:00', 'HH:mm:ss'))) {
        greetingsTime = 'Selamat subuh';
    } else if (currentTime.isBefore(moment('10:00:00', 'HH:mm:ss'))) {
        greetingsTime = 'Selamat pagi';
    } else if (currentTime.isBefore(moment('15:00:00', 'HH:mm:ss'))) {
        greetingsTime = 'Selamat siang';
    } else if (currentTime.isBefore(moment('18:00:00', 'HH:mm:ss'))) {
        greetingsTime = 'Selamat sore';
    } else if (currentTime.isBefore(moment('19:00:00', 'HH:mm:ss'))) {
        greetingsTime = 'Selamat petang';
    } else {
        greetingsTime = 'Selamat malam';
    }

    return greetingsTime;
}
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

    const packageJson = require('../package.json');
    const weton = ['Pahing', 'Pon', 'Wage', 'Kliwon', 'Legi'][Math.floor(currentTime / 84600000) % 5];
    const week = currentTime.format('dddd');
    const date = currentTime.format('D MMMM YYYY');
    const time = currentTime.format('HH:mm:ss');
    const readmore = '\u200E'.repeat(4001);

    let text = `${generateGreetingsTime()} ${ctx.sender.pushName}, berikut adalah daftar perintah yang tersedia!\n` +
        `\n` +
        `• Perpustakaan: @mengkodingan/ckptw\n` +
        `• Fungsi: Asisten\n` +
        `\n` +
        `╭ • Waktu aktif: ${convertMsToDuration(Date.now() - global.system.startTime) || 'kurang dari satu detik.'})}\n` +
        `│ • Hari: ${week} ${weton}\n` +
        `│ • Waktu: ${time}\n` +
        `│ • Tanggal: ${date}\n` +
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