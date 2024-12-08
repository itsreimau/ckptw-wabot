const {
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const {
    MessageType
} = require("@mengkodingan/ckptw/lib/Constant");

module.exports = {
    name: "chatgpt",
    aliases: ["ai", "chatai", "gpt", "openai"],
    category: "ai",
    handler: {},
    code: async (ctx) => {
        if (await handler(ctx, module.exports.handler)) return;

        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(tools.msg.generateInstruction(["send"], [ "image","text"]))}\n` +
            `${quote(tools.msg.generateCommandExample(ctx._used.prefix + ctx._used.command, "apa itu bot whatsapp?"))}\n` +
            quote(tools.msg.generateNotes(["AI ini dapat melihat media dan menjawab pertanyaan tentangnya. Kirim media dan tanyakan apa saja!"]))
        );

        const msgType = ctx.getMessageType();
        const [checkMedia, checkQuotedMedia] = await Promise.all([
            tools.general.checkMedia(msgType, "image", ctx),
            tools.general.checkQuotedMedia(ctx.quoted, "image")
        ]);

        try {
            const style = `You are a WhatsApp bot called ${config.bot.name}, owned by ${config.owner.name}. If your name matches or is similar to a well-known character, adopt a personality that fits that character. If it does not, stay friendly, informative, and responsive.`;
            const senderNumber = ctx.sender.jid.split(/[:@]/)[0];
            const uid = await db.get(`user.${senderNumber}.uid`);

            if (checkMedia || checkQuotedMedia) {
                const buffer = await ctx.msg.media.toBuffer() || await ctx.quoted?.media.toBuffer();
                const uploadUrl = await tools.general.upload(buffer);
                const apiUrl = tools.api.createUrl("fastrestapis", "/aillm/gpt-4o", {
                    ask: input,
                    imageUrl: uploadUrl,
                    style,
                    sessionId: uid
                });
                const {
                    data
                } = await axios.get(apiUrl, {
                    headers: {
                        "x-api-key": tools.api.listUrl().fastrestapis.APIKey
                    }
                });

                return await ctx.reply(data.response);
            } else {
                const apiUrl = tools.api.createUrl("fastrestapis", "/aillm/gpt-4o", {
                    ask: input,
                    style,
                    sessionId: uid
                });
                const {
                    data
                } = await axios.get(apiUrl, {
                    headers: {
                        "x-api-key": tools.api.listUrl().fastrestapis.APIKey
                    }
                });

                return await ctx.reply(data.response);
            }
        } catch (error) {
            console.error(`[${config.pkg.name}] Error:`, error);
            if (error.status !== 200) return await ctx.reply(config.msg.notFound);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};