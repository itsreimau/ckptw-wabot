const {
    getMenu
} = require("../tools/menu.js");
const {
    getRandomElement
} = require("../tools/simple.js");
const {
    bold
} = require("@mengkodingan/ckptw");
const axios = require('axios');
const mime = require("mime-types");

module.exports = {
    name: "menu",
    aliases: ["help", "?"],
    category: "main",
    code: async (ctx) => {
        try {
            const text = await getMenu(ctx);
            const response = await axios.get(global.bot.thumbnail.square, {
                responseType: "arraybuffer"
            });
            const fakeStatus = {
                key: {
                    fromMe: false,
                    participant: ctx._sender.jid, // Change it to "0@s.whatsapp.net" if you want to become an official WhatsApp account.
                    ...({
                        remoteJid: "status@broadcast"
                    })
                },
                message: {
                    imageMessage: {
                        mimetype: mime.contentType("jpeg"),
                        caption: `Owned by ${global.owner.name}`,
                        jpegThumbnail: response.data
                    }
                }
            };

            return ctx.sendMessage(
                ctx.id, {
                    text: text,
                    contextInfo: {
                        mentionedJid: [ctx._sender.jid],
                        externalAdReply: {
                            mediaType: 1,
                            previewType: 0,
                            mediaUrl: global.bot.groupChat,
                            title: global.msg.watermark,
                            body: null,
                            renderLargerThumbnail: true,
                            thumbnailUrl: global.bot.thumbnail.landscape,
                            sourceUrl: global.bot.groupChat
                        },
                        forwardingScore: 9999,
                        isForwarded: true
                    },
                    mentions: [ctx._sender.jid]
                }, {
                    quoted: fakeStatus,
                }
            );
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(`${bold("[ ! ]")} Terjadi kesalahan: ${error.message}`);
        }
    }
};