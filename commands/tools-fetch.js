const axios = require("axios");
const {
    monospace,
    quote
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
        const [userLanguage] = await Promise.all([
            global.db.get(`user.${ctx.sender.jid.replace(/@.*|:.*/g, "")}.language`)
        ]);

        const {
            status,
            message
        } = await global.handler(ctx, {
            banned: true,
            coin: 3
        });
        if (status) return ctx.reply(message);

        const url = ctx.args[0] || null;

        if (!url) return ctx.reply(
            `${quote(`📌 ${await global.tools.msg.translate(global.msg.argument, userLanguage)}`)}\n` +
            quote(`${await global.tools.msg.translate("Contoh", userLanguage)}: ${monospace(`${ctx._used.prefix + ctx._used.command} https://example.com/`)}`)
        );

        const urlRegex = /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/i;
        if (!urlRegex.test(url)) return ctx.reply(global.msg.urlInvalid);

        try {
            const response = await axios.get(url);
            const contentType = response.headers["content-type"];

            if (/image/.test(contentType)) {
                let fileName = /filename/i.test(response.headers["content-disposition"]) ? response.headers["content-disposition"].match(/filename=(.*)/)?.[1]?.replace(/["";]/g, "") : "";
                return ctx.reply({
                    image: response.data,
                    mimetype: mime.contentType(contentType)
                });
            }

            if (/video/.test(contentType)) {
                let fileName = /filename/i.test(response.headers["content-disposition"]) ? response.headers["content-disposition"].match(/filename=(.*)/)?.[1]?.replace(/["";]/g, "") : "";
                return ctx.reply({
                    video: response.data,
                    mimetype: mime.contentType(contentType)
                });
            }

            if (/audio/.test(contentType)) {
                let fileName = /filename/i.test(response.headers["content-disposition"]) ? response.headers["content-disposition"].match(/filename=(.*)/)?.[1]?.replace(/["";]/g, "") : "";
                return ctx.reply({
                    audio: response.data,
                    mimetype: mime.contentType(contentType)
                });
            }

            if (/webp/.test(contentType)) return ctx.reply({
                sticker: response.data
            });

            if (!/utf-8|json|html|plain/.test(contentType)) {
                let fileName = /filename/i.test(response.headers["content-disposition"]) ? response.headers["content-disposition"].match(/filename=(.*)/)?.[1]?.replace(/["";]/g, "") : "";
                return ctx.reply({
                    document: response.data,
                    fileName,
                    mimetype: mime.contentType(contentType)
                });
            }

            let text = response.data;
            text = format(text);
            try {
                ctx.reply(text.slice(0, 65536) + "");
            } catch (e) {
                ctx.reply(format(e));
            }
        } catch (error) {
            console.error("Error:", error);
            if (error.status !== 200) return ctx.reply(`⛔ ${await global.tools.msg.translate(global.msg.notFound, userLanguage)}`);
            return ctx.reply(quote(`⚠ ${await global.tools.msg.translate("Terjadi kesalahan", userLanguage)}: ${error.message}`));
        }
    }
};