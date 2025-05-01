const { monospace, quote } = require("@mengkodingan/ckptw");

const COOLDOWN = 1 * 60 * 60 * 1000;      // 1 jam
const STREAK_TIMEOUT = 12 * 60 * 60 * 1000; // 12 jam

// daftar pekerjaan untuk work.js
const possibleJobs = ["Kamu membantu mengajar di sekolah dasar.", "Kamu membersihkan sampah di kastil.", "Kamu mengangkut barang ke pasar.", "Kamu memanen sayuran di ladang.", "Kamu memperbaiki jalan desa.", "Kamu merawat hewan di peternakan.", "Kamu memasak makanan di warung.", "Kamu merakit mainan di pabrik.", "Kamu mendistribusi surat ke warga.", "Kamu menjaga keamanan di gerbang kota.", "Kamu menata buku di perpustakaan.", "Kamu mengecat pagar rumah warga.", "Kamu menulis laporan bulanan kantor.", "Kamu menyapu daun di taman.", "Kamu membetulkan atap rumah.", "Kamu mengoperasikan mesin di pabrik.", "Kamu merajut kain di workshop.", "Kamu menyusui anak ayam di peternakan.", "Kamu menjahit pakaian di konveksi.", "Kamu menyiapkan dokumen di kantor pemerintahan."];

module.exports = {
  name: "kerja",
  aliases: ["work"],
  category: "game",
  code: async (ctx) => {
    const userId = tools.general.getID(ctx.sender.jid);
    const now = Date.now();

    // pilih deskripsi pekerjaan
    const jobMsg = possibleJobs[Math.floor(Math.random() * possibleJobs.length)];

    // waktu terakhir work dan streak
    const last = (await db.get(`user.${userId}.lastWorkTime`)) || 0;
    let streak = (await db.get(`user.${userId}.workStreak`)) || 0;

    // cek cooldown
    if (now - last < COOLDOWN) {
      const remMs = COOLDOWN - (now - last);
      const sec = Math.ceil(remMs / 1000);
      return ctx.reply(
        quote(`⏳ Tunggu ${monospace(Math.ceil(sec/60) + "m")} / ${monospace(sec + "s")} lagi sebelum bekerja.`)
      );
    }

    let lostStreakMsg = "";
    // cek apakah streak berlanjut atau terputus
    if (last && now - last > STREAK_TIMEOUT) {
      streak = 0;
      lostStreakMsg = quote(`⚠️ Streak-mu terputus! Bonus di-reset.`) + "\n";
    }

    // naikkan streak
    streak++;

    // hitung reward
    const base = Math.floor(Math.random() * (200 - 100 + 1)) + 100;
    const bonus = streak;
    const reward = base + bonus;

    // update database
    await db.set(`user.${userId}.lastWorkTime`, now);
    await db.set(`user.${userId}.workStreak`, streak);
    await db.add(`user.${userId}.coin`, reward);

    // kirim reply dengan deskripsi pekerjaan
    return ctx.reply(
      quote(jobMsg) + "\n" +
      lostStreakMsg +
      quote(`🛠️ Kamu bekerja dan mendapatkan:`) + "\n" +
      quote(`💰 +${monospace(base + " Coins")}`) + "\n" +
      quote(`✨ Bonus streak +${monospace(bonus + " Coins")}`) + "\n" +
      quote(`🔥 Streak-mu sekarang: ${monospace(streak)}`)
    );
  },
};
