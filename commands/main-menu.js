const {
    getList
} = require("../tools/list.js");
const {
    getRandomElement
} = require("../tools/general.js");
const {
    bold,
    ButtonBuilder,
    quote
} = require("@mengkodingan/ckptw");

module.exports = {
    name: "menu",
    aliases: ["help", "?"],
    category: "main",
    code: async (ctx) => {
        try {
            const text = await getList("menu", ctx);
            const ownerButton = new ButtonBuilder()
                .setId(`${ctx._used.prefix}owner`)
                .setDisplayText("👨‍💻 Owner")
                .setType("quick_reply")
                .build();
            let groupChatButton = new ButtonBuilder()
                .setId("group_chat")
                .setDisplayText("🌐 Group Chat")
                .setType("cta_url")
                .setURL(global.bot.groupChat)
                .setMerchantURL(global.bot.groupChat)
                .build();

            ctx.replyInteractiveMessage({
                body: text,
                footer: global.msg.footer,
                nativeFlowMessage: {
                    buttons: [ownerButton, groupChatButton]
                }
            })
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(quote(`${bold("[ ! ]")} Terjadi kesalahan: ${error.message}`));
        }
    }
};