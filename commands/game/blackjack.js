// blackjack.js
const { monospace, quote } = require("@mengkodingan/ckptw");

// session map to prevent multiple games in same chat
const sessions = new Map();

// build a standard deck
function createDeck() {
  const suits = ['♠', '♥', '♣', '♦'];
  const ranks = [
    { name: 'A', value: 11 },
    { name: '2', value: 2 },
    { name: '3', value: 3 },
    { name: '4', value: 4 },
    { name: '5', value: 5 },
    { name: '6', value: 6 },
    { name: '7', value: 7 },
    { name: '8', value: 8 },
    { name: '9', value: 9 },
    { name: '10', value: 10 },
    { name: 'J', value: 10 },
    { name: 'Q', value: 10 },
    { name: 'K', value: 10 }
  ];
  const deck = [];
  for (let suit of suits) for (let r of ranks) {
    deck.push({ name: `${r.name}${suit}`, value: r.value });
  }
  return deck;
}

// shuffle with Fisher-Yates
function shuffle(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

// calculate best score, treating Aces as 11 or 1
function calcScore(hand) {
  let total = hand.reduce((sum, c) => sum + c.value, 0);
  let aces = hand.filter(c => c.name.startsWith('A')).length;
  while (total > 21 && aces > 0) {
    total -= 10;
    aces--;
  }
  return total;
}

module.exports = {
  name: "blackjack",
  category: "game",
  aliases: ["bj"],
  code: async (ctx) => {
    const chatId = ctx.id;
    if (sessions.has(chatId)) {
      return ctx.reply(quote("🎲 Permainan Blackjack sedang berlangsung!"));
    }
    sessions.set(chatId, true);

    try {
      // parse bet amount
      const betArg = ctx.args[0];
      const bet = parseInt(betArg, 10);
      if (!betArg || isNaN(bet) || bet < 10) {
        sessions.delete(chatId);
        return ctx.reply(
          quote(`Usage: ${monospace(ctx.used.prefix + ctx.used.command)} <taruhan 10 atau lebih>`)
        );
      }

      const userId = tools.general.getID(ctx.sender.jid);
      const userDb = (await db.get(`user.${userId}`)) || {};
      const coins = userDb.coin || 0;
      if (coins < bet) {
        sessions.delete(chatId);
        return ctx.reply(quote("❎ Anda tidak memiliki cukup koin untuk bertaruh!"));
      }

      // deduct bet
      await db.add(`user.${userId}.coin`, -bet);

      // prepare deck and hands
      const deck = createDeck();
      shuffle(deck);
      const player = [deck.pop(), deck.pop()];
      const dealer = [deck.pop(), deck.pop()];

      // initial display
      await ctx.reply(
        `${quote(`Dealer: ${monospace(dealer[0].name)} ❓`)}\n` +
        `${quote(`Anda: ${monospace(player.map(c => c.name).join(', '))} (Total: ${calcScore(player)})`)}\n` +
        `${quote(`Ketik ${monospace('hit')} atau ${monospace('stand')}.`)}`
      );

      // collector
      const collector = ctx.MessageCollector({ time: 60000 });
      collector.on('collect', async m => {
        const cmd = m.content.toLowerCase();
        if (cmd !== 'hit' && cmd !== 'stand') return;

        // player action
        if (cmd === 'hit') {
          player.push(deck.pop());
          const score = calcScore(player);
          if (score > 21) {
            // bust
            sessions.delete(chatId);
            await ctx.sendMessage(chatId, {
              text: quote(
                `💥 BUST! Anda mengambil ${monospace(player.at(-1).name)}.` +
                `\nTotal Anda: ${score}. Anda kalah ${bet} koin.`
              )
            }, { quoted: m });
            collector.stop();
          } else {
            // still in game
            await ctx.sendMessage(chatId, {
              text: quote(
                `Anda mengambil ${monospace(player.at(-1).name)}. Total Anda sekarang ${score}.` +
                `\nKetik ${monospace('hit')} atau ${monospace('stand')}.`
              )
            }, { quoted: m });
          }
        } else {
          // stand: dealer draws
          let dealerScore = calcScore(dealer);
          while (dealerScore < 17) {
            dealer.push(deck.pop());
            dealerScore = calcScore(dealer);
          }

          const playerScore = calcScore(player);
          let resultMsg;
          if (dealerScore > 21 || playerScore > dealerScore) {
            // player wins
            await db.add(`user.${userId}.coin`, bet * 2);
            resultMsg = `🎉 Anda menang! Anda: ${playerScore}, Dealer: ${dealerScore}. Anda mendapat ${bet} koin.`;
          } else if (playerScore === dealerScore) {
            // push: return bet
            await db.add(`user.${userId}.coin`, bet);
            resultMsg = `🤝 Push! Anda: ${playerScore}, Dealer: ${dealerScore}. Taruhan dikembalikan.`;
          } else {
            // dealer wins
            resultMsg = `💔 Anda kalah! Anda: ${playerScore}, Dealer: ${dealerScore}. Anda kehilangan ${bet} koin.`;
          }

          sessions.delete(chatId);
          await ctx.sendMessage(chatId, { text: quote(resultMsg) }, { quoted: m });
          collector.stop();
        }
      });

      collector.on('end', () => {
        sessions.delete(chatId);
      });

    } catch (e) {
      sessions.delete(chatId);
      console.error(e);
      return tools.cmd.handleError(ctx, e, false);
    }
  }
};

