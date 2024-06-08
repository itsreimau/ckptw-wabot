const {
    pinterest
} = require("../tools/scraper.js");
const {
    bold,
    monospace
} = require("@mengkodingan/ckptw");
const {
    proto,
    generateWAMessageFromContent
} = require("@whiskeysockets/baileys");
const mime = require("mime-types");

module.exports = {
    name: "pinterest",
    aliases: ["pin", "pint"],
    category: "internet",
    code: async (ctx) => {
        const handlerObj = await global.handler(ctx, {
            banned: true,
            coin: 3
        });

        if (handlerObj.status) return ctx.reply(handlerObj.message);

        const input = ctx._args.join(" ");

        if (!input) return ctx.reply(
            `${global.msg.argument}\n` +
            `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} rei ayanami`)}`
        );

        try {
            const result = await pinterest(input);

            if (!result) throw new Error(global.msg.notFound);

            const response = await axios.get(result, {
                responseType: "arraybuffer"
            });
            const buffer = Buffer.from(response.data, "binary");

            if (global.system.useInteractiveMessage) {
                const InteractiveMessage = generateWAMessageFromContent(ctx.id, {
                    viewOnceMessage: {
                        message: {
                            messageContextInfo: {
                                deviceListMetadata: {},
                                deviceListMetadataVersion: 2
                            },
                            interactiveMessage: proto.Message.InteractiveMessage.create({
                                body: proto.Message.InteractiveMessage.Body.create({
                                    text: `❖ ${bold("Pinterest")}\n` +
                                        "\n" +
                                        `➲ Kueri: ${input}\n` +
                                        "\n" +
                                        global.msg.footer
                                }),
                                header: proto.Message.InteractiveMessage.Header.create({
                                    title: global.bot.name,
                                    hasMediaAttachment: true,
                                    imageMessage: await createImageMessage(ctx, buffer)
                                }),
                                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                                    buttons: [{
                                        name: "quick_reply",
                                        buttonParamsJson: JSON.stringify({
                                            display_text: "🔄 Again",
                                            id: `${ctx._used.prefix + ctx._used.command} ${input}`
                                        })
                                    }]
                                })
                            })
                        }
                    }
                }, {});

                return await ctx._client.relayMessage(ctx.id, InteractiveMessage.message, {
                    messageId: ctx._msg.key.id
                });
            }

            return await ctx.reply({
                image: buffer,
                mimetype: mime.contentType("png"),
                caption: `❖ ${bold("Pinterest")}\n` +
                    "\n" +
                    `➲ Kueri: ${input}\n` +
                    "\n" +
                    global.msg.footer
            });
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(`${bold("[ ! ]")} Terjadi kesalahan: ${error.message}`);
        }
    }
};

async function createImageMessage(ctx, image) {
    const {
        imageMessage
    } = await generateWAMessageContent({
        image: {
            image
        }
    }, {
        upload: ctx._client.waUploadToServer
    });

    return imageMessage;
};