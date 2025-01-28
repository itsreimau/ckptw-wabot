const {
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const mime = require("mime-types");

module.exports = {
    name: "cutout",
    category: "ai-image",
    handler: {
        coin: 10
    },
    code: async (ctx) => {
        if (await handler(ctx, module.exports.handler)) return;

        const modelApiUrl = tools.api.createUrl("agatz", "/ai/cutout", {
            prompt: null,
            type: null
        });
        const modelData = (axios.get(modelApiUrl)).data;
        const modelAvailable = modelData.error ? [] : modelData.error.match(/daftar: (.*)/)[1].split(", ");

        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            `${quote(tools.msg.generateCommandExample(ctx._used, "moon"))}\n` +
            `${quote(tools.msg.generatesFlagInformation({
                "-m <nomor>": `Atur model dengan nomor (tersedia: ${modelAvailable.map((model, idx) => `${idx + 1}-${model.length}`).join(", ")} | default: acak).`
            }))}\n` +
            quote(tools.msg.generateNotes([`Ketik ${monospace(`${ctx._used.prefix + ctx._used.command} list`)} untuk melihat daftar.`]))
        );

        if (ctx.args[0] === "list") {
            const listText = await tools.list.get("cutout");
            return await ctx.reply(listText);
        }

        try {
            const flag = tools.general.parseFlag(input, {
                "-m": {
                    type: "value",
                    key: "model",
                    validator: (val) => {
                        const modelNumber = parseInt(val, 10);
                        return modelAvailable.includes(val);
                    },
                    parser: (val) => val
                }
            });

            const apiUrl = tools.api.createUrl("agatz", "/ai/cutout", {
                prompt: input,
                type: flag.model
            });
            const {
                data
            } = (await axios.get(apiUrl)).data;
            const result = tools.general.getRandomElement(JSON.parse(data));

            return await ctx.reply({
                image: {
                    url: result.url1 || result.url2 || result.url3
                },
                mimetype: mime.lookup("png"),
                caption: `${quote(`Prompt: ${input}`)}\n` +
                    "\n" +
                    config.msg.footer
            });
        } catch (error) {
            consolefy.error(`Error: ${error}`);
            if (error.status !== 200) return await ctx.reply(config.msg.notFound);
            return await ctx.reply(quote(`⚠️ Terjadi kesalahan: ${error.message}`));
        }
    }
};