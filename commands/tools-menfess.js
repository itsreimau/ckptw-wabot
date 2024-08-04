 const {
     bold,
     monospace
 } = require("@mengkodingan/ckptw");

 module.exports = {
     name: "menfess",
     aliases: ["confess"],
     category: "tools",
     code: async (ctx) => {
         const {
             status,
             message
         } = await global.handler(ctx, {
             banned: true,
             coin: 3,
             private: true
         });
         if (status) return ctx.reply(message);

         if (!ctx._args.length) return ctx.reply(
             `${global.msg.argument}\n` +
             `Contoh: ${monospace(`${ctx._used.prefix + ctx._used.command} ${ctx._client.user.id.split(":")[0]} Halo dunia!`)}`
         );

         try {
             const senderJid = ctx._sender.jid;
             const senderNumber = senderJid.split("@")[0];
             const [number, ...text] = ctx._args;
             const numberFormatted = number.replace(/[^\d]/g, "");

             if (numberFormatted === senderNumber) return ctx.reply(`${bold("[ ! ]")} Tidak dapat digunakan pada diri Anda sendiri.`);

             const menfessText = `❖ ${bold("Menfess")}\n` +
                 `Hai, saya ${global.bot.name}, seseorang mengirimi Anda pesan melalui menfess ini!\n` +
                 "\n" +
                 `${text.join(" ")}\n` +
                 "\n" +
                 global.msg.footer;
             await ctx.sendMessage(`${numberFormatted}@s.whatsapp.net`, {
                 text: menfessText
             });
             global.db.set(`menfess.${numberFormatted}`, {
                 from: senderNumber,
                 text: menfessText
             });

             return ctx.reply(`${bold("[ ! ]")} Pesan berhasil terkirim!`);
         } catch (error) {
             console.error("Error:", error);
             return ctx.reply(`${bold("[ ! ]")} Terjadi kesalahan: ${error.message}`);
         }
     }
 };