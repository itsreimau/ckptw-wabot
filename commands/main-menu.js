const package = require("../package.json");
const {
    InteractiveMessageBuilder
} = require("../tools/builder.js");
const {
    getMenu
} = require("../tools/menu.js");
const {
    getRandomElement
} = require("../tools/simple.js");
const {
    bold
} = require("@mengkodingan/ckptw");
const fg = require("api-dylux");

module.exports = {
    name: "menu",
    aliases: ["help", "?"],
    category: "main",
    code: async (ctx) => {
        try {
            const text = await getMenu(ctx);
            const thumbnail = await fg.googleImage("rei ayanami wallpaper");

            if (global.system.useInteractiveMessage) {
                const InteractiveMessage = new InteractiveMessageBuilder(ctx)
                    .addBody(text)
                    .addFooter(global.msg.watermark)
                    .addHeader({
                        title: global.bot.name,
                        subtitle: "Jangan lupa berdonasi agar bot tetap online!",
                        hasMediaAttachment: false
                    })
                    .addQuickReply("Ping", "/ping")
                    .addUrl("Group Chat", global.bot.groupChat, global.bot.groupChat)
                    .addCall("Owner", `+${global.owner.number}`)
                    .build();

                return await ctx._client.relayMessage(ctx.id, InteractiveMessage.message, {
                    messageId: ctx._msg.key.id
                });
            }

            return ctx.sendMessage(
                ctx.id, {
                    text: text,
                    contextInfo: {
                        externalAdReply: {
                            title: global.msg.watermark,
                            body: null,
                            thumbnailUrl: getRandomElement(thumbnail) || global.bot.thumbnail,
                            sourceUrl: global.bot.groupChat,
                            mediaType: 1,
                            renderLargerThumbnail: true,
                        },
                    },
                }, {
                    quoted: ctx._msg,
                }
            );
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(`${bold("[ ! ]")} Terjadi kesalahan: ${error.message}`);
        }
    }
};