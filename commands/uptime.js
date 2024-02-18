module.exports = {
    name: 'uptime',
    category: 'info',
    code: async (ctx) => {
        const startTime = global.system.startTime;
        return ctx.reply(`Bot telah aktif selama ${convertMsToDuration(Date.now() - startTime) || 'kurang dari satu detik.'}.`);
    }
};

function convertMsToDuration(ms) {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor(ms / (1000 * 60 * 60));
    let durationString = '';
    if (hours > 0) {
        durationString += hours + ' jam ';
    }
    if (minutes > 0) {
        durationString += minutes + ' menit ';
    }
    if (seconds > 0) {
        durationString += seconds + ' detik';
    }
    return durationString;
}