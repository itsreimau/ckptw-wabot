const {
    bold,
    monospace
} = require("@mengkodingan/ckptw");
const yts = require("yt-search");

module.exports = {
    name: "ytsearch",
    aliases: ["yts"],
    category: "internet",
    code: async (ctx) => {
        const handlerObj = await global.handler(ctx, {
            banned: true,
            coin: 3
        });

        if (handlerObj.status) return ctx.reply(handlerObj.message);

        const input = ctx._args.join(" ") || null;

        if (!input) return ctx.reply(
            `${global.msg.argument}\n` +
            `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} neon genesis evangelion`)}`
        );

        try {
            const result = await yts(input);

            if (!result) return ctx.reply(global.msg.notFound);

            const resultText = result.all.map((r) => {
                switch (r.type) {
                    case "video":
                        return `${bold(`${r.title} (${r.url})`)}\n` +
                            `➲ Durasi: ${r.timestamp}\n` +
                            `➲ Diunggah: ${r.ago}\n` +
                            `➲ Dilihat: ${r.views}`;
                    case "channel":
                        return `${bold(`${r.name} (${r.url})`)}\n` +
                            `➲ Subscriber: ${r.subCountLabel} (${r.subCount})\n` +
                            `➲ Jumlah video: ${r.videoCount}`;
                }
            }).filter((r) => r).join("\n-----\n");
            return ctx.reply(
                `${bold("❖ YT Search")}\n` +
                "\n" +
                `${resultText}\n` +
                "\n" +
                global.msg.footer
            );
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(`${bold("[ ! ]")} Terjadi kesalahan: ${error.message}`);
        }
    }
};