require("dotenv").config();
const express = require("express");
const path = require("path");
const { Telegraf } = require("telegraf");

const app = express();
app.use(express.json());

const bot = new Telegraf(process.env.BOT_TOKEN);

// ======================
// 🌐 MINI APP STATIC
// ======================
app.use("/webapp", express.static(path.join(__dirname, "webapp")));

app.get("/webapp", (req, res) => {
  res.sendFile(path.join(__dirname, "webapp", "index.html"));
});

// ======================
// 🟢 HEALTH CHECK
// ======================
app.get("/", (req, res) => {
  res.status(200).send("Solo Rewards API OK");
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
            web_app: { url: process.env.WEBAPP_URL },
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
  } catch (err) {
    console.error("Webhook error:", err);
    res.sendStatus(500);
  }
});

// ======================
// 🚀 START SERVER + WEBHOOK
// ======================
const PORT = process.env.PORT || 8080;

app.listen(PORT, async () => {
  try {
    console.log("Server running on", PORT);

    const baseUrl = process.env.PUBLIC_URL;

    if (!baseUrl) {
      throw new Error("PUBLIC_URL is missing in env");
    }

    const webhookUrl = `${baseUrl}/telegram-webhook`;

    await bot.telegram.setWebhook(webhookUrl);

    console.log("Webhook set:", webhookUrl);
  } catch (e) {
    console.error("Startup error:", e);
  }
});
