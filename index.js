require("dotenv").config();

const express = require("express");
const path = require("path");
const { Telegraf } = require("telegraf");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 8080;
const BOT_TOKEN = process.env.BOT_TOKEN;

// ⚠️ Railway или локалка
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;
const WEBAPP_URL = `${BASE_URL}/webapp`;

if (!BOT_TOKEN) {
  throw new Error("❌ BOT_TOKEN missing in .env");
}

const bot = new Telegraf(BOT_TOKEN);

// ======================
// MEMORY DB (временно)
// ======================
const users = {};

// ======================
// HEALTH CHECK
// ======================
app.get("/", (req, res) => {
  res.send("🚀 SoloRewards API OK");
});

// тест маршрута
app.get("/test", (req, res) => {
  res.send("OK TEST ROUTE WORKING");
});

// ======================
// MINI APP (ВАЖНО)
// ======================
const webappPath = path.join(__dirname, "webapp");

app.use("/webapp", express.static(webappPath));

app.get("/webapp", (req, res) => {
  res.sendFile(path.join(webappPath, "index.html"));
});

// ======================
// BOT
// ======================
bot.start((ctx) => {
  const id = ctx.from.id;

  if (!users[id]) {
    users[id] = {
      xp: 0,
      lastClaim: 0,
    };
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
// CLAIM API
// ======================
app.post("/api/claim", (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.json({ ok: false, error: "No userId" });
  }

  if (!users[userId]) {
    users[userId] = { xp: 0, lastClaim: 0 };
  }

  const now = Date.now();
  const cooldown = 24 * 60 * 60 * 1000;

  if (now - users[userId].lastClaim < cooldown) {
    return res.json({
      ok: false,
      error: "Cooldown",
    });
  }

  users[userId].xp += 10;
  users[userId].lastClaim = now;

  return res.json({
    ok: true,
    xp: users[userId].xp,
    gained: 10,
  });
});

// ======================
// START SERVER
// ======================
app.listen(PORT, () => {
  console.log(`🚀 Server running on ${PORT}`);
  console.log(`🌐 WebApp: ${WEBAPP_URL}`);
});

bot.launch();

console.log("🤖 Bot started");
