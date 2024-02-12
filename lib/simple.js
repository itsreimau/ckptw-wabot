exports.sendStatus = (ctx, info) => {
    switch (info) {
        case 'failure':
            ctx.react(ctx.id, '❎');
            break;
        case 'noRequest':
            ctx.react(ctx.id, '❓');
            break;
        case 'processing':
            ctx.react(ctx.id, '🔄');
            break;
        case 'success':
            ctx.react(ctx.id, '✅');
            break;
        default:
            ctx.reply(`Status "${info}" tidak dikenali!`);
            break;
    }
};