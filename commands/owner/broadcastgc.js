const {
    quote
} = require("@itsreimau/ckptw-mod");
const axios = require("axios");
const mime = require("mime-types");

module.exports = {
    name: "broadcastgc",
    aliases: ["bc", "bcgc"],
    category: "owner",
    permissions: {
        owner: true
    },
    code: async (ctx) => {
        const input = ctx.args.join(" ") || ctx.quoted.conversation || Object.values(ctx.quoted).map(v => v?.text || v?.caption).find(Boolean) || null;;

        if (!input) return await ctx.reply(
            `${quote(tools.cmd.generateInstruction(["send"], ["text"]))}\n` +
            `${quote(tools.cmd.generateCommandExample(ctx.used, "halo, dunia!"))}\n` +
            `${quote(tools.cmd.generatesFlagInformation({
                "-ht": "Kirim dengan hidetag"
            }))}\n` +
            quote(tools.cmd.generateNotes(["Balas atau quote pesan untuk menjadikan teks sebagai input target, jika teks memerlukan baris baru."]))
        );

        try {
            const flag = tools.cmd.parseFlag(input, {
                "-ht": {
                    type: "boolean",
                    key: "hidetag"
                }
            });

            const hidetag = flag.hidetag || null;

            const delay = ms => new Promise(res => setTimeout(res, ms));
            const groupData = await ctx.core.groupFetchAllParticipating();
            const groupIds = Object.values(groupData).map(g => g.id);

            const waitMsg = await ctx.reply(quote(`🔄 Mengirim siaran ke ${groupIds.length} grup, perkiraan waktu: ${tools.general.convertMsToDuration(groupIds.length * 0.5 * 1000)}`));

            const failedGroupIds = [];

            for (const groupId of groupIds) {
                await delay(500);
                try {
                    let mentions = [];
                    if (hidetag) {
                        const members = await ctx.group(groupId).members();
                        mentions = members.map(m => m.id);
                    }

                    const fakeQuotedText = {
                        key: {
                            participant: "13135550002@s.whatsapp.net",
                            remoteJid: "status@broadcast"
                        },
                        message: {
                            extendedTextMessage: {
                                text: config.msg.note
                            }
                        }
                    };
                    const contextInfo = {
                        mentionedJid: mentions,
                        forwardingScore: 9999,
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: config.bot.newsletterJid,
                            newsletterName: config.bot.name
                        }
                    };

                    try {
                        const video = (await axios.get(tools.api.createUrl("http://vid2aud.hofeda4501.serv00.net", "/api/img2vid", {
                            url: config.bot.thumbnail
                        }))).data.result;
                        await ctx.sendMessage(groupId, {
                            video: {
                                url: video
                            },
                            mimetype: mime.lookup("mp4"),
                            caption: input,
                            gifPlayback: true,
                            contextInfo
                        }, {
                            quoted: fakeQuotedText
                        });
                    } catch (error) {
                        if (error.status !== 200) await ctx.sendMessage(groupId, {
                            text: input,
                            contextInfo
                        }, {
                            quoted: fakeQuotedText
                        });
                    }
                } catch (error) {
                    failedGroupIds.push(groupId);
                }
            }

            const successCount = groupIds.length - failedGroupIds.length;
            return await ctx.editMessage(waitMsg.key, quote(`✅ Berhasil mengirim ke ${successCount} grup. Gagal mengirim ke ${failedGroupIds.length} grup.`));
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, false);
        }
    }
};