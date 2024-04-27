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
    name: 'ppcouple',
    aliases: ['ppcp'],
    category: 'internet',
    code: async (ctx) => {
        const handlerObj = await handler(ctx, {
            banned: true
        });

        if (handlerObj.status) return ctx.reply(handlerObj.message);

        try {
            const apiUrl = createAPIUrl('sandipbaruwal', '/dp', {});
            const response = await fetch(apiUrl);

            if (!response.ok) throw new Error(global.msg.notFound);

            const data = await response.json();

            await ctx.reply({
                image: {
                    url: data.male
                },
                caption: 'Ini adalah foto profil untuk pria.'
            });
            return await ctx.reply({
                image: {
                    url: data.female
                },
                caption: 'Ini adalah foto profil untuk wanita.'
            });
        } catch (error) {
            console.error('Error:', error);
            return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    }
};