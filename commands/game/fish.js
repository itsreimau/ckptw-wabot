const { monospace, quote } = require("@mengkodingan/ckptw");
const session = new Map();

// rarities & rewards
const rarities = ["common","uncommon","rare","epic","mythic"];
const chanceTable = {
  bamboo:   { common:70, uncommon:20, rare:8,  epic:2,  mythic:0 },
  iron:     { common:60, uncommon:25, rare:10, epic:4,  mythic:1 },
  gold:     { common:50, uncommon:30, rare:12, epic:6,  mythic:2 },
  iridium:  { common:38, uncommon:30, rare:17, epic:11, mythic:4 },
};
const rewardTable = { common: 5, uncommon:10, rare:25, epic:50, mythic:100 };

const COOLDOWN = 1 * 60 * 1000; // 1 menit

function getFishRarity(rod) {
  const chances = chanceTable[rod] || chanceTable.bamboo;
  const roll = Math.random()*100;
  let cum=0;
  for (let r of rarities) {
    cum += chances[r];
    if (roll < cum) return r;
  }
  return "common";
}

module.exports = {
  name: "fish",
  category: "game",
  code: async (ctx) => { 
    const userId = tools.general.getID(ctx.sender.jid);
    const now = Date.now();

    // baca lastFishTime dari db (default 0)
    const last = await db.get(`user.${userId}.lastFishTime`) || 0;
    if (now - last < COOLDOWN) {
      const rem = Math.ceil((COOLDOWN - (now - last)) / 1000);
      return ctx.reply(quote(`🕔 Tunggu ${monospace(rem + "s")} lagi sebelum fishing.`));
    }

    // update cooldown di db
    await db.set(`user.${userId}.lastFishTime`, now);

    // fishing logic
    let rod = (await db.get(`user.${userId}.rodlevel`))?.toLowerCase();
    if (!rod) {
      rod = "bamboo";
      await db.set(`user.${userId}.rodlevel`, rod);
    }
    const rarity = getFishRarity(rod);
    const reward = rewardTable[rarity];

    await db.add(`user.${userId}.coin`, reward);

    return ctx.reply(
      `${quote(`🎣 Kamu fishing dengan ${monospace(rod)} rod!`)}\n` +
      `${quote(`✨ Kamu dapet ${monospace(rarity.toUpperCase())} fish!`)}\n` +
      `${quote(`💰 +${reward} Coins!`)}`
    );
  }
};
