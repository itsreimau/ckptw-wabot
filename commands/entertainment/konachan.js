module.exports = {
    name: "konachan",
    category: "entertainment",
    permissions: {
        coin: 10
    },
    code: async (ctx) => {
        try {
            const result = tools.api.createUrl("nekorinn", "/random/konachan");

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