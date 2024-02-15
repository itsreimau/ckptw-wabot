const {
    bold
} = require("@mengkodingan/ckptw");
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
        return "Error: No commands found.";
    }

    const sortedCategories = ['main', 'downloader', 'converter', 'internet', 'tools', 'info', 'owner'];

    let text = `${generateGreetingsTime()} ${ctx.sender.pushName}, berikut adalah daftar perintah yang tersedia!\n\n`;
    text += `${bold('Total perintah:')} ${commandsMap.size}\n\n`;

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
    }

    text += `Dibuat oleh iblmln.rf.gd | Take care of yourself.`;

    return text;
}

/* getMenu (Manual)
exports.getMenu = (ctx) => {
    const menu = {
        main: ['help', 'menu', '?'],
        convert: ['sticker'],
        downloader: ['fbdl'],
        owner: ['>', 'x', '$'],
        info: ['speed', 'owner', 'sc', 'ping']
    };

    let text = `${generateGreetingsTime()} ${ctx.sender.pushName}, berikut adalah daftar perintah yang tersedia!\n\n`;
    text += `${bold('Total perintah:')} ${Object.values(menu).map(a => a.length).reduce((total, num) => total + num, 0)}\n\n`;

    for (const [type, commands] of Object.entries(menu)) {
        const formattedType = formatType(type);
        text += `╭─「 ${bold(formattedType)} 」\n`;
        if (type === 'owner') {
            text += `│ • ${commands.map(a => `${a}`).join("\n│ • ")}\n`; // Tidak ada prefix untuk perintah Owner
        } else {
            text += `│ • ${commands.map(a => `${ctx._used.prefix || '/'}${a}`).join("\n│ • ")}\n`;
        }
        text += `╰────\n\n`;
    }

    text += `Dibuat oleh iblmln.rf.gd | Take care of yourself.`;

    return text;
}
*/