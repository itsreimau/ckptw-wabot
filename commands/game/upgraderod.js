const { monospace, quote } = require("@mengkodingan/ckptw");

module.exports = {
  name: "upgraderod",
  aliases: ["uprod"],
  category: "game",
  code: async (ctx) => {
    const userId = tools.general.getID(ctx.sender.jid);
    const input = ctx.args[0]?.toLowerCase() || null;

    // Define all rod levels in order
    const levels = ["bamboo", "iron", "gold", "iridium"];
    // Mapping upgrade: current → { next level, price }
    const upgradeMap = {
      bamboo:  { next: "iron",    price: 500 },
      iron:    { next: "gold",    price: 2000
       },
      gold:    { next: "iridium", price: 8000 }
    };

    // List command: show shop-like list of rods with upgrade prices
    if (input === "list") {
      const listItems = levels.map(level => {
        const info = upgradeMap[level];
        if (info) {
          return `${monospace(level)} → ${monospace(info.next)} : ${info.price} koin`;
        }
        return `${monospace(level)} : MAX LEVEL`;
      }).join("\n");

      return ctx.reply(
        quote(`🛒 Shop Rod Upgrade:`) +
        `
${listItems}` +
        `

Gunakan ${monospace(ctx.used.prefix + ctx.used.command + ' <level>')} untuk upgrade rod.`
      );
    }

    // Fetch or initialize current rod level (default bamboo)
    let current = (await db.get(`user.${userId}.rodlevel`))?.toLowerCase();
    if (!current) {
      current = "bamboo";
      await db.set(`user.${userId}.rodlevel`, current);
    }

    // If user asked status (no args)
    if (!input) {
      return ctx.reply(
        quote(`🪝 Rod saat ini: ${monospace(current)}`) +
        `
Gunakan ${monospace(ctx.used.prefix + ctx.used.command + ' list')} untuk daftar.`
      );
    }

    // Validate desired level
    if (!levels.includes(input)) {
      return ctx.reply(quote(`❎ Level '${input}' tidak valid!`));
    }

    const currentIndex = levels.indexOf(current);
    const targetIndex = levels.indexOf(input);

    // Already at this level
    if (targetIndex === currentIndex) {
      return ctx.reply(
        quote(`⚠️ Rodmu sudah di level ${monospace(current)}.`)
      );
    }

    // Cannot skip levels
    if (targetIndex > currentIndex + 1) {
      return ctx.reply(
        quote(`⚠️ Kamu tidak bisa lompat dari ${monospace(current)} ke ${monospace(input)}.`)
      );
    }

    // No downgrades
    if (targetIndex < currentIndex) {
      return ctx.reply(
        quote(`⚠️ Kamu tidak bisa menurunkan level rod.`)
      );
    }

    // Now targetIndex === currentIndex + 1: valid upgrade
    const info = upgradeMap[current];
    const userDb = (await db.get(`user.${userId}`)) || {};
    const coins = userDb.coin || 0;
    const isOwner = tools.general.isOwner(userId);
    const isPremium = userDb.premium;

    let costMsg = "";

    if (!isOwner && !isPremium) {
      // Check coins
      if (coins < info.price) {
        return ctx.reply(
          quote(`💔 Koinmu kurang! Butuh ${monospace(info.price)} untuk upgrade ke ${monospace(info.next)}.`)
        );
      }
      await db.add(`user.${userId}.coin`, -info.price);
      costMsg = `- ${monospace(info.price + ' koin')}`;
    } else {
      costMsg = `🔓 Gratis upgrade untuk ${isOwner ? 'Owner' : 'Premium User'}!`;
    }

    // Perform upgrade
    await db.set(`user.${userId}.rodlevel`, info.next);

    // Confirm
    return ctx.reply(
      quote(
        `✅ Upgrade sukses! Rodmu sekarang: ${monospace(info.next)}.` +
        `\n${costMsg}`
      )
    );
  }
};
