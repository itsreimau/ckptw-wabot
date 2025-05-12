const {
    monospace,
    quote
} = require("@im-dims/baileys-library");
const {
    spawn
} = require("node:child_process");

module.exports = {
    name: "js",
    aliases: ["javascript"],
    category: "tool",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const script = ctx.args.join(" ") || null;

        if (!script) return await ctx.reply(
            `${quote(tools.cmd.generateInstruction(["send"], ["text"]))}\n` +
            quote(tools.cmd.generateCommandExample(ctx.used, 'console.log("halo, dunia!");'))
        );

        try {
            const restricted = ["require", "eval", "Function", "global"];
            for (const w of restricted) {
                if (script.includes(w)) {
                    return await ctx.reply(quote(`❎ Penggunaan ${w} tidak diperbolehkan dalam kode!`));
                }
            }

            const output = await new Promise((resolve) => {
                const childProcess = spawn("node", ["-e", script]);

                let outputData = "";
                let errorData = "";

                childProcess.stdout.on("data", (chunk) => {
                    if (outputData.length >= 1024 * 1024) {
                        resolve(quote("❎ Kode mencapai batas penggunaan memori!"));
                        childProcess.kill();
                    }
                    outputData += chunk.toString();
                });

                childProcess.stderr.on("data", (chunk) => {
                    errorData += chunk.toString();
                });

                childProcess.on("close", (code) => {
                    if (code !== 0) {
                        resolve(
                            `${quote(`⚠ Keluar dari proses dengan kode: ${code}`)}\n` +
                            errorData.trim()
                        );
                    } else {
                        resolve(outputData.trim());
                    }
                });

                setTimeout(() => {
                    resolve(quote("❎ Kode mencapai batas waktu output!"));
                    childProcess.kill();
                }, 10000);
            });

            await ctx.reply(monospace(output));
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, false);
        }
    }
};