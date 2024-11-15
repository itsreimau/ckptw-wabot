const {
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const {
    MessageType
} = require("@mengkodingan/ckptw/lib/Constant");

module.exports = {
    name: "chatgpt",
    aliases: ["ai", "chatai", "gpt", "gpt4"],
    category: "ai",
    handler: {
        banned: true,
        cooldown: true
    },
    code: async (ctx) => {
        const status = await handler(ctx, module.exports.handler);
        if (status) return;

        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(tools.msg.generateInstruction(["send"], ["text", "image", "gif", "sticker"]))}\n` +
            `${quote(tools.msg.generateCommandExample(ctx._used.prefix + ctx._used.command, "apa itu bot whatsapp?"))}\n` +
            quote(tools.msg.generateNotes(["AI ini dapat melihat gambar dan menjawab pertanyaan tentangnya. Kirim gambar dan tanyakan apa saja!"]))
        );

        const msgType = ctx.getMessageType();
        const [checkMedia, checkQuotedMedia] = await Promise.all([
            tools.general.checkMedia(msgType, ["image", "gif", "sticker"], ctx),
            tools.general.checkQuotedMedia(ctx.quoted, ["image", "gif", "sticker"])
        ]);

        try {
            if (checkMedia || checkQuotedMedia) {
                const buffer = await ctx.msg.media.toBuffer() || await ctx.quoted?.media.toBuffer();
                const uploadUrl = await tools.general.upload(buffer);
                const apiUrl = tools.api.createUrl("miyan", "/ai", {
                    file_url: uploadUrl,
                    text: input
                });
                const {
                    data
                } = await axios.get(apiUrl);

                return await ctx.reply(data.result);
            } else {
                const senderNumber = ctx.sender.jid.split(/[:@]/)[0];
                const uid = await db.get(`user.${senderNumber}.uid`)
                const apiUrl = tools.api.createUrl("miyan", "/ai", {
                    prompt: `You are a WhatsApp bot called ${config.bot.name}, created and managed by ${config.owner.name}. If your name matches or is similar to a well-known character, adopt a personality that fits that character. If it does not, stay friendly, informative, and responsive.`, // Dapat diubah sesuai keinginan Anda
                    userid: uid,
                    text: input
                });
                const {
                    data
                } = await axios.get(apiUrl);

                return await ctx.reply(data.result);
            }
        } catch (error) {
            console.error(`[${config.pkg.name}] Error:`, error);
            if (error.status !== 200) return await ctx.reply(config.msg.notFound);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};