const {
    bold,
    monospace
} = require("@mengkodingan/ckptw");
const {
    spawn
} = require("child_process");

module.exports = {
    name: "js",
    aliases: ["javascript"],
    category: "tools",
    code: async (ctx) => {
        const handlerObj = await global.handler(ctx, {
            banned: true,
            coin: 3
        });

        if (handlerObj.status) return ctx.reply(handlerObj.message);

        const input = ctx._args.join(" ") || null;
        const script = input;

        if (!script) return ctx.reply(
            `${global.msg.argument}\n` +
            `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} console.log("Hello World");`)}`
        );

        try {
            const restricted = ["require", "eval", "Function", "global"];
            for (const w of restricted) {
                if (script.includes(w)) {
                    return ctx.reply(`${bold("[ ! ]")} Penggunaan ${w} tidak diperbolehkan dalam kode.`);
                }
            }

            const output = await new Promise((resolve) => {
                const childProcess = spawn("node", ["-e", script]);

                let outputData = '';
                let errorData = '';

                childProcess.stdout.on('data', (chunk) => {
                    if (outputData.length >= 1024 * 1024) {
                        resolve(`${bold("[ ! ]")} Kode mencapai batas penggunaan memori.`);
                        childProcess.kill();
                    }

                    outputData += chunk.toString();;
                });

                childProcess.stderr.on('data', (chunk) => {
                    errorData += chunk.toString();;
                });

                childProcess.on("close", (code) => {
                    if (code !== 0) {
                        return resolve(`${bold("[ ! ]")} Keluar dari proses dengan kode: ${code}`);
                    } else {
                        resolve(result);
                    }
                });

                setTimeout(() => {
                    resolve(`${bold("[ ! ]")} Kode mencapai batas waktu keluaran.`);
                    childProcess.kill();
                }, 10000);
            });

            ctx.reply(output.trim());
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(`${bold("[ ! ]")} Terjadi kesalahan: ${error.message}`);
        }
    }
};