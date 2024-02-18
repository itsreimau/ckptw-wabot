const {
    createAPIUrl
} = require('../lib/api.js');
const {
    bold
} = require('@mengkodingan/ckptw');

const apiEndpoints = {
    'tab': '/sstab',
    'phone': '/ssphone',
    'web': '/ssweb'
};

module.exports = {
    name: 'screenshot',
    aliases: ['ss'],
    category: 'tools',
    code: async (ctx) => {
        const input = ctx._args.join(' ');

        if (!input) {
            return ctx.reply(`${bold('[ ! ]')} Masukkan URL!`);
        }

        try {
            const [type, url] = input.split(' ');

            if (!Object.keys(apiEndpoints).includes(type)) {
                return ctx.reply('❌ Pilih jenis tampilan yang benar: tab, phone, atau web.');
            }

            const apiUrl = createAPIUrl('vihangayt', `/tools${apiEndpoints[type]}`, {
                url: url
            });

            await ctx.reply({
                image: {
                    url: apiUrl
                },
                caption: `• URL: ${input}` +
                    `• Tampilan: ${type === 'tab' ? 'Tab' : type === 'phone' ? 'Ponsel' : 'Web'}`
            });
        } catch (error) {
            console.error('Error:', error);
            return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    }
};