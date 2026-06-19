require("dotenv").config();

const express = require("express");
const path = require("path");
const { Telegraf } = require("telegraf");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 8080;
const BOT_TOKEN = process.env.BOT_TOKEN;

// Railway domain (ВАЖНО)
const BASE_URL = process.env.RAILWAY_PUBLIC_DOMAIN
  ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`
  : `http://localhost:${PORT}`;

const WEBAPP_URL = `${BASE_URL}/webapp`;

if (!BOT_TOKEN) {
  throw new Error("BOT_TOKEN missing");
}

const bot = new Telegraf(BOT_TOKEN);

// ======================
// SIMPLE MEMORY DB
// ======================
const users = {};

// ======================
// HEALTH CHECK
// ======================
app.get("/", (req, res) => {
  res.send("🚀 SoloRewards API OK");
});

// ======================
// DEBUG ROUTE
// ======================
app.get("/debug", (req, res) => {
  res.json({
    ok: true,
    domain: BASE_URL,
    token: !!BOT_TOKEN,
  });
});

// ======================
// WEBAPP
// ======================
app.use("/webapp", express.static(path.join(__dirname, "webapp")));

app.get("/webapp", (req, res) => {
  res.sendFile(path.join(__dirname, "webapp", "index.html"));
});

// ======================
// BOT START
// ======================
bot.start((ctx) => {
  const id = ctx.from.id;

  if (!users[id]) {
    users[id] = { xp: 0 };
  }

  ctx.reply("🚀 Solo Rewards", {
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
// MESSAGE LOG (debug)
// ======================
bot.on("message", (ctx) => {
  console.log("MSG:", ctx.from.id);
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
    users[userId] = { xp: 0 };
  }

  users[userId].xp += 10;

  res.json({
    ok: true,
    xp: users[userId].xp,
  });
});

// ======================
// START SERVER + BOT
// ======================
app.listen(PORT, async () => {
  console.log("🚀 Server running:", PORT);
  console.log("🌐 WebApp:", WEBAPP_URL);

  try {
    await bot.launch();
    console.log("🤖 Bot started (polling mode)");
  } catch (e) {
    console.error("BOT ERROR:", e);
  }
});
