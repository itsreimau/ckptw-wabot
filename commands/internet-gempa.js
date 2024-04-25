const {
    handler
} = require('../handler.js');
const {
    createAPIUrl
} = require('../lib/api.js');
const {
    bold,
    monospace
} = require('@mengkodingan/ckptw');

module.exports = {
    name: 'gempa',
    aliases: ['gempabumi'],
    category: 'internet',
    code: async (ctx) => {
        const handlerObj = await handler(ctx, {
            banned: true
        });

        if (handlerObj.status) return ctx.reply(handlerObj.message);

        const apiUrl = await createAPIUrl('https://data.bmkg.go.id', '/DataMKG/TEWS/autogempa.json', {});

        try {
            const response = await fetch(apiUrl);

            if (!response.ok) throw new Error(global.msg.notFound);

            const data = await response.json();
            const gempa = data.Infogempa.gempa;

            return await ctx.reply({
                image: {
                    url: `https://data.bmkg.go.id/DataMKG/TEWS/${gempa.Shakemap}`
                },
                caption: `❖ ${bold('Gempa Bumi')}\n` +
                    '\n' +
                    `${gempa.Wilayah}\n` +
                    '-----\n' +
                    `➤ Tanggal: ${gempa.Tanggal}\n` +
                    `➤ Potensi: ${gempa.Potensi}\n` +
                    `➤ Magnitude: ${gempa.Magnitude}\n` +
                    `➤ Kedalaman: ${gempa.Kedalaman}\n` +
                    `➤ Koordinat: ${gempa.Coordinates}\n` +
                    `➤ Dirasakan: ${gempa.Dirasakan}\n` +
                    '\n' +
                    global.msg.footer
            });
        } catch (error) {
            console.error('Error:', error);
            return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    }
};