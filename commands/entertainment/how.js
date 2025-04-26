const {
    quote
} = require("@mengkodingan/ckptw");

module.exports = { 
    name: "how", 
    aliases: ["segimana"], 
    category: "entertainment",
    permissions: { 
        coin: 5
    },
    code: async (ctx) => { 
        const types = ctx.args[0] || null;
        const input = ctx.args[1] || null;

        return await ctx.reply(quote(`Pertanyaan : how ${types} is *${input}*` + '\n' +
quote(`Jawab : *${input}* is *${Math.floor(Math.random() * 100)}*% ${types.toUpperCase()}`) + '\n \n' + config.msg.footer));
    }
};