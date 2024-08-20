const {
    createAPIUrl
} = require("../tools/api.js");
const {
    bold,
    monospace,
    SectionsBuilder,
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");

module.exports = {
    name: "aisearch",
    aliases: ["ai", "aisearch", "chatai", "chataisearch"],
    category: "ai",
    code: async (ctx) => {
        const {
            status,
            message
        } = await global.handler(ctx, {
            banned: true,
            coin: 3
        });
        if (status) return ctx.reply(message);

        const input = ctx._args.join(" ") || null;

        if (!input) return ctx.reply(
            `${quote(global.msg.argument)}\n` +
            quote(`Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} apa itu whatsapp?`)}`)
        );

        try {
            const apiUrl = createAPIUrl("sanzy", "/api/ai-search", {
                text: input
            });
            const response = await axios.get(apiUrl);
            const data = response.data.data[0];

            if (global.system.useInteractiveMessage) {
                const relatedQuestions = data.find(d => d.type === "related_questions")?.questions || [];
                const section = new SectionsBuilder()
                    .setDisplayText("Select Related Questions ❓")
                    .addSection({
                        title: "Related Questions",
                        rows: relatedQuestions.map(q => ({
                            title: q.question,
                            id: `${ctx._used.prefix}${ctx._used.command} ${q.question}`
                        }))
                    })
                    .build();

                return ctx.replyInteractiveMessage({
                    body: data.text,
                    footer: global.msg.watermark,
                    nativeFlowMessage: {
                        buttons: [section]
                    }
                });
            }

            return ctx.reply(data.text);
        } catch (error) {
            console.error("Error:", error);
            if (error.status !== 200) return ctx.reply(global.msg.notFound);
            return ctx.reply(quote(`⚠ Terjadi kesalahan: ${error.message}`));
        }
    }
};