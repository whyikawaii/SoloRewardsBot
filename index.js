require("dotenv").config();

const express = require("express");
const path = require("path");
const { Telegraf } = require("telegraf");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 8080;
const BOT_TOKEN = process.env.BOT_TOKEN;

if (!BOT_TOKEN) {
  throw new Error("BOT_TOKEN missing");
}

const bot = new Telegraf(BOT_TOKEN);

// --------------------
// MEMORY DB
// --------------------
const users = {};

// --------------------
// API TEST
// --------------------
app.get("/", (req, res) => {
  res.send("API OK");
});

// --------------------
// WEBAPP
// --------------------
app.use("/webapp", express.static(path.join(__dirname, "webapp")));

// --------------------
// BOT START
// --------------------
bot.start((ctx) => {
  const id = ctx.from.id;

  if (!users[id]) {
    users[id] = { xp: 0 };
  }

  return ctx.reply("🚀 Solo Rewards работает", {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Открыть приложение",
            web_app: {
              url: process.env.WEBAPP_URL || "http://localhost:8080/webapp",
            },
          },
        ],
      ],
    },
  });
});

// --------------------
// SIMPLE CLAIM (без защиты пока)
// --------------------
app.post("/api/claim", (req, res) => {
  const { userId } = req.body;

  if (!users[userId]) {
    users[userId] = { xp: 0 };
  }

  users[userId].xp += 10;

  res.json({
    ok: true,
    xp: users[userId].xp,
  });
});

// --------------------
// START SERVER
// --------------------
app.listen(PORT, () => {
  console.log("Server running on", PORT);
});

bot.launch();

console.log("Bot started (polling mode)");
