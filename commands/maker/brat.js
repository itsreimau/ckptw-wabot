const {
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const Jimp = require("jimp");
const {
    Sticker,
    StickerTypes
} = require("wa-sticker-formatter");

module.exports = {
    name: "brat",
    aliases: ["bratgen", "bratgenerator"],
    category: "maker",
    handler: {
        banned: true,
        cooldown: true,
        coin: [10, "text", 1]
    },
    code: async (ctx) => {
        const {
            status,
            message
        } = await handler(ctx, module.exports.handler);
        if (status) return await ctx.reply(message);

        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(tools.msg.generateCommandExample(ctx._used.prefix + ctx._used.command, "get in the fucking robot, shinji!"))
        );

        if (input.length > 10000) return await ctx.reply(quote(`❎ Maksimal 50 kata!`));

        try {
            const brat = await bratGenerator(input);

            const sticker = new Sticker(brat, {
                pack: config.sticker.packname,
                author: config.sticker.author,
                type: StickerTypes.FULL,
                categories: ["🤩", "🎉"],
                id: ctx.id,
                quality: 50
            });

            return await ctx.reply(await sticker.toMessage());
        } catch (error) {
            console.error(`[${config.pkg.name}] Error:`, error);
            return await ctx.reply(quote(`❎ Terjadi kesalahan: ${error.message}`));
        }
    }
};

async function bratGenerator(text) {
    const width = 500;
    const height = 500;
    const image = new Jimp(width, height, 0xFFFFFFFF);

    let fontSize = 64;
    let font;
    const maxLines = 10;

    while (true) {
        try {
            font = await Jimp.loadFont(Jimp[`FONT_SANS_${fontSize}_BLACK`]);
            const estimatedHeight = Math.ceil((text.length / 10) * (fontSize + 10));

            if (estimatedHeight <= height || fontSize <= 16) break;
            fontSize -= 8;
        } catch (error) {
            console.error(`[${config.pkg.name}] Font error:`, error);
            fontSize -= 8;
            if (fontSize < 16) throw new Error("Tidak bisa memuat font yang sesuai.");
        }
    }

    const lines = wrapText(text, width - 40, fontSize);
    let yOffset = (height - lines.length * fontSize) / 2;

    lines.forEach((line) => {
        image.print(font, 20, yOffset, line, width - 40);
        yOffset += fontSize + 10;
    });

    return await image.getBufferAsync(Jimp.MIME_PNG);
}

function wrapText(text, maxWidth, fontSize) {
    const words = text.split(" ");
    let lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
        const word = words[i];
        const width = (currentLine + " " + word).length * (fontSize / 2);

        if (width < maxWidth) {
            currentLine += " " + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    lines.push(currentLine);
    return lines;
}