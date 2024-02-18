const {
    bold
} = require("@mengkodingan/ckptw");
const fs = require('fs')
const moment = require('moment-timezone');

function formatType(type) {
    return type.replace(/_/g, ' ')
        .replace(/\b\w/g, (match) => match.toUpperCase());
}

function generateGreetingsTime() {
    const currentTime = moment().tz('Asia/Jakarta');
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

    if (!commandsMap || commandsMap.size === 0) {
        return `${bold('[ ! ]')} Terjadi kesalahan: Tidak ada perintah yang ditemukan.`;
    }

    const sortedCategories = ['main', 'downloader', 'converter', 'fun', 'internet', 'tools', 'info', 'owner'];

    const packageJson = require('../package.json');
    const d = new Date(new Date + 3600000);
    const locale = 'id';
    const weton = ['Pahing', 'Pon', 'Wage', 'Kliwon', 'Legi'][Math.floor(d / 84600000) % 5];
    const week = d.toLocaleDateString(locale, {
        weekday: 'long'
    });
    const date = d.toLocaleDateString(locale, {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    const time = d.toLocaleTimeString(locale, {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
    });
    const readmore = '\u200E'.repeat(4001);

    let text = `${generateGreetingsTime()} ${ctx.sender.pushName}, berikut adalah daftar perintah yang tersedia!\n` +
        `\n` +
        `• Perpustakaan: @mengkodingan/ckptw\n` +
        `• Fungsi: Asisten\n` +
        `\n` +
        `╭ • Total perintah: ${commandsMap.size}\n` +
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
            const formattedType = formatType(category);
            text += `╭─「 ${bold(formattedType)} 」\n`;

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