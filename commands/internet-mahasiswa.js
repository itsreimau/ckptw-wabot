const {
    createAPIUrl
} = require('../lib/api.js');
const {
    bold,
    monospace
} = require('@mengkodingan/ckptw');

module.exports = {
    name: 'mahasiswa',
    category: 'internet',
    code: async (ctx) => {
        const input = ctx._args.join(' ');

        if (!input) return ctx.reply(
            `${global.msg.argument}\n` +
            `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} sandika`)}`
        );

        try {
            const apiUrl = await createAPIUrl('https://api-frontend.kemdikbud.go.id', `/hit_mhs/${text}`, {});
            const response = await fetch(apiUrl);

            if (!response.ok) throw new Error(global.msg.notFound);

            const data = await response.json();
            let resultText = '';

            data.mahasiswa.forEach(async d => {
                const nama = d.text
                const websiteLink = d['website-link']
                const website = await createAPIUrl('https://pddikti.kemdikbud.go.id', `${websiteLink}`, {});
                resultText += `➤ Nama: ${nama}\n` +
                    `➤ Data ditemukan di situs web: ${website}\n` +
                    `-----\n`;
            });

            return ctx.reply(
                `❖ ${bold('Mahasiswa')}\n` +
                '\n' +
                `${resultText}\n` +
                '\n' +
                global.msg.footer
            )
        } catch (error) {
            console.error('Error:', error);
            return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }
    }
};