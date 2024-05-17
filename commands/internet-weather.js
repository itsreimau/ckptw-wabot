const {
    createAPIUrl
} = require('../tools/api.js');
const {
    ucword
} = require('../tools/simple.js');
const {
    bold,
    monospace
} = require('@mengkodingan/ckptw');
const axios = require('axios');
const {
    translate
} = require('bing-translate-api');

module.exports = {
    name: 'weather',
    aliases: ['cuaca'],
    category: 'internet',
    code: async (ctx) => {
        const handlerObj = await global.handler(ctx, {
            banned: true,
            coin: 1
        });

        if (handlerObj.status) return ctx.reply(handlerObj.message);

        const input = ctx._args.join(' ');

        if (!input) return ctx.reply(
            `${global.msg.argument}\n` +
            `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} bogor`)}`
        );

        try {
            const apiUrl = await createAPIUrl('https://api.openweathermap.org', '/data/2.5/weather', {
                q: input,
                units: 'metric',
                appid: '060a6bcfa19809c2cd4d97a212b19273'
            });
            const response = await axios.get(apiUrl);

            if (response.status !== 200) throw new Error(global.msg.notFound);

            const data = await response.data;
            const weatherId = await translate(data.weather[0].description, 'en', 'id');
            return ctx.reply(`❖ ${bold('Weather')}\n` +
                '\n' +
                `➤ Tempat: ${data.name} (${data.sys.country})\n` +
                `➤ Cuaca: ${ucword(weatherId.translation)}\n` +
                `➤ Kelembapan: ${data.main.humidity} %\n` +
                `➤ Angin: ${data.wind.speed} km/jam\n` +
                `➤ Suhu saat ini: ${data.main.temp} °C\n` +
                `➤ Suhu tertinggi: ${data.main.temp_max} °C\n` +
                `➤ Suhu terendah: ${data.main.temp_min} °C\n` +
                '\n' +
                global.msg.footer
            );
        } catch (error) {
            console.error('Error:', error);
            return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    }
};