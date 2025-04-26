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
        let input = ctx.args.slice(ctx.args[0]?.length === 2 ? 1 : 0).join(" ") || ctx.quoted.conversation || Object.values(ctx.quoted).map(v => v?.text || v?.caption).find(Boolean) || null;
        let langCode = ctx.args[0]?.length === 2 ? ctx.args[0] : "id";

        if (!input) return await ctx.reply(
            `${quote(tools.cmd.generateInstruction(["send"], ["text"]))}\n` +
            `${quote(tools.cmd.generateCommandExample(ctx.used, "en halo, dunia!"))}\n` +
            quote(tools.cmd.generateNotes([`Ketik ${monospace(`${ctx.used.prefix + ctx.used.command} list`)} untuk melihat daftar.`, "Untuk teks satu baris, ketik saja langsung ke perintah. Untuk teks dengan baris baru, balas pesan yang berisi teks tersebut ke perintah."]))
        );

        if (input === "list") {
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