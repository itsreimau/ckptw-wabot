const {
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const {
    MessageType
} = require("@mengkodingan/ckptw/lib/Constant");

module.exports = {
    name: "islamic",
    aliases: ["islamicai", "muslim", "muslimai"],
    category: "ai",
    handler: {},
    code: async (ctx) => {
        const status = await handler(ctx, module.exports.handler);
        if (status) return;

        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(tools.msg.generateCommandExample(ctx._used.prefix + ctx._used.command, "apa itu bot whatsapp?"))
        );

        try {
            const senderNumber = ctx.sender.jid.split(/[:@]/)[0];
            const uid = await db.get(`user.${senderNumber}.uid`);
            const apiUrl = tools.api.createUrl("fastrestapis", "/aillm/islamic", {
                ask: input,
                sessionId: uid
            });
            const {
                data
            } = await axios.get(apiUrl, {
                headers: {
                    "x-api-key": tools.api.listUrl().fastrestapis.APIKey
                }
            });

            return await ctx.reply(data.response);
        } catch (error) {
            console.error(`[${config.pkg.name}] Error:`, error);
            if (error.status !== 200) return await ctx.reply(config.msg.notFound);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};