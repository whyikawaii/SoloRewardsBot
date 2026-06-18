require("dotenv").config();
const express = require("express");
const path = require("path");
const { Telegraf } = require("telegraf");

const app = express();
app.use(express.json());

const bot = new Telegraf(process.env.BOT_TOKEN);

// ======================
// 🔒 SAFE ENV (НОРМАЛЬНЫЙ ПОДХОД)
// ======================
const BASE_URL = process.env.BASE_URL;
const PORT = process.env.PORT || 8080;

// ======================
// 🟢 HEALTH CHECK
// ======================
app.get("/", (req, res) => {
  res.status(200).send("Solo Rewards API OK");
});

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
            web_app: {
              url: process.env.WEBAPP_URL || BASE_URL + "/webapp",
            },
          },
        ],
      ],
    },
  });
});

// ======================
// 🔐 WEBHOOK
// ======================
app.post("/telegram-webhook", async (req, res) => {
  try {
    await bot.handleUpdate(req.body);
    res.sendStatus(200);
  } catch (err) {
    console.error("Webhook error:", err);
    res.sendStatus(200);
  }
});

// ======================
// 🚀 START SERVER (STABLE VERSION)
// ======================
app.listen(PORT, async () => {
  console.log("Server running on", PORT);

  try {
    if (!BASE_URL) {
      console.log("⚠️ BASE_URL is not set, webhook skipped");
      return;
    }

    const webhookUrl = `${BASE_URL}/telegram-webhook`;

    await bot.telegram.setWebhook(webhookUrl);

    console.log("Webhook set:", webhookUrl);
  } catch (e) {
    console.error("Webhook setup error:", e);
  }
});
