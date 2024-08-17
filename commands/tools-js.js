const {
    monospace,
    quote
} = require("@mengkodingan/ckptw");
const {
    spawn
} = require("child_process");

module.exports = {
    name: "js",
    aliases: ["javascript"],
    category: "tools",
    code: async (ctx) => {
        const {
            status,
            message
        } = await global.handler(ctx, {
            banned: true,
            coin: 3
        });
        if (status) return ctx.reply(message);

        const input = ctx._args.join(" ") || null;
        const script = input;

        if (!script) return ctx.reply(
            `${quote(global.msg.argument)}\n` +
            quote(`Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} console.log("Hello World");`)}`)
        );

        try {
            const restricted = ["require", "eval", "Function", "global"];
            for (const w of restricted) {
                if (script.includes(w)) {
                    return ctx.reply(quote(`⚠ Penggunaan ${w} tidak diperbolehkan dalam kode.`));
                }
            }

            const output = await new Promise((resolve) => {
                const childProcess = spawn("node", ["-e", script]);

                let outputData = '';
                let errorData = '';

                childProcess.stdout.on('data', (chunk) => {
                    if (outputData.length >= 1024 * 1024) {
                        resolve(quote(`⚠ Kode mencapai batas penggunaan memori.`));
                        childProcess.kill();
                    }

                    outputData += chunk.toString();;
                });

                childProcess.stderr.on('data', (chunk) => {
                    errorData += chunk.toString();;
                });

                childProcess.on("close", (code) => {
                    if (code !== 0) {
                        return resolve(quote(`⚠ Keluar dari proses dengan kode: ${code}`));
                    } else {
                        resolve(result);
                    }
                });

                setTimeout(() => {
                    resolve(quote(`⚠ Kode mencapai batas waktu keluaran.`));
                    childProcess.kill();
                }, 10000);
            });

            ctx.reply(output.trim());
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(quote(`⚠ Terjadi kesalahan: ${error.message}`));
        }
    }
};