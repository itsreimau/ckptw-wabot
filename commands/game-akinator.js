const {
    createAPIUrl
} = require("../tools/api.js");
const {
    getRandomElement
} = require("../tools/general.js");
const {
    SectionsBuilder,
    quote
} = require("@mengkodingan/ckptw");
const axios = require("axios");
const mime = require("mime-types");

const session = new Map();

module.exports = {
    name: "akinator",
    aliases: ["aki"],
    category: "game",
    code: async (ctx) => {
        const {
            status,
            message
        } = await global.handler(ctx, {
            banned: true,
            private: true
        });
        if (status) return ctx.reply(message);

        if (session.has(ctx.id)) return await ctx.reply(quote(`⚠ Sesi permainan sedang berjalan!`));

        try {
            const startApiUrl = createAPIUrl("chiwa", "/api/game/akinator", {
                start: "true",
                region: "id"
            });
            const startResponse = await axios.get(startApiUrl);
            const startData = startResponse.data;

            session.set(ctx.id, startData.sessionId);

            if (global.system.useInteractiveMessage) {
                const section = new SectionsBuilder()
                    .setDisplayText("Select Answer 🔮")
                    .addSection({
                        title: "Answer:",
                        rows: startData.answers.map((ans, index) => ({
                            title: ans,
                            id: index + 1
                        }))
                    }).build();
                await ctx.replyInteractiveMessage({
                    body: `${quote(`Pertanyaan: ${startData.question}`)}\n` +
                        "\n" +
                        global.msg.footer,
                    footer: global.msg.watermark,
                    nativeFlowMessage: {
                        buttons: [section]
                    }
                });
            } else {
                await ctx.reply(
                    `${quote(`Pertanyaan: ${startData.question}`)}\n` +
                    `${quote(`Ketik angka pilihanmu untuk menjawab.`)}\n` +
                    `${quote(`Pilih jawaban:`)}\n` +
                    startData.answers.map((ans, index) => quote(`${index + 1}. ${ans}`)).join("\n") +
                    "\n" +
                    global.msg.footer
                );
            }

            const collector = ctx.MessageCollector({
                time: 86400000
            }); // 1 day

            collector.on("collect", async (m) => {
                const userAnswer = m.content.trim();

                if (userAnswer === "00") {
                    const deleteSessionApiUrl = createAPIUrl("chiwa", "/api/game/akinator/deletesession", {
                        session: startData.sessionId
                    });
                    await axios.get(deleteSessionApiUrl);
                    session.delete(ctx.id);
                    collector.stop();
                    return ctx.reply(quote(`⚠ Sesi Akinator telah dihapus.`));
                }

                if (!["1", "2", "3", "4", "5", "0"].includes(userAnswer)) {
                    return ctx.reply(quote(`⚠ Jawaban tidak valid! Harap ketik angka antara 1 hingga 5.`));
                }

                try {
                    const answerApiUrl = createAPIUrl("chiwa", "/api/game/akinator", {
                        session: startData.sessionId,
                        region: "id",
                        answer: userAnswer
                    });
                    const answerResponse = await axios.get(answerApiUrl);
                    const answerData = answerResponse.data;

                    if (answerData.guess && answerData.guess.completion === "OK") {
                        await ctx.reply({
                            image: {
                                url: answerData.guess.photo
                            },
                            caption: quote(`Apakah yang kamu pikirkan adalah: ${answerData.guess.name_proposition} (${answerData.guess.description_proposition})?`),
                            mimetype: mime.lookup("png"),
                        });

                        if (global.system.useInteractiveMessage) {
                            const section = new SectionsBuilder()
                                .setDisplayText("Select Options 🔮")
                                .addSection({
                                    title: "Option:",
                                    rows: [{
                                            title: "Correct",
                                            id: "1"
                                        },
                                        {
                                            title: "Wrong",
                                            id: "0"
                                        }
                                    ]
                                }).build();
                            await ctx.replyInteractiveMessage({
                                body: quote("⚠ Apa tebakanku salah?"),
                                footer: global.msg.watermark,
                                nativeFlowMessage: {
                                    buttons: [section]
                                }
                            });
                        } else {
                            await ctx.reply(quote("⚠ Apa tebakanku salah? Jika salah ketik 0 untuk melanjutkan. Ketik apa saja jika benar."));
                        }

                        if (userAnswer === "0") {
                            await ctx.reply(quote(`⚠ Tebakan salah! Lanjutkan permainan.`));
                        } else {
                            session.delete(ctx.id);
                            collector.stop();
                        }
                    } else {
                        if (global.system.useInteractiveMessage) {
                            const section = new SectionsBuilder()
                                .setDisplayText("Select Answer 🔮")
                                .addSection({
                                    title: "Answer:",
                                    rows: startData.answers.map((ans, index) => ({
                                        title: ans,
                                        id: index + 1
                                    }))
                                }).build();
                            await ctx.replyInteractiveMessage({
                                body: `${quote(`Pertanyaan: ${answerData.question}`)}\n` +
                                    "\n" +
                                    global.msg.footer,
                                footer: global.msg.watermark,
                                nativeFlowMessage: {
                                    buttons: [section]
                                }
                            });
                        } else {
                            await ctx.reply(
                                `${quote(`Pertanyaan: ${answerData.question}`)}\n` +
                                `${quote(`Ketik angka pilihanmu untuk menjawab.`)}\n` +
                                `${quote(`Pilih jawaban:`)}\n` +
                                answerData.answers.map((ans, index) => quote(`${index + 1}. ${ans}`)).join("\n") +
                                "\n" +
                                global.msg.footer
                            );
                        }
                    }
                } catch (error) {
                    console.error("Error:", error);
                    return ctx.reply(`⚠ Terjadi kesalahan saat memproses jawaban: ${error.message}`);
                }
            });

            collector.on("end", async (collected, reason) => {
                if (session.has(ctx.id)) {
                    await ctx.reply(quote(`⚠ Waktu habis! Sesi Akinator telah berakhir.`));
                    const deleteSessionApiUrl = createAPIUrl("chiwa", "/api/game/akinator/deletesession", {
                        session: startData.sessionId
                    });
                    await axios.get(deleteSessionApiUrl);
                    session.delete(ctx.id);
                }
            });

        } catch (error) {
            console.error("Error:", error);
            if (error.response && error.response.status !== 200) return ctx.reply(global.msg.notFound);
            return ctx.reply(quote(`⚠ Terjadi kesalahan: ${error.message}`));
        }
    }
};