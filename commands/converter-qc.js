const {
    createAPIUrl
} = require("../tools/api.js");
const {
    bold,
    monospace
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const {
    Sticker,
    StickerTypes
} = require("wa-sticker-formatter");

module.exports = {
    name: "qc",
    category: "converter",
    code: async (ctx) => {
        const handlerObj = await global.handler(ctx, {
            banned: true,
            coin: 3
        });

        if (handlerObj.status) return ctx.reply(handlerObj.message);

        const input = ctx._args.join(" ");

        if (!input) return ctx.reply(
            `${global.msg.argument}\n` +
            `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} get in the fucking robot, shinji!`)}`
        );

        try {
            if (input.length > 10000) throw new Error("Maksimal 50 kata!");

            const apiUrl = createAPIUrl("https://quote.btch.bz", "/generate", {
                text: input
            });

            let profilePicture;
            try {
                profilePicture = await ctx._client.profilePictureUrl(ctx._sender.jid, "image");
            } catch (_) {
                profilePicture = "https://i.ibb.co/3Fh9V6p/avatar-contact.png";
            }

            const object = {
                type: "quote",
                format: "png",
                backgroundColor: "#000000",
                width: 512,
                height: 768,
                scale: 2,
                messages: [{
                    entities: [],
                    avatar: true,
                    from: {
                        id: 1,
                        name: ctx._sender.pushName,
                        photo: {
                            url: profilePicture,
                        },
                    },
                    text: input,
                    replyMessage: {}
                }]
            };

            const json = await axios.post(apiUrl, object, {
                headers: {
                    "Content-Type": "application/json",
                }
            });

            const buffer = Buffer.from(json.data.result.image, "base64");
            const sticker = new Sticker(buffer, {
                pack: global.sticker.packname,
                author: global.sticker.author,
                type: StickerTypes.FULL,
                categories: ["🤩", "🎉"],
                id: ctx.id,
                quality: 50
            });

            return ctx.reply(await sticker.toMessage());
        } catch (error) {
            console.error("Error:", error);

            let errorMessage;
            if (error.code === 'EPROTO') {
                errorMessage = "Terjadi kesalahan pada protokol SSL/TLS.";
            } else {
                errorMessage = error.message;
            }

            return ctx.reply(`${bold("[ ! ]")} Terjadi kesalahan: ${errorMessage}`);
        }
    }
};