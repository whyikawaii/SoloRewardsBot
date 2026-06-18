require("dotenv").config();
const express = require("express");
const path = require("path");
const { Telegraf } = require("telegraf");

const app = express();
const bot = new Telegraf(process.env.BOT_TOKEN);

// 🔥 Telegram Mini App URL
const WEBAPP_URL =
  "https://solorewardsbot-production.up.railway.app/webapp";

// ======================
// 📦 STATIC WEBAPP
// ======================
app.use("/webapp", express.static(path.join(__dirname, "webapp")));

// fallback (ОЧЕНЬ важно для Telegram)
app.get("/webapp", (req, res) => {
  res.sendFile(path.join(__dirname, "webapp", "index.html"));
});

// ======================
// 🤖 TELEGRAM BOT
// ======================
bot.start((ctx) => {
  return ctx.reply("🚀 Solo Rewards", {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "🎁 Open Solo Rewards",
            web_app: { url: WEBAPP_URL },
          },
        ],
      ],
    },
  });
});

// ======================
// 🟢 HEALTH CHECK
// ======================
app.get("/", (req, res) => {
  res.send("SoloRewards OK");
});

// ======================
// 🚀 START SERVER
// ======================
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log("Server started on port", PORT);
});

// ⚠️ bot.launch ВНЕ app.listen (важно для Railway)
bot.launch();

// ======================
// 🧹 graceful shutdown (Railway friendly)
// ======================
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
