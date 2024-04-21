module.exports = {
    apps: [{
        name: global.bot.pm2Name,
        script: './index.js',
        watch: true,
        ignore_watch: ['node_modules', 'state']
    }]
};