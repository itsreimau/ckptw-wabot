const axios = require("axios");
const {
    monospace
} = require("@mengkodingan/ckptw");
const mime = require("mime-types");
const {
    format
} = require("util");

module.exports = {
    name: "fetch",
    aliases: ["get"],
    category: "tools",
    code: async (ctx) => {
        const {
            status,
            message
        } = await global.handler(ctx, {
            banned: true,
            coin: 3
        });
        if (status) return ctx.reply(message);

        const url = ctx._args[0];

        if (!url) return ctx.reply(
            `${global.msg.argument}\n` +
            `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} https://example.com/`)}`
        );

        const urlRegex = /((([A-Za-z]{39}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)\b/i;
        if (!urlRegex.test(url)) return ctx.reply(global.msg.urlInvalid);

        try {
            const response = await axios.get(url, {
                responseType: "arraybuffer"
            });
            const contentType = response?.headers?.['content-type'];

            if (/image/.test(contentType)) {
                let fileName = /filename/i.test(response?.headers?.['content-disposition']) ? response?.headers?.['content-disposition']?.match(/filename=(.*)/)?.[1]?.replace(/["';]/g, '') : '';
                return ctx.reply({
                    image: response?.data,
                    mimetype: mime.contentType(contentType)
                });
            }

            if (/audio/.test(contentType)) {
                let fileName = /filename/i.test(response?.headers?.['content-disposition']) ? response?.headers?.['content-disposition']?.match(/filename=(.*)/)?.[1]?.replace(/["';]/g, '') : '';
                return ctx.reply({
                    audio: response?.data,
                    mimetype: mime.contentType(contentType)
                });
            }

            if (/webp/.test(contentType)) return ctx.reply({
                sticker: response?.data
            });

            if (!/utf-8|json|html|plain/.test(contentType)) {
                let fileName = /filename/i.test(response?.headers?.['content-disposition']) ? response?.headers?.['content-disposition']?.match(/filename=(.*)/)?.[1]?.replace(/["';]/g, '') : '';
                return ctx.reply({
                    document: response?.data,
                    fileName,
                    mimetype: mime.contentType(contentType)
                });
            }

            let text = response?.data?.toString() || response?.data;
            text = format(text);
            try {
                ctx.reply(text.slice(0, 65536) + '');
            } catch (e) {
                ctx.reply(format(e));
            }
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(`${bold("[ ! ]")} Terjadi kesalahan: ${error.message}`);
        }
    }
};