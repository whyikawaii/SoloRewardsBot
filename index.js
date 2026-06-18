require("dotenv").config();
const express = require("express");
const path = require("path");
const { Telegraf } = require("telegraf");

const app = express();
const bot = new Telegraf(process.env.BOT_TOKEN);

const WEBAPP_URL =
  "https://solorewardsbot-production.up.railway.app/webapp";

// --------------------
// WEBAPP STATIC
// --------------------
app.use("/webapp", express.static(path.join(__dirname, "webapp")));

app.get("/webapp", (req, res) => {
  res.sendFile(path.join(__dirname, "webapp", "index.html"));
});

// --------------------
// BOT
// --------------------
bot.start((ctx) => {
  return ctx.reply("🚀 Solo Rewards", {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "🎁 Открыть приложение",
            web_app: { url: WEBAPP_URL },
          },
        ],
      ],
    },
  });
});

// --------------------
// HEALTH CHECK
// --------------------
app.get("/", (req, res) => {
  res.send("OK");
});

// --------------------
// START SERVER FIRST
// --------------------
const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () => {
  console.log("Server started on", PORT);

  // ⚠️ bot запускаем ПОСЛЕ старта сервера
  bot.launch().then(() => {
    console.log("Bot started");
  }).catch((err) => {
    console.error("Bot launch error:", err);
  });
});

// --------------------
// GRACEFUL STOP
// --------------------
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
