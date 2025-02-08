const {
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const FormData = require("form-data");
const mime = require("mime-types");

module.exports = {
    name: "tovn",
    aliases: ["toptt"],
    category: "converter",
    permissions: {},
    code: async (ctx) => {
        if (!await tools.general.checkQuotedMedia(ctx.quoted, ["audio"])) return await ctx.reply(quote(tools.msg.generateInstruction(["reply"], ["audio"])));

        try {
            const result = await ctx.quoted?.media.toBuffer()

            if (!result) return await ctx.reply(config.msg.notFound);

            return await ctx.reply({
                audio: result,
                mimetype: mime.lookup("ptt"),
                ptt: true
            });
        } catch (error) {
            consolefy.error(`Error: ${error}`);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};