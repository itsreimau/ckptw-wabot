const {
    monospace,
    quote
} = require("@itsreimau/ckptw-mod");

module.exports = {
    name: "setprofile",
    aliases: ["set", "setp", "setprof"],
    category: "profile",
    permissions: {},
    code: async (ctx) => {
        const input = ctx.args.join(" ") || null;

        if (!input) return await ctx.reply(
            `${quote(`${tools.msg.generateInstruction(["send"], ["text"])}`)}\n` +
            `${quote(tools.msg.generateCommandExample(ctx.used, "autolevelup"))}\n` +
            quote(tools.msg.generateNotes([`Ketik ${monospace(`${ctx.used.prefix + ctx.used.command} list`)} untuk melihat daftar.`]))
        );

        if (["l", "list"].includes(input.toLowerCase())) {
            const listText = await tools.list.get("setprofile");
            return await ctx.reply(listText);
        }

        try {
            const senderId = tools.cmd.getID(ctx.sender.jid);
            const args = ctx.args;
            const command = args[0]?.toLowerCase();

            switch (command) {
                case "username": {
                    const input = args.slice(1).join(" ").trim();
                    if (!input) return await ctx.reply(quote("❎ Mohon masukkan username yang ingin digunakan."));

                    if (/[^a-zA-Z0-9._-]/.test(input)) return await ctx.reply(quote("❎ Username hanya boleh berisi huruf, angka, titik (.), underscore (_) dan tanda hubung (-)."));

                    const allUsers = await db.get("user") || {};
                    const usernameTaken = Object.values(allUsers).some(user => user.username === input);
                    if (usernameTaken) return await ctx.reply(quote("❎ Username tersebut sudah digunakan oleh pengguna lain."));

                    const username = `@${input}`
                    await db.set(`user.${senderId}.username`, username);
                    return await ctx.reply(quote(`✅ Username berhasil diubah menjadi '${username}'!`));
                    break;
                }
                case "autolevelup": {
                    const setKey = `user.${senderId}.autolevelup`;
                    const currentStatus = await db.get(setKey) || false;
                    const newStatus = !currentStatus;
                    await db.set(setKey, newStatus);

                    const statusText = newStatus ? "diaktifkan" : "dinonaktifkan";
                    return await ctx.reply(quote(`✅ Fitur '${command}' berhasil ${statusText}!`));
                    break;
                }
                default:
                    return await ctx.reply(quote("❎ Teks tidak valid."));
            }
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, false);
        }
    }
};