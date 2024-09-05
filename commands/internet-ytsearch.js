const {

    bold,
    monospace,
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const mime = require("mime-types");

module.exports = {
    name: "ytsearch",
    aliases: ["yts"],
    category: "internet",
    code: async (ctx) => {
        const [userLanguage] = await Promise.all([
            global.db.get(`user.${ctx.sender.jid.replace(/@.*|:.*/g, "")}.language`)
        ]);

        const {
            status,
            message
        } = await global.handler(ctx, {
            banned: true,
            coin: 3
        });
        if (status) return ctx.reply(message);

        const input = ctx.args.join(" ") || null;

        if (!input) return ctx.reply(
            `${quote(`📌 ${await global.tools.msg.translate(await global.msg.argument, userLanguage)}`)}\n` +
            quote(`${await global.tools.msg.translate("Contoh", userLanguage)}: ${monospace(`${ctx._used.prefix + ctx._used.command} neon genesis evangelion`)}`)
        );

        try {
            const apiUrl = await global.tools.api.createUrl("agatz", "/api/ytsearch", {
                message: input
            });
            const response = await axios.get(apiUrl);
            const {
                data
            } = response.data;

            const resultText = data
                .map((d) => {
                    switch (d.type) {
                        case "video":
                            return `${bold(`${d.title} (${d.url})`)}\n` +
                                `${quote(`${await global.tools.msg.translate("Durasi", userLanguage)}: ${d.timestamp}`)}\n` +
                                `${quote(`${await global.tools.msg.translate("Diunggah", userLanguage)}: ${d.ago}`)}\n` +
                                `${quote(`${await global.tools.msg.translate("Dilihat", userLanguage)}: ${d.views}`)}`;
                        case "channel":
                            return `${bold(`${d.name} (${d.url})`)}\n` +
                                `${quote(`Subscriber: ${d.subCountLabel} (${d.subCount})`)}\n` +
                                `${quote(`${await global.tools.msg.translate("Jumlah video", userLanguage)}: ${d.videoCount}`)}`;
                    }
                })
                .filter((d) => d)
                .join("\n" + `${quote("─────")}\n`);

            return ctx.reply(`${resultText}\n\n` + global.msg.footer);
        } catch (error) {
            console.error("Error:", error);
            if (error.status !== 200) return ctx.reply(global.msg.notFound);
            return ctx.reply(quote(`⚠ ${await global.tools.msg.translate("Terjadi kesalahan", userLanguage)}: ${error.message}`));
        }
    }
};