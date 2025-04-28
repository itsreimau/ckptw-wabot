// roulette.js
const { monospace, quote } = require("@mengkodingan/ckptw");

module.exports = {
  name: "roulette",
  category: "game",
  aliases: ["roll", "rj"]
  code: async (ctx) => {
    try {
      const userJid = ctx.sender.jid;
      const userId = tools.general.getID(userJid);
      const [ amtArg, colorArg ] = ctx.args;
      const amount = parseInt(amtArg, 10);
      const color = colorArg?.toLowerCase();

      // usage check
      if (!amtArg || !colorArg) {
        return ctx.reply(
          quote(
            `Cara penggunaan: ${monospace(ctx.used.prefix + ctx.used.command)} <jumlah> <merah/hitam>`
          )
        );
      }

      // validation
      if (isNaN(amount) || amount < 10) {
        return ctx.reply(quote("Minimal taruhan adalah 10 koin!"));
      }
      if (!["merah","hitam"].includes(color)) {
        return ctx.reply(quote("Warna harus merah atau hitam!"));
      }

      // load user data
      const userDb = (await db.get(`user.${userId}`)) || {};
      const coin = userDb.coin || 0;

      // unlimited for owner/premium
      if (tools.general.isOwner(userId) || userDb.premium) {
        return ctx.reply(quote("❎ Anda memiliki koin tak terbatas! Tidak perlu taruhan."));
      }

      if (coin < amount) {
        return ctx.reply(quote("Anda tidak memiliki koin yang cukup!"));
      }
      if (amount > 1000) {
        return ctx.reply(quote("Maksimal taruhan adalah 1000 koin!"));
      }

      // spin roulette immediately
      const options = ["merah 🔴", "hitam ⚫"];
      const result = options[Math.floor(Math.random() * options.length)];
      const resultKey = result.startsWith("merah") ? "merah" : "hitam";

      let text = `Bola jatuh pada ${result}\n\n`;

      if (color === resultKey) {
        // win
        await db.add(`user.${userId}.coin`, amount);
        text += `🎉 Selamat! Kamu menang ${amount} koin!`;
      } else {
        // lose
        await db.add(`user.${userId}.coin`, -amount);
        text += `💔 Wah, kamu kalah ${amount} koin.`;
      }

      // show new balance
      const newBalance = (await db.get(`user.${userId}.coin`)) || 0;
      text += `\nKoin kamu sekarang: ${newBalance} koin.`;

      return ctx.reply(quote(text));

    } catch (err) {
      console.error(err);
      return await tools.cmd.handleError(ctx, err, false);
    }
  }
};
