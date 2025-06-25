const {
    exec
} = require("node:child_process");
const util = require("node:util");

module.exports = {
    name: /^\$ /,
    type: "hears",
    code: async (ctx) => {
        const isOwner = tools.cmd.isOwner(ctx.getId(ctx.sender.jid), ctx.msg.key.id);
        if (!isOwner) return;

        try {
            const command = ctx.msg.content.slice(2);
            const output = await util.promisify(exec)(command);

            return await ctx.reply(formatter.monospace(output.stdout || output.stderr));
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, false, true);
        }
    }
};