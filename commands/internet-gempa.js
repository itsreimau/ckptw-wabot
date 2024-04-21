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
        const bmkgUrl = 'https://data.bmkg.go.id/DataMKG/TEWS/';
        const apiUrl = await createAPIUrl(bmkgUrl, 'autogempa.json', {});

        try {
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (!data) throw new Error(global.msg.notFound);

            return await ctx.reply({
                image: {
                    url: bmkgUrl + data.Shakemap
                },
                caption: `❖ ${bold('Gempa Bumi')}\n` +
                    `\n` +
                    `${data.Wilayah}\n` +
                    '-----\n' +
                    `➤ Tanggal: ${data.Tanggal}\n` +
                    `➤ Potensi: ${data.Potensi}\n` +
                    `➤ Magnitude: ${data.Magnitude}\n` +
                    `➤ Kedalaman: ${data.Kedalaman}\n` +
                    `➤ Koordinat: ${data.Coordinates}\n` +
                    `➤ Dirasakan: ${data.Dirasakan}\n` +
                    `\n` +
                    global.msg.footer
            });
        } catch (error) {
            console.error('Error:', error);
            return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    }
};