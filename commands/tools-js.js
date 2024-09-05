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
        const [userLanguage] = await Promise.all([
            global.db.get(`user.${ctx.sender.jid.replace(/@.*|:.*/g, "")}.language`)
        ]);

        const {
            status,
            message
        } = await global.handler(ctx, {
            banned: true,
            coin: 3
        });
        if (status) return ctx.reply(message);

        const input = ctx.args.join(" ") || null;
        const script = input;

        if (!script) return ctx.reply(
            `${quote(`📌 ${await global.tools.msg.translate(await global.msg.argument, userLanguage)}`)}\n` +
            quote(`${await global.tools.msg.translate("Contoh", userLanguage)}: ${monospace(`${ctx._used.prefix + ctx._used.command} console.log("Hello World");`)}`)
        );

        try {
            const restricted = ["require", "eval", "Function", "global"];
            for (const w of restricted) {
                if (script.includes(w)) {
                    return ctx.reply(quote(`⚠ ${await global.tools.msg.translate(`Penggunaan ${w} tidak diperbolehkan dalam kode.`, userLanguage)})`));
                }
            }

            const output = await new Promise((resolve) => {
                const childProcess = spawn("node", ["-e", script]);

                let outputData = '';
                let errorData = '';

                childProcess.stdout.on('data', (chunk) => {
                    if (outputData.length >= 1024 * 1024) {
                        resolve(quote(`⚠ ${(await global.tools.msg.translate("Kode mencapai batas penggunaan memori.", userLanguage))}`));
                        childProcess.kill();
                    }
                    outputData += chunk.toString();
                });

                childProcess.stderr.on('data', (chunk) => {
                    errorData += chunk.toString();
                });

                childProcess.on("close", (code) => {
                    if (code !== 0) {
                        resolve(quote(
                            `⚠ ${await global.tools.msg.translate("Keluar dari proses dengan kode", userLanguage)}: ${code}\n` +
                            errorData.trim()
                        ));
                    } else {
                        resolve(outputData.trim());
                    }
                });

                setTimeout(() => {
                    resolve(quote(`⚠ ${await global.tools.msg.translate("Kode mencapai batas waktu keluaran.", userLanguage)}`));
                    childProcess.kill();
                }, 10000);
            });

            ctx.reply(output);
        } catch (error) {
            console.error("Error:", error);
            return ctx.reply(quote(`⚠ ${await global.tools.msg.translate("Terjadi kesalahan", userLanguage)}: ${error.message}`));
        }
    }
};