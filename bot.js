const { Telegraf } = require("telegraf");
require("dotenv").config();

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => {
  const url = process.env.BASE_URL + "/webapp/index.html";

  ctx.reply("🚀 Solo Rewards", {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "📱 Open App",
            web_app: { url }
          }
        ]
      ]
    }
  });
});

module.exports = bot;