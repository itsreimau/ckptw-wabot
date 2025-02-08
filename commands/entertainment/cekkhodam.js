const {
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");

module.exports = {
    name: "cekkhodam",
    aliases: ["checkkhodam", "khodam"],
    category: "entertainment",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(tools.msg.generateCommandExample(ctx.used, "john doe"))
        );

        try {
            const apiUrl = tools.api.createUrl("https://raw.githubusercontent.com", "/SazumiVicky/cek-khodam/main/khodam/list.txt", {});
            const {
                data
            } = await axios.get(apiUrl);
            const khodam = tools.general.getRandomElement(data.trim().split("\n").filter(Boolean));

            return await ctx.reply(
                `${quote(`Nama: ${input}`)}\n` +
                `${quote(`Khodam: ${khodam}`)}\n` +
                "\n" +
                config.msg.footer
            );
        } catch (error) {
            consolefy.error(`Error: ${error}`);
            if (error.status !== 200) return await ctx.reply(config.msg.notFound);
            return message.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};