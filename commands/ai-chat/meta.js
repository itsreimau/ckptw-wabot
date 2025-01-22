const {
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const mime = require("mime");

module.exports = {
    name: "meta",
    aliases: ["metaai"],
    category: "ai-chat",
    handler: {
        coin: 10
    },
    code: async (ctx) => {
        if (await handler(ctx, module.exports.handler)) return;

        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(tools.msg.generateCommandExample(ctx._used, "apa itu bot whatsapp?"))
        );

        try {
            const senderId = ctx.sender.jid.split(/[:@]/)[0];
            const uid = await db.get(`user.${senderId}.uid`) || "guest";
            const apiUrl = tools.api.createUrl("fasturl", "/aillm/meta", {
                ask: input,
                sessionId: uid
            });
            const {
                data
            } = await axios.get(apiUrl);
            const result = data.result;

            if (result.imagine_card && result.animated_media && result.imagine_card.length > 0 && result.animated_media.length > 0) {
                const mediaIndex = Math.floor(Math.random() * result.imagine_card[0].imagine_media.length);
                const selectedImagine = result.imagine_card[0].imagine_media[mediaIndex];
                const selectedAnimated = result.animated_media[mediaIndex];

                return await Promise.all([
                    ctx.reply({
                        image: {
                            url: selectedImagine.uri
                        },
                        mimetype: mime.lookup("png"),
                        caption: "Image"
                    }),
                    ctx.reply({
                        video: {
                            url: selectedAnimated.url
                        },
                        mimetype: mime.lookup("mp4"),
                        caption: Animation "
                    })
                ]);
            }

            return await ctx.reply(result.message);
        } catch (error) {
            console.error(`[${config.pkg.name}] Error:`, error);
            if (error.status !== 200) return await ctx.reply(config.msg.notFound);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};