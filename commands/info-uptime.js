const {
     m.k 
} = require('../lib/simple.js');

module.exports = {
    name: 'uptime',
    category: 'info',
    code: async (ctx) => {
        const startTime = global.system.startTime;
        return ctx.reply(`Bot telah aktif selama ${convertMsToDuration(Date.now() - startTime) || 'kurang dari satu detik.'}.`);
    }
};