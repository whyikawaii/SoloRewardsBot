require("dotenv").config();

const express = require("express");
const path = require("path");
const { Telegraf } = require("telegraf");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 8080;
const BOT_TOKEN = process.env.BOT_TOKEN;
const BASE_URL = process.env.BASE_URL || "http://localhost:8080";
const WEBAPP_URL = `${BASE_URL}/webapp`;

if (!BOT_TOKEN) throw new Error("BOT_TOKEN missing");

const bot = new Telegraf(BOT_TOKEN);

// ======================
// MEMORY DB (временная)
// ======================
const users = {};

// ======================
// API
// ======================
app.get("/", (req, res) => {
  res.send("Solo Rewards API OK");
});

// ======================
// WEBAPP
// ======================
app.use("/webapp", express.static(path.join(__dirname, "webapp")));

// ======================
// BOT START
// ======================
bot.start((ctx) => {
  const id = ctx.from.id;

  if (!users[id]) {
    users[id] = { xp: 0 };
  }

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

// ======================
// WEBAPP DATA
// ======================
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

// ======================
// START
// ======================
app.listen(PORT, () => {
  console.log("Server running:", PORT);
});

bot.launch();

console.log("Bot started");
