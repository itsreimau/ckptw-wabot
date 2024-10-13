const {
    quote
} = require("@mengkodingan/ckptw");
const {
    spawn
} = require("child_process");

module.exports = {
    name: "js",
    aliases: ["javascript"],
    category: "tools",
    handler: {
        banned: true,
        cooldown: true,
        coin: [10, "text", 1]
    },
    code: async (ctx) => {
        const {
            status,
            message
        } = await global.handler(ctx, module.exports.handler);
        if (status) return ctx.reply(message);

        const script = ctx.args.join(" ") || null;

        if (!script) return ctx.reply(
            `${quote(global.tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(global.tools.msg.generateCommandExample(ctx._used.prefix + ctx._used.command, `console.log("halo dunia!");`))
        );

        try {
            const restricted = ["require", "eval", "Function", "global"];
            for (const w of restricted) {
                if (script.includes(w)) {
                    return ctx.reply(quote(`❎ Penggunaan ${w} tidak diperbolehkan dalam kode.`));
                }
            }

            const output = await new Promise((resolve) => {
                const childProcess = spawn("node", ["-e", script]);

                let outputData = "";
                let errorData = "";

                childProcess.stdout.on("data", (chunk) => {
                    if (outputData.length >= 1024 * 1024) {
                        resolve(quote(`❎ Kode mencapai batas penggunaan memori.`));
                        childProcess.kill();
                    }
                    outputData += chunk.toString();
                });

                childProcess.stderr.on("data", (chunk) => {
                    errorData += chunk.toString();
                });

                childProcess.on("close", (code) => {
                    if (code !== 0) {
                        resolve(quote(
                            `❎ Keluar dari proses dengan kode: ${code}\n` +
                            errorData.trim()
                        ));
                    } else {
                        resolve(outputData.trim());
                    }
                });

                setTimeout(() => {
                    resolve(quote(`❎ Kode mencapai batas waktu keluaran.`));
                    childProcess.kill();
                }, 10000);
            });

            ctx.reply(output);
        } catch (error) {
            console.error(`[${global.config.pkg.name}] Error:`, error);
            return ctx.reply(quote(`❎ Terjadi kesalahan: ${error.message}`));
        }
    }
};