const {
    quote
} = require("@mengkodingan/ckptw");
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
                `${quote(`System Uptime: ${tools.general.convertMsToDuration(uptimeOS)}`)}\n` +
                `${quote("─────")}\n` +
                `${quote(`Digunakan: ${tools.general.formatSize(usedMem)}`)}\n` +
                `${quote(`Bebas: ${tools.general.formatSize(freeMem)}`)}\n` +
                `${quote(`Total: ${tools.general.formatSize(totalMem)}`)}\n` +
                `${quote(`Memori Aplikasi (RSS): ${tools.general.formatSize(memory.rss)}`)}\n` +
                `${quote("─────")}\n` +
                `${quote(`Model: ${cpus[0].model}`)}\n` +
                `${quote(`Kecepatan: ${cpus[0].speed} MHz`)}\n` +
                `${quote(`Cores: ${cpus.length}`)}\n` +
                `${quote(`Muat Rata-Rata (1m, 5m, 15m): ${load.map(n => n.toFixed(2)).join(", ")}`)}\n` +
                `${quote("─────")}\n` +
                `${quote(`Versi: ${process.version}`)}\n` +
                `${quote(`Platform: ${process.platform}`)}\n` +
                `${quote(`Jalur Exec: ${process.execPath}`)}\n` +
                `${quote(`PID: ${process.pid}`)}\n` +
                `${quote("─────")}\n` +
                `${quote(`Bot Uptime: ${tools.general.convertMsToDuration(Date.now() - startTime)}`)}\n` +
                `${quote(`Database: ${config.bot.dbSize} (Simpl.DB - JSON)`)}\n` +
                `${quote("Library: @mengkodingan/ckptw")}\n` +
                "\n" +
                config.msg.footer
            );
        } catch (error) {
            return await tools.cmd.handleError(ctx, error, false);
        }
    }
};