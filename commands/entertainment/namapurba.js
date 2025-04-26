const {
    quote
} = require("@mengkodingan/ckptw");

module.exports = { 
    name: "namapurba", 
    aliases: ["purba"], 
    category: "entertainment",
    permissions: { 
        coin: 5
    },
    code: async (ctx) => { 
        const input = ctx.args.join(" ") || null;

        return await ctx.reply(quote("Nama biasa : " + input + '\n') + quote("Nama purba : " + input.replace(/[aiueo]/gi, '$&ve')) + '\n \n' + config.msg.footer);
    }
};