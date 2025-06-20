const {
    monospace,
    quote
} = require("@itsreimau/ckptw-mod");
const mime = require("mime-types");

module.exports = {
    name: "tts",
    aliases: ["texttospeechgoogle", "ttsgoogle"],
    category: "tool",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const input = ctx.args.slice(ctx.args[0]?.length === 2 ? 1 : 0).join(" ") || ctx.quoted?.conversation || Object.values(ctx.quoted).map(q => q?.text || q?.caption).find(Boolean) || null;
        const langCode = ctx.args[0]?.length === 2 ? ctx.args[0] : "id";

        if (!input) return await ctx.reply(
            `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            `${quote(tools.msg.generateCmdExample(ctx.used, "en halo, dunia!"))}\n` +
            quote(tools.msg.generateNotes([`Ketik ${monospace(`${ctx.used.prefix + ctx.used.command} list`)} untuk melihat daftar.`, "Balas atau quote pesan untuk menjadikan teks sebagai input target, jika teks memerlukan baris baru."]))
        );

        if (["l", "list"].includes(input.toLowerCase())) {
            const listText = await tools.list.get("langcode");
            return await ctx.reply(listText);
        }

        try {
            const result = tools.api.createUrl("bk9", "/tools/tts", {
                q: input,
                lang: langCode
            });

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