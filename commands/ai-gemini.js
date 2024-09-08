const {
    monospace,
    quote
} = require("@mengkodingan/ckptw");
const {
    MessageType
} = require("@mengkodingan/ckptw/lib/Constant");
const axios = require("axios");
const mime = require("mime-types");
const {
    uploadByBuffer
} = require("telegraph-uploader");

module.exports = {
    name: "gemini",
    category: "ai",
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

        const input = ctx.args.join(" ") || null;

        if (!input) return ctx.reply(
            `${quote(`📌 ${await global.tools.msg.translate(global.msg.argument, userLanguage)}`)}\n` +
            `${quote(`${await global.tools.msg.translate("Contoh", userLanguage)}: ${monospace(`${ctx._used.prefix + ctx._used.command} apa itu whatsapp?`)}`)}\n` +
            quote(await global.tools.msg.translate("Catatan: AI ini dapat melihat gambar dan menjawab pertanyaan tentangnya. Kirim gambar dan tanyakan apa saja!", userLanguage))
        );

        const msgType = ctx.getMessageType();

        try {
            if (msgType !== MessageType.imageMessage || msgType !== MessageType.videoMessage || !ctx.quoted?.conversation) {
                const apiUrl = global.tools.api.createUrl("sandipbaruwal", "/gemini", {
                    prompt: input
                });
                const {
                    data
                } = await axios.get(apiUrl);

                return ctx.reply(data.answer);
            } else {
                const buffer = await ctx.msg.media.toBuffer() || await ctx.quoted?.media.toBuffer();
                const uploadResponse = await uploadByBuffer(buffer, mime.lookup("png"));
                const apiUrl = global.tools.api.createUrl("sandipbaruwal", `/gemini2`, {
                    prompt: input,
                    url: uploadResponse.link
                });
                const {
                    data
                } = await axios.get(apiUrl);

                return ctx.reply(data.answer);
            }
        } catch (error) {
            console.error("Error:", error);
            if (error.status !== 200) return ctx.reply(`⛔ ${await global.tools.msg.translate(global.msg.notFound, userLanguage)}`);
            return ctx.reply(quote(`⚠ ${await global.tools.msg.translate("Terjadi kesalahan", userLanguage)}: ${error.message}`));
        }
    }
};