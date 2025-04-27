const {
    quote
} = require("@mengkodingan/ckptw");

const { default: axios } = require("axios");

module.exports = {
    name: "senna",
    category: "ai-chat",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(quote(
            `${quote(tools.cmd.generateInstruction(["send"], ["text"]))}\n` +
            quote(tools.cmd.generateCommandExample(ctx.used, "apa itu bot whatsapp?"))
        ));

        try {
            const prompt = `%2F* Prompt : Akting seperti Kamu adalah bot ${config.bot.name} yang dibuat oleh ${config.owner.name}, Balas dengan bahasa indonesia*%2F Pesan : `
            const apiUrl = "https://www.archive-ui.biz.id/api/ai/sennayapping?text=" + prompt.replace(" ", "+") + input.replace(" ", "+")
            ctx.reply(`${(await axios.get(apiUrl)).data.result}`)
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
}