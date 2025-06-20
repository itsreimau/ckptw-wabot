const {
    quote
} = require("@itsreimau/ckptw-mod");
const axios = require("axios");

module.exports = {
    name: "aidetector",
    aliases: ["aidetect"],
    category: "ai-misc",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || ctx.quoted?.conversation || Object.values(ctx.quoted).map(q => q?.text || q?.caption).find(Boolean) || null;

        if (!input) return await ctx.reply(
            `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(tools.msg.generateCmdExample(ctx.used, "rei ayanami memiliki latar belakang yang sangat misterius, dan tidak terlalu banyak terungkap. diketahui ia merupakan hasil rekayasa genetis dari dna yui dan angel kedua, lilith. dia dibesarkan di sebuah ruangan di basement nerv, yang memiliki penataan ruang yang mirip dengan di apartemen yang ditempatinya."))
        );

        try {
            const apiUrl = tools.api.createUrl("bk9", "/tools/txtdetect", {
                q: input
            });
            const result = (await axios.get(apiUrl)).data.BK9.data;

            return await ctx.reply(
                `${quote(`Terdeteksi AI: ${result.isHuman === 0 ? "Ya" : "Tidak"} (${result.isHuman}%)`)}\n` +
                `${quote(`Persentase AI: ${result.fakePercentage}%`)}\n` +
                `${quote(`Kata: ${result.textWords} total, ${result.aiWords} AI`)}\n` +
                `${quote(`Bahasa: ${result.detected_language}`)}\n` +
                "\n" +
                config.msg.footer
            );
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};