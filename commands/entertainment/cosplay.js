module.exports = {
    name: "cosplay",
    aliases: ["cosplayer"],
    category: "entertainment",
    permissions: {
        premium: true
    },
    code: async (ctx) => {
        try {
            const result = tools.api.createUrl("archive", "/api/random/cosplay");

            return await ctx.reply({
                image: {
                    url: result
                },
                mimetype: tools.mime.lookup("png"),
                footer: config.msg.footer,
                buttons: [{
                    buttonId: ctx.used.prefix + ctx.used.command,
                    buttonText: {
                        displayText: "Ambil Lagi"
                    },
                    type: 1
                }],
                headerType: 1
            });
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, true);
        }
    }
};