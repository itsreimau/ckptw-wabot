const {
    quote
} = require("@mengkodingan/ckptw");

function getRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}  

module.exports = { 
    name: "kapankah", 
    aliases: ["kapan"], 
    category: "entertainment",
    permissions: { 
        coin: 5
    },
    code: async (ctx) => { 
        const input = ctx.args.join(" ") || null;

        return await ctx.reply(quote(`*Pertanyaan:* kapankah ${input} \n`) +
quote(`*Jawaban:*  ${Math.floor(Math.random() * 60 + 1)} ${getRandom(['detik', 'menit', 'jam', 'hari', 'minggu', 'bulan', 'tahun', 'dekade', 'abad'])} lagi ...`) + '\n \n' + config.msg.footer)}
};