const {
    handler
} = require('../handler.js');
const {
    bold,
    monospace
} = require('@mengkodingan/ckptw');
const mime = require('mime-types');

module.exports = {
    name: 'fetch',
    category: 'tools',
    code: async (ctx) => {
        const handlerObj = await handler(ctx, {
            banned: true
        });

        if (handlerObj.status) return ctx.reply(handlerObj.message);

        const url = ctx._args[0];

        if (!url) return ctx.reply(
            `${global.msg.argument}\n` +
            `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} https://example.com/`)}`
        );

        try {
            new URL(url);
        } catch {
            return ctx.reply(global.msg.urlInvalid);
        }

        let response;
        try {
            const fetchPromise = fetchWithTimeout(url);
            response = await fetchPromise;
            if (!response.ok) ctx.reply(`${response.statusText} (${response.status})`);
        } catch (error) {
            return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: ${error.message}`);
        }

        const headers = response.headers;
        const status = response.status;
        let data;
        try {
            data = await response.text();
        } catch (error) {
            return ctx.reply(`${bold('[ ! ]')} Terjadi kesalahan: Gagal mendapatkan data respons.`);
        }

        // JSON check.
        try {
            const json = JSON.parse(data);
            return ctx.reply(walkJSON(json));
        } catch {}

        // Image, GIF, video, PDF, file, text check.
        const contentType = headers.get('content-type');
        if (contentType && contentType.startsWith('image/')) {
            return ctx.reply({
                image: {
                    url: url
                },
                caption: null
            });
        } else if (contentType === 'image/gif') {
            return ctx.reply({
                video: {
                    url: url
                },
                caption: null,
                gifPlayback: true
            });
        } else if (contentType === 'video/mp4') {
            return ctx.reply({
                video: {
                    url: url
                },
                caption: null,
                gifPlayback: false
            });
        } else if (contentType === 'application/pdf' || url.endsWith('.pdf')) {
            return ctx.reply({
                document: {
                    url: url
                },
                mimetype: mime.contentType('pdf')
            });
        } else if (contentType === 'application/octet-stream') {
            return ctx.reply({
                document: {
                    url: url
                },
                mimetype: mime.contentType('bin')
            });
        } else {
            console.log('Content-Type:', contentType);
            return ctx.reply(
                `➤ Status: ${status}\n` +
                '➤ Respon:\n' +
                `${data}`
            );
        }
    }
};

async function fetchWithTimeout(url, options = {
    timeout: 10000
}) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), options.timeout);
    const response = await fetch(url, {
        signal: controller.signal
    });
    clearTimeout(timeoutId);
    return response;
}

function walkJSON(json, depth, array) {
    const arr = array || [];
    const d = depth || 0;
    for (const key in json) {
        arr.push('┊'.repeat(d) + (d > 0 ? ' ' : '') + `*${key}:*`);
        if (typeof json[key] === 'object') walkJSON(json[key], d + 1, arr);
        else {
            arr[arr.length - 1] += ' ' + json[key];
        }
    }
    return arr.join('\n');
}