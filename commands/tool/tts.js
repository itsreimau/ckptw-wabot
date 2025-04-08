const {
    monospace,
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const mime = require("mime-types");

module.exports = {
    name: "tts",
    aliases: ["texttospeechgoogle", "ttsgoogle"],
    category: "tool",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        let input = ctx.args.slice(ctx.args[0]?.length === 2 ? 1 : 0).join(" ") || (q => q?.conversation || q?.text || q?.caption)(Object.values(ctx.quoted || {}).find(v => typeof v === "object")) || null;
        let langCode = ctx.args[0]?.length === 2 ? ctx.args[0] : "id";

        if (!input) return await ctx.reply(
            `${quote(tools.cmd.generateInstruction(["send"], ["text"]))}\n` +
            `${quote(tools.cmd.generateCommandExample(ctx.used, "en halo, dunia!"))}\n` +
            quote(tools.cmd.generateNotes([`Ketik ${monospace(`${ctx.used.prefix + ctx.used.command} list`)} untuk melihat daftar.`]))
        );

        if (ctx.args[0] === "list") {
            const listText = await tools.list.get("tts");
            return await ctx.reply(listText);
        }

        try {
            const apiUrl = tools.api.createUrl("nyxs", "tools/tts", {
                text: input,
                to: langCode
            });
            const result = (await axios.get(apiUrl)).data.result;

            return await ctx.reply({
                audio: {
                    url: result
                },
                mimetype: mime.lookup("mp3"),
                ptt: true
            });
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};