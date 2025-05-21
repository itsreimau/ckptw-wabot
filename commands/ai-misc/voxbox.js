const {
    quote
} = require("@itsreimau/ckptw-mod");
const axios = require("axios");
const mime = require("mime-types");

module.exports = {
    name: "voxbox",
    aliases: ["voiceover"],
    category: "ai-misc",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(tools.cmd.generateInstruction(["send"], ["text"]))}\n` +
            `${quote(tools.cmd.generateCommandExample(ctx.used, "halo, dunia! -m nahida"))}\n` +
            quote(tools.cmd.generatesFlagInformation({
                "-m <text>": "Atur filter hitam (tersedia: miku, nahida, nami, ana, optimus_prime, goku, taylor_swift, elon_musk, mickey_mouse, kendrick_lamar, angela_adkinsh, eminem | default: miku)"
            }))
        );

        try {
            const flag = tools.cmd.parseFlag(input, {
                "-m": {
                    type: "value",
                    key: "model",
                    validator: (val) => /^(miku|nahida|nami|ana|optimus_prime|goku|taylor_swift|elon_musk|mickey_mouse|kendrick_lamar|angela_adkinsh|eminem)$/.test(val),
                    parser: (val) => val
                }
            });

            const model = flag.filter || "miku";

            const apiUrl = tools.api.createUrl("agatz", "/api/voiceover", {
                text: flag.input
                model
            });
            const result = (await axios.get(apiUrl)).data.data.oss_url;

            return await ctx.reply({
                audio: {
                    url: result
                },
                mimetype: mime.lookup("wav"),
                ptt: true
            });
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};