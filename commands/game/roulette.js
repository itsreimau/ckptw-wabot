const { monospace, quote } = require("@mengkodingan/ckptw");
const rouletteBets = new Map();  // chatId → [ { user, amount, color } ]
const DELAY = 10 * 1000; // 10 seconds
 
// helper: resolve & pay out roulette
async function resolveRoulette(chatId, ctx) {
  const bets = rouletteBets.get(chatId);
  if (!bets || bets.length === 0) return;
  
  // pick red or black
  const colors = ["merah", "hitam"];
  const resultColor = colors[Math.floor(Math.random() * colors.length)];
  
  const winners = [];
  // process each bet
  for (let bet of bets) {
    if (resultColor === bet.color) {
      // win: add coin
      await db.add(`user.${bet.user}.coin`, bet.amount);
      winners.push(`@${bet.user.split("@")[0]} menang ${bet.amount}`);
    } else {
      // lose: subtract coin
      await db.add(`user.${bet.user}.coin`, -bet.amount);
    }
  }
  
  // build message
  let text = `Bola jatuh pada ${resultColor}\n\n🎉 Pemenang 🎉\n\n`;
  text += winners.length ? winners.join("\n") : "Tidak ada pemenang";
  
  // send result with mentions
  await ctx.sendMessage(
    chatId,
    { text },
    { mentions: bets.map(b => b.user) }
  );
  
  // clear bets for chat
  rouletteBets.delete(chatId);
}

// helper: start roulette timeout once
function runRoulette(chatId, ctx) {
  setTimeout(() => resolveRoulette(chatId, ctx), DELAY);
}

module.exports = {
  name: "roulette",
  category: "game",
  aliases: ["roda"],
  code: async (ctx) => {
    try {
      const chatId = ctx.id;
      const userId = tools.general.getID(ctx.sender.jid);
      const [ amtArg, colorArg ] = ctx.args;
      const amount = parseInt(amtArg);
      const color = colorArg?.toLowerCase();
      
      // usage check
      if (!amtArg || !colorArg) {
        return ctx.reply(quote(
          `Cara penggunaan: ${monospace(ctx.used.prefix + ctx.used.command)} <jumlah> <merah/hitam>`
        ));
      }
      
      // validation
      if (isNaN(amount) || amount < 10) {
        return ctx.reply(quote("Minimal taruhan adalah 10 koin!"));
      }
      if (!["merah","hitam"].includes(color)) {
        return ctx.reply(quote("Warna harus merah atau hitam!"));
      }
      
      // load user coin
      const userDb = await db.get(`user.${userId}`) || {};
      const coin = userDb.coin || 0;
      if (tools.general.isOwner(userId) || userDb?.premium) return await ctx.reply(quote("❎ Anda sudah memiliki koin tak terbatas."));
      if (coin < amount) {
        return ctx.reply(quote("Anda tidak memiliki koin yang cukup!"));
      }
      if (amount > 1000) {
        return ctx.reply(quote("Maksimal taruhan adalah 1000 koin!"));
      }
      
      // place bet
      if (!rouletteBets.has(chatId)) {
        rouletteBets.set(chatId, []);
        runRoulette(chatId, ctx);
      }
      rouletteBets.get(chatId).push({ user: userId, amount, color });
      
      // confirm
      await ctx.reply(quote(
        `✅ Taruhan ditempatkan: ${monospace(amount + "koin")} pada ${monospace(color)}` +
        quote(`Dimulai dalam ${DELAY}s.`)
      ));
      
    } catch (err) {
        return await tools.cmd.handleError(ctx, err, false)
    }
  }
};

