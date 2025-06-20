const {
    monospace,
    quote
} = require("@itsreimau/ckptw-mod");
const {
    spawn
} = require("node:child_process");

module.exports = {
    name: "js",
    aliases: ["node", "javascript"],
    category: "tool",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || ctx.quoted?.conversation || Object.values(ctx.quoted).map(q => q?.text || q?.caption).find(Boolean) || null;

        if (!input) return await ctx.reply(
            `${quote(tools.msg.generateInstruction(["send"], ["text"]))}\n` +
            quote(tools.msg.generateCmdExample(ctx.used, 'console.log("halo, dunia!");'))
        );

        try {
            const restricted = ["require", "eval", "Function", "global"];
            for (const w of restricted) {
                if (input.includes(w)) return await ctx.reply(quote(`❎ Penggunaan ${w} tidak diperbolehkan dalam kode!`));
            }

            const output = await new Promise(resolve => {
                const childProcess = spawn("node", ["-e", input]);

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
            return await tools.cmd.handleError(ctx, error);
        }
    }
};