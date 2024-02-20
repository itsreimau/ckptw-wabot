const {
    convertMsToDuration
} = require('./simple.js');
const {
    bold
} = require("@mengkodingan/ckptw");

function getCurrentDateTime() {
    const now = new Date().toLocaleString('id-ID', {
        timeZone: 'Asia/Jakarta'
    });
    const [date, time] = now.split(' ');
    const currentHour = new Date().toLocaleTimeString('id-ID', {
        hour: 'numeric',
        hour12: false
    });
    const currentDayIndex = new Date().getDay();
    const weekDays = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const wetonIndex = Math.floor(new Date() / 84600000) % 5;

    return {
        date,
        time,
        currentHour: parseInt(currentHour),
        currentDayIndex,
        weekDays,
        wetonIndex
    };
}

function generateGreetingsTime(currentHour) {
    const greetingsTimes = ['Selamat malam', 'Selamat malam', 'Selamat malam', 'Selamat subuh', 'Selamat pagi', 'Selamat siang', 'Selamat sore', 'Selamat petang', 'Selamat malam'];
    return greetingsTimes[Math.floor(currentHour / 3)];
}

exports.getMenu = (ctx) => {
    const {
        date,
        time,
        currentHour,
        currentDayIndex,
        weekDays,
        wetonIndex
    } = getCurrentDateTime();
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

    if (!commandsMap || commandsMap.size === 0) return `${bold('[ ! ]')} Terjadi kesalahan: Tidak ada perintah yang ditemukan.`;

    const sortedCategories = Object.keys(tags);
    const packageJson = require('../package.json');
    const weton = ['Pahing', 'Pon', 'Wage', 'Kliwon', 'Legi'][wetonIndex];
    const readmore = '\u200E'.repeat(4001);

    let text = `${generateGreetingsTime(currentHour)} ${ctx.sender.pushName}, berikut adalah daftar perintah yang tersedia!\n` +
        `\n` +
        `• Perpustakaan: @mengkodingan/ckptw\n` +
        `• Fungsi: Asisten\n` +
        `\n` +
        `╭ • Waktu aktif: ${convertMsToDuration(Date.now() - global.system.startTime) || 'kurang dari satu detik.'}\n` +
        `│ • Hari: ${weekDays[currentDayIndex]} ${weton}\n` +
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
    }

    text += `Dibuat oleh iblmln.rf.gd | Take care of yourself.`;

    return text;
};