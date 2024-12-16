const {
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const {
    MessageType
} = require("@mengkodingan/ckptw/lib/Constant");

module.exports = {
    name: "blackbox",
    aliases: ["bb"],
    category: "ai-chat",
    handler: {
        coin: [10, "text", 1]
    },
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
            const model = "blackbox";

            if (checkMedia || checkQuotedMedia) {
                const buffer = await ctx.msg.media.toBuffer() || await ctx.quoted?.media.toBuffer();
                const uploadUrl = await tools.general.upload(buffer);
                const apiUrl = tools.api.createUrl("fasturl", "/aillm/blackbox", {
                    ask: input,
                    model,
                    imageUrl: uploadUrl
                }, null, ["imageUrl"]);
                const {
                    data
                } = await axios.get(apiUrl, {
                    headers: {
                        "x-api-key": tools.api.listUrl().fasturl.APIKey
                    }
                });

                return await ctx.reply(data.response);
            } else {
                const apiUrl = tools.api.createUrl("fasturl", "/aillm/blackbox", {
                    ask: input,
                    model
                });
                const {
                    data
                } = await axios.get(apiUrl, {
                    headers: {
                        "x-api-key": tools.api.listUrl().fasturl.APIKey
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