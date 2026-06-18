require("dotenv").config();
const express = require("express");
const path = require("path");
const { Telegraf } = require("telegraf");

const app = express();
app.use(express.json());

const bot = new Telegraf(process.env.BOT_TOKEN);

const WEBAPP_URL = process.env.WEBAPP_URL;

// ======================
// 🌐 MINI APP STATIC
// ======================
app.use("/webapp", express.static(path.join(__dirname, "webapp")));

app.get("/webapp", (req, res) => {
  res.sendFile(path.join(__dirname, "webapp", "index.html"));
});

// ======================
// 🤖 BOT START
// ======================
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

// ======================
// 🔐 WEBHOOK ENDPOINT
// ======================
app.post("/telegram-webhook", async (req, res) => {
  try {
    await bot.handleUpdate(req.body);
    res.sendStatus(200);
  } catch (e) {
    console.error("Webhook error:", e);
    res.sendStatus(500);
  }
});

// ======================
// 🟢 HEALTH CHECK
// ======================
app.get("/", (req, res) => {
  res.send("Solo Rewards API OK");
});

// ======================
// 🚀 START SERVER
// ======================
const PORT = process.env.PORT || 8080;

app.listen(PORT, async () => {
  console.log("Server running on", PORT);

  // webhook setup
  const url = `${process.env.PUBLIC_URL}/telegram-webhook`;

  await bot.telegram.setWebhook(url);

  console.log("Webhook set:", url);
});
