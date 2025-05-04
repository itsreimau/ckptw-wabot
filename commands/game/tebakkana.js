const { quote, monospace } = require("@mengkodingan/ckptw");
const fetch = require("node-fetch");

const session = new Map();

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

module.exports = {
  name: "tebakkana",
  category: "game",
  description: "Quiz kana ↔ romaji untuk JLPT (misal: .kana n5)",
  code: async (ctx) => {
    const arg = (ctx.args[0] || '').toLowerCase();
    const levelMap = { n5: 5, n4: 4, n3: 3, n2: 2, n1: 1 };
    const lvl = levelMap[arg];
    if (!lvl) return ctx.reply(quote("❎ Gunakan: .kana <level> (n5, n4, n3, n2, n1)"));

    if (session.has(ctx.id)) return ctx.reply(quote("❗ Masih ada sesi kuis yang berlangsung!"));

    try {
      const res = await fetch(`https://jlpt-vocab-api.vercel.app/api/words?level=${lvl}&limit=662`);
      const json = await res.json();
      const pool = json.words;

      if (!pool.length) return ctx.reply(quote(`❎ Tidak ada data untuk level ${arg}`));

      const entry = pickRandom(pool);
      const toRomaji = Math.random() < 0.5;
      let question, answer, hint;
      if (toRomaji) {
        question = `Apa romaji untuk: ${entry.furigana || entry.word}`;
        answer = entry.romaji;
        hint = entry.romaji.replace(/[aiueo]/g, '_');
      } else {
        question = `Tulis kana untuk romaji: ${entry.romaji}`;
        answer = entry.furigana || entry.word;
        hint = answer.replace(/[あいうえおアイウエオ]/g, '_');
      }

      const game = {
        answer: answer.toLowerCase(),
        meaning: entry.meaning,
        hint,
        timeout: 60000
      };

      session.set(ctx.id, true);

      await ctx.reply(
        `${quote(`🔤 Quiz (${arg.toUpperCase()}):`)}\n` +
        `${question}\n\n` +
        `${quote(`💡 Gunakan ${monospace("hint")} untuk bantuan, atau ${monospace("surrender")} untuk menyerah.`)}\n` +
        `${quote(`⏳ Batas waktu: ${game.timeout / 1000} detik.`)}`
      );

      const collector = ctx.MessageCollector({ time: game.timeout });

      collector.on("collect", async (m) => {
        const msg = m.content.toLowerCase();
        const id = tools.general.getID(m.sender);

        if (msg === game.answer) {
          session.delete(ctx.id);
          await db.add(`user.${id}.winGame`, 1);
          await db.add(`user.${id}.credz`, 5);
          await ctx.sendMessage(ctx.id, {
            text: quote(`✅ Benar! +5 Credz \n${game.answer} (${game.meaning})`),
          }, { quoted: m });
          return collector.stop();
        } else if (msg === "hint") {
          await ctx.sendMessage(ctx.id, {
            text: quote(`🔍 Hint: ${monospace(game.hint)}`)
          }, { quoted: m });
        } else if (msg === "surrender") {
          session.delete(ctx.id);
          await ctx.sendMessage(ctx.id, {
            text: quote(`🏳️ Menyerah! Jawabannya: ${game.answer} (${game.meaning})`)
          }, { quoted: m });
          return collector.stop();
        }
      });

      collector.on("end", async () => {
        if (session.has(ctx.id)) {
          session.delete(ctx.id);
          await ctx.reply(
            `${quote("⏱ Waktu habis!")}\nJawabannya: ${game.answer} (${game.meaning})`
          );
        }
      });

    } catch (err) {
      session.delete(ctx.id);
      return ctx.reply(
        quote("❎ Gagal mengambil data dari API. Pastikan koneksi internet aktif.")
      );
    }
  }
};

