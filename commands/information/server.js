const {
    quote
} = require("@itsreimau/ckptw-mod");
const os = require("node:os");
const process = require("node:process");

module.exports = {
    name: "server",
    category: "information",
    permissions: {},
    code: async (ctx) => {
        try {
            const startTime = config.bot.readyAt;
            const memory = process.memoryUsage();
            const totalMem = os.totalmem();
            const freeMem = os.freemem();
            const usedMem = totalMem - freeMem;
            const uptimeOS = os.uptime() * 1000;
            const load = os.loadavg();
            const cpus = os.cpus();

            return await ctx.reply(
                `${quote(`OS: ${os.type()} (${os.platform()})`)}\n` +
                `${quote(`Arch: ${os.arch()}`)}\n` +
                `${quote(`Release: ${os.release()}`)}\n` +
                `${quote(`Hostname: ${os.hostname()}`)}\n` +
                `${quote(`System Uptime: ${tools.msg.convertMsToDuration(uptimeOS)}`)}\n` +
                `${quote("─────")}\n` +
                `${quote(`Digunakan: ${tools.msg.formatSize(usedMem)}`)}\n` +
                `${quote(`Bebas: ${tools.msg.formatSize(freeMem)}`)}\n` +
                `${quote(`Total: ${tools.msg.formatSize(totalMem)}`)}\n` +
                `${quote(`Memori Aplikasi (RSS): ${tools.msg.formatSize(memory.rss)}`)}\n` +
                `${quote("─────")}\n` +
                `${quote(`Model: ${cpus[0].model}`)}\n` +
                `${quote(`Kecepatan: ${cpus[0].speed} MHz`)}\n` +
                `${quote(`Cores: ${cpus.length}`)}\n` +
                `${quote(`Muat Rata-Rata (1m, 5m, 15m): ${load.map(l => l.toFixed(2)).join(", ")}`)}\n` +
                `${quote("─────")}\n` +
                `${quote(`Versi NodeJS: ${process.version}`)}\n` +
                `${quote(`Platform: ${process.platform}`)}\n` +
                `${quote(`Jalur Exec: ${process.execPath}`)}\n` +
                `${quote(`PID: ${process.pid}`)}\n` +
                `${quote("─────")}\n` +
                `${quote(`Bot Uptime: ${config.bot.uptime}`)}\n` +
                `${quote(`Database: ${config.bot.dbSize} (Simpl.DB - JSON)`)}\n` +
                `${quote("Library: @itsreimau/ckptw-mod (Fork of @mengkodingan/ckptw)")}\n` +
                "\n" +
                config.msg.footer
            );
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, false);
        }
    }
};