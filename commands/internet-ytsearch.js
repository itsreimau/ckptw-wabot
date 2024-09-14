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
        const {
            status,
            message
        } = await global.handler(ctx, {
            banned: true,
            energy: 10,
            cooldown: true
        });
        if (status) return ctx.reply(message);

        const input = ctx.args.join(" ") || null;

        if (!input) return ctx.reply(
            `${quote(global.tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(global.tools.msg.generateCommandExample(ctx._used.prefix + ctx._used.command, "neon genesis evangelion"))
        );

        try {
            const apiUrl = global.tools.api.createUrl("agatz", "/api/ytsearch", {
                message: input
            });
            const response = await axios.get(apiUrl);
            const {
                data
            } = response.data;

            const resultText = data.map((d) => {
                switch (d.type) {
                    case "video":
                        return `${bold(`${d.title} (${d.url})`)}\n` +
                            `${quote(`Durasi: ${d.timestamp}`)}\n` +
                            `${quote(`Diunggah: ${d.ago}`)}\n` +
                            `${quote(`Dilihat: ${d.views}`)}`;
                    case "channel":
                        return `${bold(`${d.name} (${d.url})`)}\n` +
                            `${quote(`Subscriber: ${d.subCountLabel} (${d.subCount})`)}\n` +
                            `${quote(`Jumlah video: ${d.videoCount}`)}`;
                }
            }).filter((d) => d).join(
                "\n" +
                `${quote("─────")}\n`
            );
            return ctx.reply(
                `${resultText}\n` +
                "\n" +
                global.msg.footer
            );
        } catch (error) {
            console.error("[ckptw-wabot] Kesalahan:", error);
            if (error.status !== 200) return ctx.reply(global.msg.notFound);
            return ctx.reply(quote(`⚠ Terjadi kesalahan: ${error.message}`));
        }
    }
};